import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Flame, Users } from "lucide-react";

interface VagasPopupProps {
  vagasRestantes: number | null;
  esgotado: boolean;
  maxVagas: number;
}

const VagasPopup = ({ vagasRestantes, esgotado, maxVagas }: VagasPopupProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("vagas-popup-dismissed");
    if (!dismissed && vagasRestantes !== null) {
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [vagasRestantes]);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("vagas-popup-dismissed", "1");
  };

  if (vagasRestantes === null) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative glass-card max-w-sm w-full p-6 text-center z-10"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <button onClick={handleClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>

            {esgotado ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mx-auto w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4"
                >
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </motion.div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">Vagas Esgotadas!</h3>
                <p className="text-sm text-muted-foreground">
                  Todas as <span className="font-bold text-foreground">{maxVagas} vagas</span> para o retiro foram preenchidas. 
                  Entre em contato pelo WhatsApp para entrar na lista de espera.
                </p>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4"
                >
                  <Flame className="w-8 h-8 text-accent animate-pulse" />
                </motion.div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">Vagas Limitadas!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  O retiro possui apenas <span className="font-bold text-foreground">{maxVagas} vagas</span> e elas estão acabando rápido!
                </p>
                <div className="flex items-center justify-center gap-2 bg-accent/10 rounded-xl py-3 px-4">
                  <Users className="w-5 h-5 text-accent" />
                  <span className="text-lg font-display font-bold text-accent">{vagasRestantes}</span>
                  <span className="text-sm text-muted-foreground">vagas restantes</span>
                </div>
                {vagasRestantes <= 10 && (
                  <motion.p
                    className="text-xs text-destructive font-semibold mt-3"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    ⚠️ Últimas vagas! Garanta a sua agora!
                  </motion.p>
                )}
              </>
            )}

            <motion.button
              onClick={handleClose}
              className="btn-primary w-full mt-4 py-3 text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {esgotado ? "Entendi" : "Garantir minha vaga!"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VagasPopup;
