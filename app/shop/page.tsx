import TarotCard from "@/components/TarotCard";
import { Product } from "@/lib/types";

// Placeholder data — replace with Supabase query once DB is set up
const products: Product[] = [
  { id: 1, name: "Rider-Waite Tarot Deck", price: 24.99, category: "Deck", image_url: "", description: "The classic 78-card deck. Perfect for beginners and experienced readers alike." },
  { id: 2, name: "Mystic Forest Oracle", price: 32.00, category: "Oracle", image_url: "", description: "44 enchanting oracle cards inspired by the wisdom of the ancient forest." },
  { id: 3, name: "Celestial Tarot", price: 29.50, category: "Deck", image_url: "", description: "Astrologically themed tarot with rich cosmic imagery and a detailed guidebook." },
  { id: 4, name: "Shadow Work Journal", price: 18.00, category: "Accessory", image_url: "", description: "A guided journal for deep self-reflection alongside your tarot practice." },
  { id: 5, name: "Crystal Grid Cloth", price: 14.99, category: "Accessory", image_url: "", description: "A sacred geometry cloth for laying out spreads and crystal grids." },
  { id: 6, name: "Modern Witch Tarot", price: 27.00, category: "Deck", image_url: "", description: "A feminist reimagining of the classic Rider-Waite with vibrant contemporary art." },
];

const categories = ["All", "Deck", "Oracle", "Accessory"];

export default function ShopPage() {
  return (
    <main className="max-w-300 mx-auto px-10 py-16">
      <div className="mb-10">
        <h1 style={{ color: "var(--text-primary)" }} className="text-4xl font-bold mb-3">
          Shop
        </h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-base">
          Curated decks, journals, and accessories for your practice.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              borderRadius: "100px",
            }}
            className="text-sm px-5 py-2 hover:opacity-70 transition-opacity"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <TarotCard
            key={product.id}
            name={product.name}
            description={product.description}
            imageUrl={product.image_url || undefined}
            price={product.price}
          />
        ))}
      </div>
    </main>
  );
}
