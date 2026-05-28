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
      <ShopClient products={products} categories={categories} />
    </main>
  );
}
