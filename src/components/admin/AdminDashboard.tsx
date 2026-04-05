import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Search, Filter, Download, CheckCircle2, XCircle, Users, DollarSign, Clock, FileText, Eye } from "lucide-react";
import { SITE_CONFIG } from "@/config/siteConfig";
import type { Tables } from "@/integrations/supabase/types";
import InscricaoDetailDialog from "./InscricaoDetailDialog";

type Inscricao = Tables<"inscricoes">;

const AdminDashboard = ({ session }: { session: any }) => {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPago, setFilterPago] = useState<"all" | "pago" | "pendente">("all");
  const [filterMembro, setFilterMembro] = useState<"all" | "sim" | "nao">("all");
  const [selectedInscricao, setSelectedInscricao] = useState<Inscricao | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchInscricoes = async () => {
    const { data, error } = await supabase
      .from("inscricoes")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setInscricoes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInscricoes();
    const channel = supabase
      .channel("admin-inscricoes")
      .on("postgres_changes", { event: "*", schema: "public", table: "inscricoes" }, () => fetchInscricoes())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const togglePago = async (id: string, current: boolean) => {
    await supabase.from("inscricoes").update({ pago: !current }).eq("id", id);
    setInscricoes((prev) => prev.map((i) => (i.id === id ? { ...i, pago: !current } : i)));
    if (selectedInscricao?.id === id) {
      setSelectedInscricao((prev) => prev ? { ...prev, pago: !current } : null);
    }
  };

  const openDetail = (inscricao: Inscricao) => {
    setSelectedInscricao(inscricao);
    setDialogOpen(true);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  const filtered = inscricoes.filter((i) => {
    const matchSearch =
      i.nome_completo.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      i.telefone.includes(search);
    const matchPago = filterPago === "all" || (filterPago === "pago" ? i.pago : !i.pago);
    const matchMembro = filterMembro === "all" || (filterMembro === "sim" ? i.is_membro : !i.is_membro);
    return matchSearch && matchPago && matchMembro;
  });

  const totalInscritos = inscricoes.length;
  const totalPagos = inscricoes.filter((i) => i.pago).length;
  const totalPendentes = totalInscritos - totalPagos;
  const totalArrecadado = inscricoes.filter((i) => i.pago).reduce((acc, i) => acc + Number(i.valor), 0);

  const exportCSV = () => {
    const headers = ["Nome Completo", "Idade", "E-mail", "Telefone", "Membro", "Igreja Visitante", "Valor (R$)", "Status Pagamento", "Endereço", "Bairro", "CEP", "Contato Emergência", "Tel. Emergência", "Parentesco", "Obs. Saúde", "Data Inscrição"];
    const rows = filtered.map((i) => [
      i.nome_completo, i.idade, i.email, i.telefone, i.is_membro ? "Sim" : "Não",
      i.igreja_visitante || "N/A", `R$ ${Number(i.valor).toFixed(2).replace(".", ",")}`, i.pago ? "Pago" : "Pendente",
      i.endereco, i.bairro, i.cep, i.contato_emergencia, i.telefone_emergencia, i.parentesco,
      i.saude_obs || "Nenhuma", new Date(i.created_at).toLocaleDateString("pt-BR"),
    ]);
    const bom = "\uFEFF";
    const csv = bom + [headers.join(";"), ...rows.map((r) => r.map((v) => `"${v}"`).join(";"))].join("\n");
    downloadFile(csv, `inscricoes_retiro_${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8");
  };

  const exportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rows = filtered.map((i) => `
      <tr>
        <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px">${i.nome_completo}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px;text-align:center">${i.idade}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px">${i.email}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px">${i.telefone}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px;text-align:center">${i.is_membro ? "Sim" : "Não"}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px;text-align:right">R$ ${Number(i.valor).toFixed(2).replace(".", ",")}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px;text-align:center;color:${i.pago ? "green" : "orange"};font-weight:bold">${i.pago ? "Pago" : "Pendente"}</td>
        <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px">${new Date(i.created_at).toLocaleDateString("pt-BR")}</td>
      </tr>
    `).join("");

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Inscrições - ${SITE_CONFIG.retreatTitle}</title>
      <style>
        body{font-family:Arial,sans-serif;margin:30px;color:#333}
        h1{font-size:18px;margin-bottom:4px}
        .subtitle{font-size:12px;color:#666;margin-bottom:16px}
        .stats{display:flex;gap:20px;margin-bottom:16px;font-size:12px}
        .stats span{background:#f5f5f5;padding:6px 12px;border-radius:6px}
        table{border-collapse:collapse;width:100%}
        th{padding:8px;border:1px solid #bbb;background:#f0f0f0;font-size:11px;text-align:left;font-weight:bold}
        @media print{body{margin:15px}.stats span{border:1px solid #ddd}}
      </style></head><body>
      <h1>${SITE_CONFIG.retreatTitle} — Lista de Inscrições</h1>
      <p class="subtitle">Gerado em ${new Date().toLocaleString("pt-BR")} | Total: ${filtered.length} inscrições</p>
      <div class="stats">
        <span>✅ Pagos: ${totalPagos}</span>
        <span>⏳ Pendentes: ${totalPendentes}</span>
        <span>💰 Arrecadado: R$ ${totalArrecadado.toFixed(2).replace(".", ",")}</span>
      </div>
      <table><thead><tr>
        <th>Nome</th><th>Idade</th><th>E-mail</th><th>Telefone</th><th>Membro</th><th>Valor</th><th>Status</th><th>Data</th>
      </tr></thead><tbody>${rows}</tbody></table>
      <script>setTimeout(()=>window.print(),300)</script>
    </body></html>`);
    printWindow.document.close();
  };

  const downloadFile = (content: string, name: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass-card rounded-none border-x-0 border-t-0 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-lg font-bold text-foreground">Painel Admin</h1>
          <p className="text-xs text-muted-foreground">{SITE_CONFIG.retreatTitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">{session.user.email}</span>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Users} label="Total Inscritos" value={totalInscritos} color="text-primary" />
          <StatCard icon={CheckCircle2} label="Pagos" value={totalPagos} color="text-green-400" />
          <StatCard icon={Clock} label="Pendentes" value={totalPendentes} color="text-yellow-400" />
          <StatCard icon={DollarSign} label="Arrecadado" value={`R$ ${totalArrecadado.toFixed(2).replace(".", ",")}`} color="text-accent" />
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="form-input pl-10 text-sm" placeholder="Buscar por nome, e-mail ou telefone..." />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <select value={filterPago} onChange={(e) => setFilterPago(e.target.value as any)} className="form-input text-xs py-2 px-3 w-auto">
              <option value="all">Todos</option><option value="pago">Pagos</option><option value="pendente">Pendentes</option>
            </select>
            <select value={filterMembro} onChange={(e) => setFilterMembro(e.target.value as any)} className="form-input text-xs py-2 px-3 w-auto">
              <option value="all">Todos</option><option value="sim">Membros</option><option value="nao">Visitantes</option>
            </select>
            <button onClick={exportCSV} className="btn-outline-light flex items-center gap-1 text-xs px-3 py-2">
              <Download className="w-3 h-3" /> CSV
            </button>
            <button onClick={exportPDF} className="btn-outline-light flex items-center gap-1 text-xs px-3 py-2">
              <FileText className="w-3 h-3" /> PDF
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground text-sm">Nenhuma inscrição encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground">Nome</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground">Idade</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">E-mail</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Telefone</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground">Valor</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground">Membro</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Data</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => openDetail(i)}>
                    <td className="py-3 px-3 font-medium text-foreground">{i.nome_completo}</td>
                    <td className="py-3 px-3 text-muted-foreground">{i.idade}</td>
                    <td className="py-3 px-3 text-muted-foreground hidden md:table-cell">{i.email}</td>
                    <td className="py-3 px-3 text-muted-foreground hidden sm:table-cell">{i.telefone}</td>
                    <td className="py-3 px-3 text-accent font-semibold">R$ {Number(i.valor).toFixed(2).replace(".", ",")}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${i.is_membro ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {i.is_membro ? "Sim" : "Não"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePago(i.id, i.pago); }}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all hover:scale-105 ${
                          i.pago ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                        }`}
                      >
                        {i.pago ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {i.pago ? "Pago" : "Pendente"}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground text-xs hidden lg:table-cell">
                      {new Date(i.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-3">
                      <button onClick={(e) => { e.stopPropagation(); openDetail(i); }} className="text-primary hover:text-primary/80 transition-colors p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-6">
          Exibindo {filtered.length} de {totalInscritos} inscrições
        </p>
      </div>

      <InscricaoDetailDialog
        inscricao={selectedInscricao}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onTogglePago={togglePago}
      />
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
  <div className="glass-card p-4 flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <Icon className={`w-5 h-5 ${color}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <span className="font-display text-2xl font-bold text-foreground">{value}</span>
  </div>
);

export default AdminDashboard;
