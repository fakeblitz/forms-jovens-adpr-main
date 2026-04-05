import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/config/siteConfig";

const LeadersSection = () => {
  return (
    <div className="py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/20 text-primary w-fit mb-4 mx-auto"
        >
          Liderança
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title text-2xl sm:text-3xl md:text-4xl mb-2"
        >
          Nossos{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
            Líderes
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="section-subtitle text-sm sm:text-base max-w-lg mx-auto mb-10"
        >
          Conheça os pastores e líderes que estarão à frente deste retiro abençoado.
        </motion.p>

        {/* Casais */}
        <div className="flex flex-col gap-6 mb-6">
          {SITE_CONFIG.leaderCouples.map((couple, ci) => (
            <motion.div
              key={couple.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.15, duration: 0.6 }}
              className="glass-card p-6"
            >
              <h3 className="font-display font-bold text-accent text-sm mb-4 uppercase tracking-wider">{couple.label}</h3>
              <div className="flex flex-row items-center justify-center gap-6 sm:gap-10">
                {couple.members.map((member, mi) => (
                  <motion.div
                    key={member.name}
                    className="flex flex-col items-center text-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: ci * 0.15 + mi * 0.1 + 0.2, duration: 0.5 }}
                  >
                    <motion.div
                      className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-2 ring-primary/40"
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" loading="lazy" width={400} height={400} />
                    </motion.div>
                    <h4 className="font-display font-semibold text-foreground text-xs sm:text-sm">{member.name}</h4>
                    <span className="text-[10px] sm:text-xs text-accent font-medium">{member.role}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Irmãs ajudantes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-6"
        >
          <h3 className="font-display font-bold text-accent text-sm mb-4 uppercase tracking-wider">Tesoureira e Secretaria</h3>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {SITE_CONFIG.leaderSisters.map((sister, si) => (
              <motion.div
                key={sister.name}
                className="flex flex-col items-center text-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: si * 0.12, duration: 0.5 }}
              >
                <motion.div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-accent/40"
                  whileHover={{ scale: 1.1, rotate: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={sister.photo} alt={sister.name} className="w-full h-full object-cover" loading="lazy" width={400} height={400} />
                </motion.div>
                <h4 className="font-display font-semibold text-foreground text-xs sm:text-sm">{sister.name}</h4>
                <span className="text-[10px] sm:text-xs text-accent font-medium">{sister.role}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeadersSection;
