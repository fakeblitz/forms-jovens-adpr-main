import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, ChevronLeft, ChevronRight, Edit3, MapPin, Shield } from "lucide-react";
import { SITE_CONFIG, calculatePrice } from "@/config/siteConfig";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  nomeCompleto: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100),
  idade: z.coerce.number().int().min(SITE_CONFIG.minAge).max(99),
  email: z.string().email("E-mail inválido").max(255),
  telefone: z.string().min(14, "Telefone inválido").max(15),
  saudeObs: z.string().max(1000).optional(),
  contatoEmergencia: z.string().min(3).max(100),
  telefoneEmergencia: z.string().min(14).max(15),
  parentesco: z.string().min(2).max(50),
  isMembro: z.enum(["sim", "nao"]),
  igrejaVisitante: z.string().max(200).optional(),
  endereco: z.string().min(5).max(300),
  bairro: z.string().min(2).max(100),
  cep: z.string().min(9).max(10),
});

type FormData = z.infer<typeof schema>;

interface RegistrationFormProps {
  onSuccess: (data: FormData & { valor: number }) => void;
}

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const STEPS = ["Dados Pessoais", "Contato", "Membresia", "Endereço"];

const stepFields: Record<number, (keyof FormData)[]> = {
  0: ["nomeCompleto", "idade", "email", "telefone"],
  1: ["contatoEmergencia", "telefoneEmergencia", "parentesco"],
  2: ["isMembro"],
  3: ["endereco", "bairro", "cep"],
};

