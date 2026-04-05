import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE_CONFIG } from "@/config/siteConfig";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="flex items-center justify-between glass-card px-4 py-2">
        <span className="font-display font-bold text-sm text-foreground">
          {SITE_CONFIG.churchName}
        </span>
        <button onClick={() => setOpen(!open)} className="text-foreground p-1">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="glass-card mt-2 flex flex-col gap-2 p-4 animate-fade-in-up">
          {[
            { label: "Início", id: "hero" },
            { label: "Sobre", id: "about" },
            { label: "Líderes", id: "leaders" },
            { label: "Inscrição", id: "inscricao" },
            { label: "Pagamento", id: "payment" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default MobileNav;
