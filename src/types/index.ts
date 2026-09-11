export type Role = "admin" | "staff" | "client";

export interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand_id: string;
  category_id: string;
  normal_price: number;
  discount_price: number | null;
  is_on_sale: boolean;
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  brand?: Brand;
  category?: Category;
  product_images?: ProductImage[];
}

export interface Setting {
  key: string;
  value: string;
  updated_at: string;
}
