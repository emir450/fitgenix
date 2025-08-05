import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    soru: "",
    hedef: "",
    boy: "",
    kilo: "",
    yas: "",
    cinsiyet: "erkek",
  });

  const [cevap, setCevap] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setYukleniyor(true);
    setCevap("");

    try {
      const res = await fetch("/api/oner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setCevap(data.oneri || "Bir hata oluştu.");
    } catch (err) {
      setCevap("Hata: Sunucuya ulaşılamıyor.");
    }

    setYukleniyor(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1>Fitgenix - Yapay Zekâdan Kişisel Öneri Al</h1>
      <form onSubmit={handleSubmit}>
        <label>Soru:</label>
        <input name="soru" value={form.soru} onChange={handleChange} required /><br />

        <label>Hedefiniz:</label>
        <input name="hedef" value={form.hedef} onChange={handleChange} required /><br />

        <label>Boy (cm):</label>
        <input type="number" name="boy" value={form.boy} onChange={handleChange} required /><br />

        <label>Kilo (kg):</label>
        <input type="number" name="kilo" value={form.kilo} onChange={handleChange} required /><br />

        <label>Yaş:</label>
        <input type="number" name="yas" value={form.yas} onChange={handleChange} required /><br />

        <label>Cinsiyet:</label>
        <select name="cinsiyet" value={form.cinsiyet} onChange={handleChange}>
          <option value="erkek">Erkek</option>
          <option value="kadın">Kadın</option>
        </select><br /><br />

        <button type="submit" disabled={yukleniyor}>
          {yukleniyor ? "Yükleniyor..." : "Öneri Al"}
        </button>
      </form>

      {cevap && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc" }}>
          <strong>Yapay Zekâdan Öneri:</strong>
          <p>{cevap}</p>
        </div>
      )}
    </div>
  );
}
