import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST yöntemi destekleniyor." });
  }

  const { soru, hedef, boy, kilo, yas, cinsiyet } = req.body;

  if (!soru || !hedef || !boy || !kilo || !yas || !cinsiyet) {
    return res.status(400).json({ error: "Tüm alanlar doldurulmalıdır." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Sen bir sağlık ve yaşam koçusun. Kullanıcılara sağlıklı yaşam konusunda öneriler sunuyorsun.",
        },
        {
          role: "user",
          content: `Soru: ${soru}
Hedef: ${hedef}
Boy: ${boy} cm
Kilo: ${kilo} kg
Yaş: ${yas}
Cinsiyet: ${cinsiyet}
Bu bilgilerle kişiye özel bir öneri ver.`,
        },
      ],
    });

    const oneri = completion.choices[0]?.message?.content;
    res.status(200).json({ oneri });
  } catch (error) {
    res.status(500).json({ error: "OpenAI isteği başarısız oldu." });
  }
}
