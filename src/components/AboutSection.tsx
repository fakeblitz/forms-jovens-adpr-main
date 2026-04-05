import { Heart, Music, BookOpen, Users, Mountain, Star } from "lucide-react";
import { motion } from "framer-motion";
import aboutBg from "@/assets/about-bg.jpg";
import { SITE_CONFIG } from "@/config/siteConfig";

const features = [
  { icon: BookOpen, title: "Palavra", desc: "Pregações poderosas que vão transformar sua vida" },
  { icon: Music, title: "Louvor", desc: "Momentos intensos de adoração e presença de Deus" },
  { icon: Users, title: "Comunhão", desc: "Faça amizades que vão durar para sempre" },
  { icon: Mountain, title: "Aventura", desc: "Atividades ao ar livre, esportes e diversão" },
  { icon: Heart, title: "Oração", desc: "Momentos de busca e intimidade com Deus" },
  { icon: Star, title: "Experiência", desc: "3 dias que vão marcar sua história" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

const AboutSection = () => {
  return (
    <div className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            className="lg:w-1/2 rounded-2xl overflow-hidden h-64 lg:h-auto"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <img src={aboutBg} alt="Jovens no retiro" className="w-full h-full object-cover" loading="lazy" width={1920} height={1080} />
          </motion.div>

          {/* Content */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-accent/20 text-accent w-fit mb-4"
            >
              Sobre o Evento
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="section-title text-2xl sm:text-3xl md:text-4xl mb-4"
            >
              Uma experiência{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-accent)" }}>
                inesquecível
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="section-subtitle text-sm sm:text-base mb-6 max-w-lg"
            >
              {SITE_CONFIG.aboutText}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xs text-accent font-semibold mb-6"
            >
              ⚠️ Idade mínima para participar: {SITE_CONFIG.minAge} anos
            </motion.p>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {features.map((f) => (
                <motion.div
                  key={f.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="glass-card p-3 sm:p-4 flex flex-col items-start gap-2 cursor-default"
                >
                  <f.icon className="w-5 h-5 text-accent" />
                  <h3 className="font-display font-semibold text-xs sm:text-sm text-foreground">{f.title}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
