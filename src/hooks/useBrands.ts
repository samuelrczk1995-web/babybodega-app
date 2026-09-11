import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Brand } from "../types";

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = () => {
    setLoading(true);
    supabase
      .from("brands")
      .select("*")
      .order("name", { ascending: true })
      .then(({ data }) => {
        setBrands((data as Brand[]) || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    refetch();
  }, []);

  return { brands, loading, refetch };
}
