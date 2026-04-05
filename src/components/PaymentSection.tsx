import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Copy, Check, ExternalLink } from "lucide-react";
import { SITE_CONFIG } from "@/config/siteConfig";

const PaymentSection = () => {
  const [copied, setCopied] = useState(false);

  const copyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = SITE_CONFIG.pixKey;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/20 text-primary w-fit mb-4 mx-auto"
        >
          Pagamento
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title text-2xl sm:text-3xl md:text-4xl mb-2"
        >
          Finalize seu{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
            pagamento
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="section-subtitle text-sm sm:text-base max-w-md mx-auto mb-8"
        >
          Realize o pagamento via PIX para garantir sua vaga no retiro!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -4 }}
          className="glass-card flex flex-col items-center gap-5 max-w-md mx-auto"
        >
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <QrCode className="w-12 h-12 text-accent" />
          </motion.div>

          <h3 className="font-display font-bold text-xl text-foreground">Pagar via PIX</h3>

          {/* QR Code placeholder */}
          <div className="w-44 h-44 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
            <span className="text-xs text-muted-foreground text-center px-3">
            <img src="../src/assets/qr code.jpeg" alt="Qr Code" />
            </span>
          </div>

          {/* Chave PIX copiável */}
          <div className="w-full">
            <p className="text-xs text-muted-foreground mb-1.5">Chave PIX (CNPJ):</p>
            <motion.button
              onClick={copyPixKey}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-muted/50 border border-border hover:border-primary/50 transition-colors group"
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-mono text-sm text-foreground font-semibold">{SITE_CONFIG.pixKey}</span>
              <motion.div
                animate={copied ? { scale: [1, 1.3, 1] } : {}}
                className={`flex items-center gap-1 text-xs ${copied ? "text-accent" : "text-muted-foreground group-hover:text-primary"} transition-colors`}
              >
                {copied ? (
                  <><Check className="w-4 h-4" /> Copiado!</>
                ) : (
                  <><Copy className="w-4 h-4" /> Copiar</>
                )}
              </motion.div>
            </motion.button>
            <p className="text-[11px] text-muted-foreground mt-1.5">{SITE_CONFIG.pixName}</p>
          </div>

          <motion.a
            href={SITE_CONFIG.paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2 text-sm w-full justify-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ExternalLink className="w-4 h-4" />
            Link de pagamento
          </motion.a>

          <div className="w-full mt-2 p-4 rounded-xl bg-accent/10 border-2 border-accent/30">
            <p className="text-sm sm:text-base font-semibold text-accent text-center leading-relaxed">
              ⚠️ IMPORTANTE: Após realizar o pagamento, envie o comprovante para uma das irmãs pelo WhatsApp
            </p>
            <p className="text-xs sm:text-sm text-accent/80 text-center mt-1">
              Use o botão verde no canto inferior direito da tela para escolher para quem enviar.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSection;
