import { OpenAI } from "openai";
import { FormData } from "@/types/formData";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateMainIdea(formData: FormData): Promise<string[]> {
  const prompt = `
    شما یک کپی‌رایتر حرفه‌ای هستید. بر اساس اطلاعات زیر، 3 ایده اصلی جذاب و خلاقانه برای محتوای کپی‌رایتینگ پیشنهاد دهید که:
    - با صدای برند (${formData.brandVoice}) هماهنگ باشد
    - احساس ${formData.emotion} را منتقل کند
    - به هدف کمپین (${formData.campaignGoal}) کمک کند
    - متناسب با کانال بازاریابی (${formData.marketingChannel}) باشد
    اطلاعات کمپین:\n${JSON.stringify(formData, null, 2)}
    لطفاً ایده‌ها را به صورت لیست کوتاه و واضح ارائه دهید.
  `;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });
  return response.choices[0].message.content?.split("\n").filter(Boolean) || [];
}
