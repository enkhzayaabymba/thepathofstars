"use client";

import { useState } from "react";

type Props = {
  loading: boolean;
  onSubmit: (address: string, phone: string) => void;
  onCancel: () => void;
};

const DISTRICTS = [
  "Баянзүрх", "Сүхбаатар", "Хан-Уул", "Баянгол",
  "Чингэлтэй", "Сонгинохайрхан", "Налайх", "Багануур", "Багахангай",
];

const inputStyle = {
  border: "1px solid var(--border)",
  borderRadius: "8px",
  color: "var(--text-primary)",
  backgroundColor: "var(--bg-main)",
  width: "100%",
};

export default function CheckoutForm({ loading, onSubmit, onCancel }: Props) {
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [detail, setDetail] = useState("");
  const [postal, setPostal] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault();
    const address = `${district} дүүрэг, ${detail}${postal ? `, орчны код: ${postal}` : ""}`;
    onSubmit(address, phone);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-6 py-5"
      style={{ borderTop: "1px solid var(--border)" }}>
      <p style={{ color: "var(--text-primary)" }} className="font-semibold text-sm">
        Хүргэлтийн мэдээлэл
      </p>

      <div className="flex flex-col gap-1">
        <label style={{ color: "var(--text-secondary)" }} className="text-xs">Дүүрэг</label>
        <select required style={inputStyle} className="px-3 py-2 text-sm outline-none"
          value={district} onChange={(e) => setDistrict(e.target.value)}>
          {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label style={{ color: "var(--text-secondary)" }} className="text-xs">Дэлгэрэнгүй хаяг</label>
        <textarea required rows={2} style={inputStyle} className="px-3 py-2 text-sm outline-none resize-none"
          placeholder="Хороо, байр, тоот..." value={detail} onChange={(e) => setDetail(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1">
        <label style={{ color: "var(--text-secondary)" }} className="text-xs">Орчны код</label>
        <input type="text" style={inputStyle} className="px-3 py-2 text-sm outline-none"
          placeholder="Жишээ: 13, 20А..." value={postal} onChange={(e) => setPostal(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1">
        <label style={{ color: "var(--text-secondary)" }} className="text-xs">Утасны дугаар</label>
        <input required type="tel" style={inputStyle} className="px-3 py-2 text-sm outline-none"
          placeholder="99xxxxxx" minLength={8} pattern="[0-9]{8,}"
          title="Утасны дугаар хамгийн багадаа 8 орон байх ёстой"
          value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <button type="submit" disabled={loading}
        style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", borderRadius: "100px", opacity: loading ? 0.6 : 1 }}
        className="w-full py-3 text-sm font-semibold transition-opacity">
        {loading ? "Захиалж байна..." : "Захиалга баталгаажуулах"}
      </button>

      <button type="button" onClick={onCancel}
        style={{ color: "var(--text-secondary)" }}
        className="text-xs text-center hover:opacity-60 transition-opacity">
        ← Буцах
      </button>
    </form>
  );
}
