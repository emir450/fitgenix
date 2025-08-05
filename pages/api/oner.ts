export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Sadece POST isteklerine izin verilir' });
  }

  const { yas, cinsiyet, hedef } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_ANAHTAR}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Sen bir kişisel fitness ve sağlık asistanısın. Kullanıcıya onun bilgilerine göre öneri ver.'
        },
        {
          role: 'user',
          content: `Yaş: ${yas}, Cinsiyet: ${cinsiyet}, Hedef: ${hedef}.`
        }
      ]
    }),
  });

  const data = await response.json();
  res.status(200).json({ yanit: data.choices[0].message.content });
}
