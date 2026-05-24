import { supabase } from "./supabase";
import { Order } from "./types";
import { CartItem } from "./CartContext";

type PlaceResult = { orderId: string | null; error: string | null };

// Returns orderId on success, error message if failed
export async function placeOrder(
  userEmail: string,
  items: CartItem[],
  address: string,
  phone: string
): Promise<PlaceResult> {
  const order_id = crypto.randomUUID();

  const rows = items.map((item) => ({
    order_id,
    user_email: userEmail,
    product_name: item.product.name,
    image_url: item.product.image_url ?? null,
    price: item.product.price,
    quantity: item.quantity,
    status: "payment_pending",
    address,
    phone,
  }));

  const { error } = await supabase.from("orders").insert(rows);

  if (error) return { orderId: null, error: error.message };
  return { orderId: order_id, error: null };
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
