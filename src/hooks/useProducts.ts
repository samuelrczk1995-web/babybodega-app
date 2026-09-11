import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Product } from "../types";

export interface ProductFilters {
  categorySlug?: string;
  brandSlug?: string;
  onSale?: boolean;
  featured?: boolean;
  search?: string;
  onlyAvailable?: boolean;
}

const SELECT = `
  *,
  brand:brands(*),
  category:categories(*),
  product_images(*)
`;

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function run() {
      let query = supabase.from("products").select(SELECT).order("created_at", { ascending: false });

      if (filters.onSale) query = query.eq("is_on_sale", true);
      if (filters.featured) query = query.eq("is_featured", true);
      if (filters.onlyAvailable) query = query.eq("is_available", true);
      if (filters.search) query = query.ilike("name", `%${filters.search}%`);

      if (filters.categorySlug) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", filters.categorySlug)
          .maybeSingle();
        if (cat) query = query.eq("category_id", cat.id);
      }

      if (filters.brandSlug) {
        const { data: brand } = await supabase
          .from("brands")
          .select("id")
          .eq("slug", filters.brandSlug)
          .maybeSingle();
        if (brand) query = query.eq("brand_id", brand.id);
      }

      const { data, error: err } = await query;
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setProducts([]);
      } else {
        const sorted = (data as Product[]).map((p) => ({
          ...p,
          product_images: (p.product_images || []).sort((a, b) => a.sort_order - b.sort_order),
        }));
        setProducts(sorted);
      }
      setLoading(false);
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { products, loading, error };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from("products")
      .select(SELECT)
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          const p = data as Product;
          p.product_images = (p.product_images || []).sort((a, b) => a.sort_order - b.sort_order);
          setProduct(p);
        }
        setLoading(false);
      });
  }, [id]);

  return { product, loading };
}
