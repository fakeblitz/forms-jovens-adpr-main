import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { SITE_CONFIG } from "@/config/siteConfig";

const FooterSection = () => {
  return (
    <div className="py-16 md:py-24 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title text-2xl sm:text-3xl md:text-4xl mb-4"
        >
          Nos vemos no{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-accent)" }}>
            retiro!
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-subtitle text-sm sm:text-base max-w-md mx-auto mb-8"
        >
          Não perca essa oportunidade. Deus tem algo especial preparado para você!
        </motion.p>

        <motion.button
          onClick={() => document.getElementById("inscricao")?.scrollIntoView({ behavior: "smooth" })}
          className="btn-accent text-base sm:text-lg mb-10"
          whileHover={{ scale: 1.07, boxShadow: "0 0 40px hsla(35, 95%, 55%, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          🙏 Finalizar Inscrição
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-sm text-muted-foreground">
            Dúvidas? Use o botão verde no canto inferior direito para falar conosco! 💬
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-8"
        >
          <span>Feito com</span>
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Heart className="w-3 h-3 text-destructive" />
          </motion.div>
          <span>por {SITE_CONFIG.churchName}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default FooterSection;
