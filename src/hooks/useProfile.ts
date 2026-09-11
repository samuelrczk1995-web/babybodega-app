import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Profile } from "../types";
import { useAuth } from "./useAuth";

export function useProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (!error) setProfile(data as Profile);
        setLoading(false);
      });
  }, [user, authLoading]);

  return { profile, loading: authLoading || loading, user };
}
