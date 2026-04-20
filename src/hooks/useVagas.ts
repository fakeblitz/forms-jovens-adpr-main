import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE_CONFIG } from "@/config/siteConfig";

export const useVagas = () => {
  const [totalInscritos, setTotalInscritos] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCount = async () => {
    // ✅ RPC com type assertion (corrige o erro de TypeScript)
    const { data: count, error } = await supabase.rpc(
      "get_inscricoes_count"
    ) as any;

    if (error) {
      console.warn("⚠️ Erro ao buscar contagem de vagas:", error.message);
    } else if (count !== null) {
      setTotalInscritos(count);
    }

    if (loading) setLoading(false);
  };

  useEffect(() => {
    fetchCount();

    // Realtime
    const channel = supabase
      .channel("vagas-counter")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "inscricoes" },
        () => {
          console.log("🔄 Nova inscrição detectada via realtime");
          fetchCount();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Realtime vagas conectado");
        } else if (status === "CHANNEL_ERROR") {
          console.warn("⚠️ Realtime falhou");
        }
      });

    // Polling de segurança
    const interval = setInterval(fetchCount, 8000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [loading]);

  const vagasRestantes = totalInscritos !== null
    ? Math.max(0, SITE_CONFIG.maxVagas - totalInscritos)
    : SITE_CONFIG.maxVagas;

  const esgotado = vagasRestantes <= 0;

  return {
    totalInscritos,
    vagasRestantes,
    esgotado,
    loading,
    maxVagas: SITE_CONFIG.maxVagas,
  };
};