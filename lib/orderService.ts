import { supabase } from "./supabase";
import { Order } from "./types";
import { CartItem } from "./CartContext";

// Returns null if success, error message string if failed
export async function placeOrder(userEmail: string, items: CartItem[]): Promise<string | null> {
  const order_id = crypto.randomUUID();

  const rows = items.map((item) => ({
    order_id,
    user_email: userEmail,
    product_name: item.product.name,
    price: item.product.price * item.quantity,
    status: "pending",
  }));

  let { error } = await supabase.from("orders").insert(rows);

  // If order_id column doesn't exist yet, retry without it
  if (error?.message.includes("order_id")) {
    const rowsWithoutOrderId = items.map((item) => ({
      user_email: userEmail,
      product_name: item.product.name,
      price: item.product.price * item.quantity,
      status: "pending",
    }));
    const retry = await supabase.from("orders").insert(rowsWithoutOrderId);
    error = retry.error;
  }

  if (error) return error.message;
  return null;
}

// Returns empty array if failed
export async function getMyOrders(userEmail: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_email", userEmail)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as Order[];
}
