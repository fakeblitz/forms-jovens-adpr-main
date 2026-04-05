-- Create inscricoes table
CREATE TABLE public.inscricoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  idade INTEGER NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  saude_obs TEXT,
  contato_emergencia TEXT NOT NULL,
  telefone_emergencia TEXT NOT NULL,
  parentesco TEXT NOT NULL,
  is_membro BOOLEAN NOT NULL DEFAULT false,
  igreja_visitante TEXT,
  endereco TEXT NOT NULL,
  bairro TEXT NOT NULL,
  cep TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  pago BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inscricoes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public registration form)
CREATE POLICY "Anyone can insert inscricoes"
  ON public.inscricoes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can read (for admin)
CREATE POLICY "Authenticated users can read inscricoes"
  ON public.inscricoes FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update (mark as paid)
CREATE POLICY "Authenticated users can update inscricoes"
  ON public.inscricoes FOR UPDATE
  TO authenticated
  USING (true);