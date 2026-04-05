import { MessageCircle } from "lucide-react";
import { SITE_CONFIG, getWhatsAppLink } from "@/config/siteConfig";

interface WhatsAppButtonsProps {
  compact?: boolean;
}

const WhatsAppButtons = ({ compact = false }: WhatsAppButtonsProps) => {
  return (
    <div className="flex flex-col gap-3 w-full items-center">
      {SITE_CONFIG.sisters.map((sister) => (
        <a
          key={sister.phone}
          href={getWhatsAppLink(sister.phone)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{sister.name}</span>
        </a>
      ))}
    </div>
  );
};

export default WhatsAppButtons;
