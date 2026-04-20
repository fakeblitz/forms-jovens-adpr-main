import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE_CONFIG } from "@/config/siteConfig";

export const useVagas = () => {
  const [totalInscritos, setTotalInscritos] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCount = async () => {
    const { count, error } = await supabase
      .from("inscricoes")
      .select("*", { count: "exact", head: true });

    if (!error && count !== null) {
      setTotalInscritos(count);
    }
    // Só desativa o loading na primeira vez
    if (loading) setLoading(false);
  };

  useEffect(() => {
    // Busca inicial
    fetchCount();

    // ✅ Realtime (mantido)
    const channel = supabase
      .channel("vagas-counter")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inscricoes" },
        () => {
          fetchCount();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Realtime vagas conectado");
        }
      });

    // ✅ POLLING (a cada 10 segundos) - solução confiável para público
    const interval = setInterval(() => {
      fetchCount();
    }, 10000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [loading]);

  const vagasRestantes = totalInscritos !== null 
    ? Math.max(0, SITE_CONFIG.maxVagas - totalInscritos) 
    : null;

  const esgotado = vagasRestantes !== null && vagasRestantes <= 0;

  return { 
    totalInscritos, 
    vagasRestantes, 
    esgotado, 
    loading, 
    maxVagas: SITE_CONFIG.maxVagas 
  };
};