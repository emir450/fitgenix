// pages/api/oner.ts

import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Yalnızca POST isteği desteklenir." });
  }

  const { soru, hedef, boy, kilo, yas, cinsiyet } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Sen profesyonel bir fitness ve sağlık danışmanısın.",
        },
        {
          role: "user",
          content: `Soru: ${soru}\nHedef: ${hedef}\nBoy: ${boy} cm\nKilo: ${kilo} kg\nYaş: ${yas}\nCinsiyet: ${cinsiyet}`,
        },
      ],
      model: "gpt-4",
    });

    const yanit = completion.choices[0]?.message?.content;
    res.status(200).json({ oneri: yanit });
  } catch (err: any) {
    console.error("API hatası:", err);
    res.status(500).json({ oneri: "Sunucu hatası." });
  }
}
