import { ChevronDown, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import VagasBadge from "./VagasBadge";

import { SITE_CONFIG } from "@/config/siteConfig";

interface HeroSectionProps {
  vagasRestantes: number | null;
  esgotado: boolean;
}

const HeroSection = ({ vagasRestantes, esgotado }: HeroSectionProps) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.img
          src={heroBg}
          alt="Jovens adorando no retiro"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto gap-5 py-24">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/20 text-primary-foreground border border-primary/30"
        >
          {SITE_CONFIG.eventDate}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground"
        >
          {SITE_CONFIG.churchName}
          <br />
          <motion.span
            className="bg-clip-text text-transparent inline-block"
            style={{ backgroundImage: "var(--gradient-primary)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {SITE_CONFIG.retreatTitle}
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="section-subtitle text-base sm:text-lg max-w-2xl"
        >
          {SITE_CONFIG.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-accent" />
            <span>{SITE_CONFIG.eventDate}</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <VagasBadge vagasRestantes={vagasRestantes} esgotado={esgotado} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 mt-2"
        >
          <motion.button
            onClick={() => scrollToSection("inscricao")}
            className="btn-primary text-base sm:text-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px hsla(265, 85%, 60%, 0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            🔥 Quero me inscrever
          </motion.button>
          <motion.button
            onClick={() => scrollToSection("about")}
            className="btn-outline-light"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Saiba mais
          </motion.button>
        </motion.div>

        {/* Seta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <ChevronDown className="w-6 h-6 text-accent animate-bounce" />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
