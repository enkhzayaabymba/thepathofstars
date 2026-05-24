"use client";

type Props = {
  orderId: string;
  amount: number;
  onClose: () => void;
};

const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME ?? "Хаан банк";
const BANK_ACCOUNT = process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? "0000000000";
const BANK_OWNER = process.env.NEXT_PUBLIC_BANK_OWNER ?? "Дэлгүүр";

const rows = (ref: string, amount: number) => [
  { label: "Банк",              value: BANK_NAME },
  { label: "Дансны дугаар",     value: BANK_ACCOUNT },
  { label: "Хүлээн авагч",      value: BANK_OWNER },
  { label: "Шилжүүлэх дүн",    value: `₮${amount.toLocaleString()}` },
  { label: "Гүйлгээний утга",   value: ref, bold: true },
];

export default function BankTransferInfo({ orderId, amount, onClose }: Props) {
  const ref = orderId.slice(0, 8).toUpperCase();

  return (
    <div className="flex flex-col gap-4 px-6 py-5" style={{ borderTop: "1px solid var(--border)" }}>

      <div className="flex flex-col items-center gap-1 pt-1">
        <span className="text-3xl">✅</span>
        <p style={{ color: "var(--text-primary)" }} className="font-semibold text-sm mt-1">Захиалга хийгдлээ!</p>
        <p style={{ color: "var(--text-secondary)" }} className="text-xs text-center">
          Дараах дансанд шилжүүлснээр захиалга баталгаажна
        </p>
      </div>

      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
        {rows(ref, amount).map(({ label, value, bold }) => (
          <div key={label} className="flex justify-between items-center px-4 py-3"
            style={{ borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text-secondary)" }} className="text-xs">{label}</span>
            <span style={{ color: "var(--text-primary)", fontWeight: bold ? 700 : 500 }} className="text-sm">{value}</span>
          </div>
        ))}
      </div>

      <p style={{ color: "var(--text-secondary)", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px" }}
        className="text-xs text-center leading-relaxed px-3 py-2">
        ⚠️ Гүйлгээний утга дээр <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{ref}</span> гэж заавал бичнэ үү
      </p>

      <button onClick={onClose}
        style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)", borderRadius: "100px" }}
        className="w-full py-3 text-sm font-semibold hover:opacity-80 transition-opacity">
        Ойлголоо
      </button>
    </div>
  );
}
