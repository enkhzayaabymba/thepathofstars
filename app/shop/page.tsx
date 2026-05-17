import ShopClient from "@/components/ShopClient";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }
  return data as Product[];
}

export default async function ShopPage() {
  const products = await getProducts();

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

      <ShopClient products={products} />
    </main>
  );
}
