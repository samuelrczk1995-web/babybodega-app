import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Category } from "../types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = () => {
    setLoading(true);
    supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true })
      .then(({ data }) => {
        setCategories((data as Category[]) || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    refetch();
  }, []);

  return { categories, loading, refetch };
}
