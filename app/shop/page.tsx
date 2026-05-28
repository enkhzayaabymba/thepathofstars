import ShopClient from "@/components/ShopClient";
import { supabase } from "@/lib/supabase";
import { Product, Category } from "@/lib/types";

async function getProducts(): Promise<Product[]> {
  const { data } = await supabase.from("products").select("*");
  return (data as Product[]) ?? [];
}

async function getCategories(): Promise<Category[]> {
  const { data } = await supabase.from("categories").select("*").order("name");
  return (data as Category[]) ?? [];
}

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <main className="max-w-300 mx-auto px-4 md:px-10 py-12 md:py-16">
      <div className="mb-10">
        <h1 style={{ color: "var(--text-primary)" }} className="text-3xl md:text-4xl font-bold mb-3">
          Shop
        </h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-base">
          Curated decks, journals, and accessories for your practice.
        </p>
      </div>

      <ShopClient products={products} categories={categories} />
    </main>
  );
}
