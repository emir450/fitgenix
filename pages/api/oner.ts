import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Sadece POST isteği destekleniyor." });
  }

  const { soru, hedef, boy, kilo, yas, cinsiyet } = req.body;

  if (!soru || !hedef || !boy || !kilo || !yas || !cinsiyet) {
    return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
  }

  const prompt = `
Sen bir fitness ve sağlık uzmanısın. Kullanıcının bilgilerine göre detaylı, motive edici ve uygulanabilir bir öneri ver.
- Soru: ${soru}
- Hedef: ${hedef}
- Boy: ${boy} cm
- Kilo: ${kilo} kg
- Yaş: ${yas}
- Cinsiyet: ${cinsiyet}

Lütfen sadece öneriyi yaz ve açıklayıcı ol.
`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const cevap = completion.choices[0].message?.content || "Bir öneri üretilemedi.";
    res.status(200).json({ oneri: cevap });
  } catch (error: any) {
    console.error("OpenAI API hatası:", error);
    res.status(500).json({ message: "Sunucu hatası: " + error.message });
  }
}
