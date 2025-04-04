import { OpenAI } from "openai";
import { FormData } from "@/types/formData";

import { channelInstructions } from "@/constants/promptInstructions";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function generateCopy(formData: FormData) {
  // Note: For simplicity, user auth check is omitted here. Integrate Clerk's useUser in the component if needed.
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
    - از کلمات کلیدی (${formData.keywords.join(", ")}) به طور طبیعی استفاده کند
  `;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });
  const copy = response.choices[0].message.content || "";
  return { prompt, copy };
}
