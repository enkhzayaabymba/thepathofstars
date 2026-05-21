export type TarotCard = {
  id: number;
  name: string;
  image_url: string;
  description: string;
  meaning_upright: string;
  meaning_reversed: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
};

export type ReadingType = "one-card" | "three-card" | "celtic-cross";

export type Order = {
  id: number;
  order_id: string;
  user_email: string;
  product_name: string;
  price: number;
  status: string;
  created_at: string;
};
