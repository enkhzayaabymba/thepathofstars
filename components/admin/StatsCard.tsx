type Props = {
  label: string;
  value: string | number;
  icon: string;
  sub?: string;
};

export default function StatsCard({ label, value, icon, sub }: Props) {
  return (
    <div
      style={{
        backgroundColor: "var(--white)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "24px 28px",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <p style={{ color: "var(--text-secondary)" }} className="text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
        <span
          style={{ backgroundColor: "var(--surface)", borderRadius: "8px" }}
          className="text-base p-2 leading-none"
        >
          {icon}
        </span>
      </div>

      <p style={{ color: "var(--text-primary)", lineHeight: 1 }} className="text-3xl font-bold mb-1">
        {value}
      </p>

      {sub && (
        <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-2">
          {sub}
        </p>
      )}
    </div>
  );
}
