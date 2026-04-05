import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import RegistrationForm from "./RegistrationForm";
import VagasBadge from "./VagasBadge";
import { SITE_CONFIG } from "@/config/siteConfig";

interface RegistrationSectionProps {
  esgotado: boolean;
  vagasRestantes: number | null;
}

const RegistrationSection = ({ esgotado, vagasRestantes }: RegistrationSectionProps) => {
  const [, setFormData] = useState<any>(null);

  return (
    <div className="py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-accent/20 text-accent w-fit mb-4">
          Inscrição
        </span>
        <h2 className="section-title text-2xl sm:text-3xl md:text-4xl mb-2 text-center">
          Garanta sua{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-accent)" }}>
            vaga
          </span>
        </h2>
        <p className="section-subtitle text-center max-w-md mb-2 text-sm">
          Preencha seus dados abaixo. O valor é calculado automaticamente pela sua idade.
        </p>
        <p className="text-xs text-accent font-semibold mb-3">
          ⚠️ Idade mínima: {SITE_CONFIG.minAge} anos
        </p>

        <div className="mb-4">
          <VagasBadge vagasRestantes={vagasRestantes} esgotado={esgotado} />
        </div>

        {esgotado ? (
          <motion.div
            className="glass-card w-full max-w-md text-center p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Vagas Esgotadas!</h3>
            <p className="text-sm text-muted-foreground">
              Todas as {SITE_CONFIG.maxVagas} vagas foram preenchidas. Entre em contato pelo WhatsApp para entrar na lista de espera.
            </p>
          </motion.div>
        ) : (
          <RegistrationForm onSuccess={(data) => setFormData(data)} />
        )}
      </div>
    </div>
  );
};

export default RegistrationSection;
