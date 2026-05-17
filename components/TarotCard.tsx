"use client";

type Props = {
  name: string;
  description: string;
  imageUrl?: string;
  price?: number;
  onClick?: () => void;
};

export default function TarotCard({ name, description, imageUrl, price, onClick }: Props) {
  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "24px 28px",
      }}
      className="flex flex-col gap-3 hover:opacity-90 transition-opacity cursor-pointer"
      onClick={onClick}
    >
      {imageUrl ? (
        <div
          style={{ backgroundColor: "var(--bg-main)", borderRadius: "8px" }}
          className="h-48 flex items-center justify-center overflow-hidden"
        >
          <img src={imageUrl} alt={name} className="h-full w-full object-cover rounded-lg" />
        </div>
      ) : (
        <div
          style={{ backgroundColor: "var(--bg-main)", borderRadius: "8px", border: "1px solid var(--border)" }}
          className="h-48 flex items-center justify-center"
        >
          <span className="text-4xl">✦</span>
        </div>
      )}

      <h3 style={{ color: "var(--text-primary)" }} className="font-semibold text-base">
        {name}
      </h3>

      <p style={{ color: "var(--text-secondary)" }} className="text-sm leading-relaxed line-clamp-2">
        {description}
      </p>

      {price !== undefined && (
        <div className="flex items-center justify-between mt-2">
          <span style={{ color: "var(--text-primary)" }} className="font-semibold">
            ${price.toFixed(2)}
          </span>
          <button
            style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
            className="text-xs px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
            onClick={(e) => { e.stopPropagation(); }}
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
