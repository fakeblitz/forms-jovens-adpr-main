import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE_CONFIG } from "@/config/siteConfig";

export const useVagas = () => {
  const [totalInscritos, setTotalInscritos] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCount = async () => {
    const { count, error } = await supabase
      .from("inscricoes")
      .select("INSERT", { count: "exact", head: true });
    if (!error && count !== null) {
      setTotalInscritos(count);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCount();

    const channel = supabase
      .channel("vagas-counter")
      .on("postgres_changes", { event: "*", schema: "public", table: "inscricoes" }, () => {
        fetchCount();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const vagasRestantes = totalInscritos !== null ? Math.max(0, SITE_CONFIG.maxVagas - totalInscritos) : null;
  const esgotado = vagasRestantes !== null && vagasRestantes <= 0;

  return { totalInscritos, vagasRestantes, esgotado, loading, maxVagas: SITE_CONFIG.maxVagas };
};
