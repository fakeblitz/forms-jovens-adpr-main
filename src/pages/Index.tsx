import MobileNav from "@/components/MobileNav";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import LeadersSection from "@/components/LeadersSection";
import RegistrationSection from "@/components/RegistrationSection";
import PaymentSection from "@/components/PaymentSection";
import FooterSection from "@/components/FooterSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import VagasPopup from "@/components/VagasPopup";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useVagas } from "@/hooks/useVagas";

const RevealSection = ({ id, children, tag = "section" }: { id: string; children: React.ReactNode; tag?: string }) => {
  const { ref, isVisible } = useScrollReveal(0.1);
  const Tag = tag as any;
  return (
    <Tag
      id={id}
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    >
      {children}
    </Tag>
  );
};

const Index = () => {
  const { vagasRestantes, esgotado, maxVagas } = useVagas();

  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      <section id="hero"><HeroSection vagasRestantes={vagasRestantes} esgotado={esgotado}/></section>
      <RevealSection id="about"><AboutSection /></RevealSection>
      <RevealSection id="leaders"><LeadersSection /></RevealSection>
      <RevealSection id="inscricao"><RegistrationSection vagasRestantes={vagasRestantes} esgotado={esgotado} /></RevealSection>
      <RevealSection id="payment"><PaymentSection /></RevealSection>
      <RevealSection id="footer" tag="footer"><FooterSection /></RevealSection>
      <VagasPopup vagasRestantes={vagasRestantes} esgotado={esgotado} maxVagas={maxVagas} />
    </div>
  );
};

export default Index;
