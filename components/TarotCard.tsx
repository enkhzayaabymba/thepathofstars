"use client";

type Props = {
  name: string;
  description: string;
  imageUrl?: string;
  price?: number;
  onClick?: () => void;
  onAddToCart?: (quantity: number) => void;
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
      className="flex flex-col gap-3 cursor-pointer group
        transition-all duration-500
        hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl"
      onClick={onClick}
    >
      {/* Image */}
      {imageUrl ? (
        <div
          style={{ backgroundColor: "var(--bg-main)", borderRadius: "8px" }}
          className="h-48 flex items-center justify-center overflow-hidden
            transition-all duration-500 group-hover:scale-[1.03]"
        >
          <img src={imageUrl} alt={name} className="h-full w-full object-cover rounded-lg" />
        </div>
      ) : (
        <div
          style={{ backgroundColor: "var(--bg-main)", borderRadius: "8px", border: "1px solid var(--border)" }}
          className="h-48 flex items-center justify-center transition-all duration-300"
        >
          <span className="text-4xl transition-all duration-300 group-hover:scale-110">✦</span>
        </div>
      )}

      {/* Title */}
      <h3
        style={{ color: "var(--text-primary)" }}
        className="font-semibold text-base transition-colors duration-300"
      >
        {name}
      </h3>

      {/* Description */}
      <p
        style={{ color: "var(--text-secondary)" }}
        className="text-sm leading-relaxed line-clamp-2 transition-opacity duration-300 group-hover:opacity-90"
      >
        {description}
      </p>

      {/* Price + button */}
      {price !== undefined && (
        <div className="flex items-center justify-between mt-2">
          <span
            style={{ color: "var(--text-primary)" }}
            className="font-semibold transition-all duration-300 group-hover:scale-110 origin-left"
          >
            ₮{price.toLocaleString()}
          </span>
          <button
            style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
            className="text-xs px-4 py-2 rounded-full
              transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
