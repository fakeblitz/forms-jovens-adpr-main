import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, User, Phone, MapPin, Heart, Church } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Inscricao = Tables<"inscricoes">;

interface Props {
  inscricao: Inscricao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTogglePago: (id: string, current: boolean) => void;
}

const Field = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
  <div className="space-y-0.5">
    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
    <p className="text-sm text-foreground">{value || "—"}</p>
  </div>
);

const InscricaoDetailDialog = ({ inscricao, open, onOpenChange, onTogglePago }: Props) => {
  if (!inscricao) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{inscricao.nome_completo}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Inscrição realizada em {new Date(inscricao.created_at).toLocaleString("pt-BR")}
          </DialogDescription>
        </DialogHeader>

        {/* Status */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onTogglePago(inscricao.id, inscricao.pago)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105 ${
              inscricao.pago
                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
            }`}
          >
            {inscricao.pago ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {inscricao.pago ? "Pago" : "Pendente"}
          </button>
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${inscricao.is_membro ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
            {inscricao.is_membro ? "Membro" : "Visitante"}
          </span>
          <span className="text-accent font-bold text-sm ml-auto">
            R$ {Number(inscricao.valor).toFixed(2).replace(".", ",")}
          </span>
        </div>

        {/* Sections */}
        <div className="space-y-5 mt-4">
          <Section icon={User} title="Dados Pessoais">
            <Field label="Nome Completo" value={inscricao.nome_completo} />
            <Field label="Idade" value={`${inscricao.idade} anos`} />
            <Field label="E-mail" value={inscricao.email} />
            <Field label="Telefone" value={inscricao.telefone} />
          </Section>

          <Section icon={Phone} title="Contato de Emergência">
            <Field label="Nome do Contato" value={inscricao.contato_emergencia} />
            <Field label="Telefone" value={inscricao.telefone_emergencia} />
            <Field label="Parentesco" value={inscricao.parentesco} />
          </Section>

          <Section icon={Church} title="Vínculo Eclesiástico">
            <Field label="É Membro?" value={inscricao.is_membro ? "Sim" : "Não"} />
            {!inscricao.is_membro && <Field label="Igreja Visitante" value={inscricao.igreja_visitante} />}
          </Section>

          <Section icon={MapPin} title="Endereço">
            <Field label="Endereço" value={inscricao.endereco} />
            <Field label="Bairro" value={inscricao.bairro} />
            <Field label="CEP" value={inscricao.cep} />
          </Section>

          <Section icon={Heart} title="Saúde">
            <Field label="Observações de Saúde" value={inscricao.saude_obs || "Nenhuma observação"} />
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 border-b border-border pb-2">
      <Icon className="w-4 h-4 text-primary" />
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
    <div className="grid grid-cols-2 gap-3">{children}</div>
  </div>
);

export default InscricaoDetailDialog;
