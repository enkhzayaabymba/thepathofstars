import ProductsClient from "@/components/admin/ProductsClient";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) return [];
  return data as Product[];
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="mb-10">
        <h1 style={{ color: "var(--text-primary)" }} className="text-3xl font-bold mb-1">
          Products
        </h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">
          {products.length} products in store
        </p>
      </div>

      <ProductsClient initialProducts={products} />
    </div>
  );
}
