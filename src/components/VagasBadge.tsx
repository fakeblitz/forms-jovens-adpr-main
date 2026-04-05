import { motion } from "framer-motion";
import { Users, AlertTriangle } from "lucide-react";

interface VagasBadgeProps {
  vagasRestantes: number | null;
  esgotado: boolean;
}

const VagasBadge = ({ vagasRestantes, esgotado }: VagasBadgeProps) => {
  if (vagasRestantes === null) return null;

  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
        esgotado
          ? "bg-destructive/20 text-destructive"
          : vagasRestantes <= 10
          ? "bg-destructive/10 text-destructive"
          : "bg-accent/15 text-accent"
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15 }}
    >
      {esgotado ? (
        <>
          <AlertTriangle className="w-4 h-4" />
          Vagas Esgotadas
        </>
      ) : (
        <>
          <Users className="w-4 h-4" />
          {vagasRestantes} vagas restantes
          {vagasRestantes <= 10 && (
            <motion.span
              className="w-2 h-2 rounded-full bg-destructive"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default VagasBadge;
