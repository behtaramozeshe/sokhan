import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { FormData } from "@/types/formData";
import { databases } from "@/utils/appwrite";
import { channelInstructions } from "@/constants/promptInstructions";
import { getAuth } from "@clerk/nextjs/server";
import { AppwriteException } from "appwrite"; // Import for error typing

const openai = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const DATABASE_ID = "67eaf6a0002147077712";
const COLLECTION_ID = "67eaf6e000209cd8f310";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید." },
        { status: 401 }
      );
    }

    const formData: FormData = await req.json();

    // Check usage limit (total 4 calls per user)
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        userId
      );
      const newCount = document.count + 1;
      if (newCount > 4) {
        return NextResponse.json(
          { error: "حد مجاز 4 درخواست API برای این کاربر به پایان رسیده است." },
          { status: 429 }
        );
      }
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, userId, {
        count: newCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Type error as AppwriteException
      if (error instanceof AppwriteException && error.code === 404) {
        // New user, create document with count 1
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          userId,
          {
            count: 1,
            timestamp: new Date().toISOString(),
          },
          ['read("any")']
        );
      } else {
        throw error; // Re-throw other errors
      }
    }

    const channelInstruction =
      channelInstructions[formData.marketingChannel] || "";
    const prompt = `
      شما یک کپی‌رایتر حرفه‌ای هستید که در تولید محتوای جذاب و مؤثر تخصص دارید. بر اساس اطلاعات زیر، یک محتوای کپی‌رایتینگ باکیفیت بالا تولید کنید:
      - اطلاعات کمپین: ${JSON.stringify(formData, null, 2)}
      - دستورالعمل کانال: ${channelInstruction}
      لطفاً محتوا را به زبان فارسی بنویسید و مطمئن شوید که:
      - لحن با صدای برند (${formData.brandVoice}) سازگار باشد
      - احساس ${formData.emotion} به وضوح منتقل شود
      - به هدف کمپین (${formData.campaignGoal}) دست یابد
      - نقاط درد (${formData.customerPains.join(
        ", "
      )}) و خواسته‌ها (${formData.customerDesires.join(", ")}) را در نظر بگیرد
      - از کلمات کلیدی (${formData.keywords.join(
        ", "
      )}) به طور طبیعی استفاده کند
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const copy = response.choices[0].message.content || "";

    return NextResponse.json({ prompt, copy }, { status: 200 });
  } catch (error) {
    console.error("Error generating copy:", error);
    return NextResponse.json({ error: "خطا در تولید کپی" }, { status: 500 });
  }
}
