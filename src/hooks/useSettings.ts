import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const refetch = () => {
    setLoading(true);
    supabase
      .from("settings")
      .select("key, value")
      .eq("key", "whatsapp_number")
      .maybeSingle()
      .then(({ data }) => {
        setWhatsappNumber(data?.value || "");
        setLoading(false);
      });
  };

  useEffect(() => {
    refetch();
  }, []);

  return { whatsappNumber, loading, refetch };
}