const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nomeCompleto: "",
      idade: undefined,
      email: "",
      telefone: "",
      saudeObs: "",
      contatoEmergencia: "",
      telefoneEmergencia: "",
      parentesco: "",
      isMembro: undefined,
      igrejaVisitante: "",
      endereco: "",
      bairro: "",
      cep: "",
    },
  });

  const age = watch("idade");
  const price = age ? calculatePrice(Number(age)) : null;
  const isMembro = watch("isMembro");
  const allValues = watch();

  const nextStep = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (valid) {
      if (step < STEPS.length - 1) {
        setStep((prev) => prev + 1);
      } else {
        setShowConfirmation(true);
      }
    }
  };

  const prevStep = () => {
    if (showConfirmation) setShowConfirmation(false);
    else if (step > 0) setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: FormData) => {
    if (!price) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("inscricoes").insert({
        nome_completo: data.nomeCompleto,
        idade: Number(data.idade),
        email: data.email,
        telefone: data.telefone,
        saude_obs: data.saudeObs || null,
        contato_emergencia: data.contatoEmergencia,
        telefone_emergencia: data.telefoneEmergencia,
        parentesco: data.parentesco,
        is_membro: data.isMembro === "sim",
        igreja_visitante: data.isMembro === "nao" ? (data.igrejaVisitante || null) : null,
        endereco: data.endereco,
        bairro: data.bairro,
        cep: data.cep,
        valor: price,
      });

      if (error) throw error;

      supabase.functions.invoke("notify-new-inscription", {
        body: {
          nome: data.nomeCompleto,
          idade: Number(data.idade),
          email: data.email,
          telefone: data.telefone,
          valor: price,
          isMembro: data.isMembro === "sim",
        },
      }).catch(console.error);

      setSubmitted(true);
      onSuccess({ ...data, valor: price });
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar inscrição. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <CheckCircle2 className="w-16 h-16 text-accent animate-scale-in" />
        <h3 className="font-display text-2xl font-bold text-foreground">Inscrição recebida!</h3>
        <p className="text-muted-foreground max-w-sm">
          Agora finalize o pagamento via PIX para garantir sua vaga.
        </p>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <h3 className="font-display text-xl font-bold text-foreground text-center">Confirme seus dados</h3>
        <div className="glass-card space-y-3 text-sm p-5">
          <p><span className="text-muted-foreground">Nome:</span> <span className="text-foreground">{allValues.nomeCompleto}</span></p>
          <p><span className="text-muted-foreground">Idade:</span> <span className="text-foreground">{allValues.idade} anos</span></p>
          <p><span className="text-muted-foreground">E-mail:</span> <span className="text-foreground">{allValues.email}</span></p>
          <p><span className="text-muted-foreground">Telefone:</span> <span className="text-foreground">{allValues.telefone}</span></p>
          {allValues.saudeObs && <p><span className="text-muted-foreground">Saúde:</span> <span className="text-foreground">{allValues.saudeObs}</span></p>}
          <hr className="border-border" />
          <p><span className="text-muted-foreground">Contato:</span> <span className="text-foreground">{allValues.contatoEmergencia}</span></p>
          <p><span className="text-muted-foreground">Telefone:</span> <span className="text-foreground">{allValues.telefoneEmergencia}</span></p>
          <p><span className="text-muted-foreground">Parentesco:</span> <span className="text-foreground">{allValues.parentesco}</span></p>
          <hr className="border-border" />
          <p><span className="text-muted-foreground">Membro:</span> <span className="text-foreground">{allValues.isMembro === "sim" ? "Sim" : "Não"}</span></p>
          {allValues.isMembro === "nao" && allValues.igrejaVisitante && (
            <p><span className="text-muted-foreground">Igreja:</span> <span className="text-foreground">{allValues.igrejaVisitante}</span></p>
          )}
          <hr className="border-border" />
          <p><span className="text-muted-foreground">Endereço:</span> <span className="text-foreground">{allValues.endereco}</span></p>
          <p><span className="text-muted-foreground">Bairro:</span> <span className="text-foreground">{allValues.bairro}</span></p>
          <p><span className="text-muted-foreground">CEP:</span> <span className="text-foreground">{allValues.cep}</span></p>
        </div>

        {price !== null && (
          <div className="glass-card flex items-center justify-between p-5">
            <span className="text-sm text-muted-foreground">Valor total:</span>
            <span className="text-2xl font-display font-bold text-accent">
              R$ {price.toFixed(2).replace(".", ",")}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={prevStep} className="btn-outline-light flex-1 py-3">Editar</button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "✅ Confirmar Inscrição"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 w-full max-w-md">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div className={`h-1.5 w-full rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
            <span className={`text-[10px] ${i === step ? "text-primary font-semibold" : "text-muted-foreground"}`}>{s}</span>
          </div>
        ))}
      </div>

      {/* Steps com key para evitar bugs de re-render no mobile */}
      <div key={step}>
        {/* Step 0 - Dados Pessoais */}
        {step === 0 && (
          <div className="flex flex-col gap-3 animate-fade-in-up">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome completo *</label>
              <input {...register("nomeCompleto")} className="form-input" placeholder="Seu nome completo" />
              {errors.nomeCompleto && <p className="text-xs text-destructive mt-1">{errors.nomeCompleto.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Idade *</label>
              <input {...register("idade")} type="number" className="form-input" placeholder={`Mínimo ${SITE_CONFIG.minAge} anos`} />
              {errors.idade && <p className="text-xs text-destructive mt-1">{errors.idade.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">E-mail *</label>
              <input {...register("email")} type="email" className="form-input" placeholder="seu@email.com" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Telefone *</label>
              <input
                {...register("telefone")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="form-input"
                placeholder="(11) 99999-9999"
                onChange={(e) => setValue("telefone", formatPhone(e.target.value), { shouldValidate: true })}
              />
              {errors.telefone && <p className="text-xs text-destructive mt-1">{errors.telefone.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Alguma doença, alergia ou intolerância?</label>
              <textarea {...register("saudeObs")} className="form-input min-h-[70px] resize-none" placeholder="Descreva aqui se houver..." />
            </div>
          </div>
        )}

        {/* Step 1 - Contato de Emergência */}
        {step === 1 && (
          <div className="flex flex-col gap-3 animate-fade-in-up">
            <p className="text-xs text-muted-foreground mb-1">Informe um contato para emergências durante o retiro.</p>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome do responsável *</label>
              <input {...register("contatoEmergencia")} className="form-input" placeholder="Nome completo do responsável" />
              {errors.contatoEmergencia && <p className="text-xs text-destructive mt-1">{errors.contatoEmergencia.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Telefone do contato *</label>
              <input
                {...register("telefoneEmergencia")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="form-input"
                placeholder="(11) 99999-9999"
                onChange={(e) => setValue("telefoneEmergencia", formatPhone(e.target.value), { shouldValidate: true })}
              />
              {errors.telefoneEmergencia && <p className="text-xs text-destructive mt-1">{errors.telefoneEmergencia.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Parentesco *</label>
              <input {...register("parentesco")} className="form-input" placeholder="Ex: Mãe, Pai, Tio(a)..." />
              {errors.parentesco && <p className="text-xs text-destructive mt-1">{errors.parentesco.message}</p>}
            </div>
          </div>
        )}

        {/* Step 2 - Membresia */}
        {step === 2 && (
          <div className="flex flex-col gap-3 animate-fade-in-up">
            <p className="text-xs text-muted-foreground mb-1">Você é membro da {SITE_CONFIG.churchName}?</p>
            <div className="flex gap-3">
              <label className={`flex-1 glass-card text-center cursor-pointer transition-all ${isMembro === "sim" ? "ring-2 ring-primary" : ""}`}>
                <input type="radio" {...register("isMembro")} value="sim" className="sr-only" />
                <span className="text-sm font-semibold text-foreground">Sim, sou membro</span>
              </label>
              <label className={`flex-1 glass-card text-center cursor-pointer transition-all ${isMembro === "nao" ? "ring-2 ring-primary" : ""}`}>
                <input type="radio" {...register("isMembro")} value="nao" className="sr-only" />
                <span className="text-sm font-semibold text-foreground">Não, sou visitante</span>
              </label>
            </div>
            {errors.isMembro && <p className="text-xs text-destructive mt-1">{errors.isMembro.message}</p>}

            {isMembro === "nao" && (
              <div className="animate-fade-in-up">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Qual igreja você frequenta? (opcional)</label>
                <input {...register("igrejaVisitante")} className="form-input" placeholder="Nome da sua igreja" />
              </div>
            )}
          </div>
        )}

        {/* Step 3 - Endereço */}
        {step === 3 && (
          <div className="flex flex-col gap-3 animate-fade-in-up">
            <div className="flex flex-col items-center gap-2 mb-2">
              <MapPin className="w-8 h-8 text-accent" />
              <h3 className="font-display font-bold text-lg text-foreground">Endereço</h3>
              <p className="text-xs text-muted-foreground text-center">Precisamos do seu endereço para eventuais comunicações</p>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Endereço Completo *</label>
              <input {...register("endereco")} className="form-input" placeholder="Rua, número, complemento" />
              {errors.endereco && <p className="text-xs text-destructive mt-1">{errors.endereco.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Bairro *</label>
                <input {...register("bairro")} className="form-input" placeholder="Seu Bairro" />
                {errors.bairro && <p className="text-xs text-destructive mt-1">{errors.bairro.message}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">CEP *</label>
                <input
                  {...register("cep")}
                  type="tel"
                  inputMode="numeric"
                  className="form-input"
                  placeholder="00000-000"
                  onChange={(e) => setValue("cep", formatCep(e.target.value), { shouldValidate: true })}
                />
                {errors.cep && <p className="text-xs text-destructive mt-1">{errors.cep.message}</p>}
              </div>
            </div>

            <div className="glass-card flex items-start gap-3 p-4 mt-2">
              <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">Privacidade Garantida</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                  Suas informações pessoais são mantidas em total privacidade e usadas apenas para comunicações relacionadas ao retiro.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-2">
        {step > 0 && (
          <button type="button" onClick={prevStep} className="btn-outline-light flex items-center gap-1 text-sm px-4 py-3">
            <ChevronLeft className="w-4 h-4" /> Voltar
          </button>
        )}
        <button type="button" onClick={nextStep} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-3">
          {step < STEPS.length - 1 ? (
            <>Próximo <ChevronRight className="w-4 h-4" /></>
          ) : (
            "Revisar dados →"
          )}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;