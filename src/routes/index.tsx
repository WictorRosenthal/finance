import { api } from "@/lib/api";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  TrendingUp,
  Plus,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Target,
  CheckCircle2,
  AlertTriangle,
  Download,
  PencilLine,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CATEGORY_COLORS,
  calculateBudgetSummary,
  formatBRL,
  formatDateBR,
  getBudgetConfig,
  saveBudgetConfig,
} from "@/lib/finance";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

type Tx = {
  id: string;
  type: "receita" | "despesa";
  amount: number;
  final_amount: number | null;
  description: string;
  due_date: string | null;
  payment_date: string | null;
  category: string;
  is_paid: boolean;
  next_payroll: boolean;
  created_at: string;
};

type TransactionApiDTO = {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  description: string;
  category: string;
  accountId: string | null;
  agreementId?: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
};

function mapApiTx(tx: TransactionApiDTO): Tx {
  return {
    id: tx.id,
    type: tx.type === "INCOME" ? "receita" : "despesa",
    amount: tx.amount,
    final_amount: tx.amount,
    description: tx.description,
    due_date: tx.date ?? null,
    payment_date: null,
    category: tx.category,
    is_paid: false,
    next_payroll: false,
    created_at: tx.createdAt,
  };
}

function LogoutButton() {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("token");
    navigate({ to: "/login" });
  }
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleLogout}
      title="Sair"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </Button>
  );
}

// produce local YYYY-MM-DD (avoid UTC shift)
function isoDateLocal(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// timezone offset like +02:00 or -03:00
function tzOffsetString() {
  const offset = -new Date().getTimezoneOffset(); // minutes
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const mins = String(abs % 60).padStart(2, "0");
  return `${sign}${hours}:${mins}`;
}

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [monthTx, setMonthTx] = useState<Tx[]>([]);
  const [recent, setRecent] = useState<Tx[]>([]);
  const [budgetConfig, setBudgetConfig] = useState(() => getBudgetConfig());
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState(() => getBudgetConfig());
  // control current month shown (use first day of month)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    saveBudgetConfig(budgetConfig);
  }, [budgetConfig]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  async function load() {
    setLoading(true);

    // compute local date strings for start (first day) and end (last day of month)
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0); // last day of current month

    const startDate = isoDateLocal(firstOfMonth); // YYYY-MM-DD
    const endDate = isoDateLocal(lastOfMonth); // YYYY-MM-DD

    try {
      // send with local times to avoid timezone shift (start at 00:00:00 local, end at 23:59:59 local)
      const tz = tzOffsetString();
      const startParam = `${startDate}T00:00:00${tz}`;
      const endParam = `${endDate}T23:59:59${tz}`;

      const [monthRes, recentRes] = await Promise.all([
        api<{
          data: TransactionApiDTO[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        }>(
          `/api/transactions?startDate=${encodeURIComponent(startParam)}&endDate=${encodeURIComponent(endParam)}&page=1&limit=500`,
        ),
        api<{
          data: TransactionApiDTO[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        }>(`/api/transactions?page=1&limit=5`),
      ]);

      setMonthTx((monthRes.data ?? []).map(mapApiTx));
      setRecent((recentRes.data ?? []).map(mapApiTx));
    } catch (err: any) {
      toast.error(err?.message || "Erro ao carregar movimentações");
    } finally {
      setLoading(false);
    }
  }

  function prevMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }
  function resetToNow() {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  }

  const { receitas, despesas, saldo, despPorCategoria, recPorCategoria, budgetSummary } =
    useMemo(() => {
      const val = (t: Tx) => Number(t.final_amount ?? t.amount);
      const r = monthTx.filter((t) => t.type === "receita").reduce((s, t) => s + val(t), 0);
      const d = monthTx.filter((t) => t.type === "despesa").reduce((s, t) => s + val(t), 0);

      const groupBy = (type: "receita" | "despesa") => {
        const map = new Map<string, number>();
        monthTx
          .filter((t) => t.type === type)
          .forEach((t) => {
            map.set(t.category, (map.get(t.category) ?? 0) + val(t));
          });
        return Array.from(map.entries())
          .map(([category, total]) => ({ category, total }))
          .sort((a, b) => b.total - a.total);
      };

      return {
        receitas: r,
        despesas: d,
        saldo: r - d,
        despPorCategoria: groupBy("despesa"),
        recPorCategoria: groupBy("receita"),
        budgetSummary: calculateBudgetSummary(
          monthTx.map((t) => ({
            type: t.type,
            category: t.category,
            amount: Number(t.amount),
            final_amount: t.final_amount,
          })),
          budgetConfig,
        ),
      };
    }, [budgetConfig, monthTx]);

  const monthLabel = currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const visibleCategoryBudgets = budgetSummary.categoryBreakdown.slice(0, 4);

  function openBudgetModal() {
    setBudgetDraft({
      ...budgetConfig,
      categoryLimits: { ...budgetConfig.categoryLimits },
    });
    setBudgetModalOpen(true);
  }

  function saveBudgetModal() {
    setBudgetConfig(budgetDraft);
    setBudgetModalOpen(false);
    toast.success("Metas de orçamento atualizadas");
  }

  function exportCurrentReport() {
    const rows: Array<Array<string>> = [
      ["Mês", monthLabel],
      ["Receitas", formatBRL(receitas)],
      ["Despesas", formatBRL(despesas)],
      ["Saldo", formatBRL(saldo)],
      ["Meta mensal", formatBRL(budgetSummary.monthlyLimit)],
      ["Restante", formatBRL(budgetSummary.remainingBudget)],
      ["Uso do orçamento", `${Math.min(100, budgetSummary.spentPercentage).toFixed(0)}%`],
      [],
      ["Categoria", "Gasto", "Meta", "Restante", "Acima do limite"],
      ...budgetSummary.categoryBreakdown.map((item) => [
        item.category,
        item.spent.toFixed(2),
        item.limit.toFixed(2),
        item.remaining.toFixed(2),
        item.isOverBudget ? "Sim" : "Não",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(";"),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-financeiro-${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("Relatório exportado");
  }

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Visão geral
              </p>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-4xl md:text-5xl font-bold mt-1 capitalize">
                  {monthLabel}
                </h1>

                <div className="flex items-center gap-2 ml-3">
                  <Button variant="ghost" size="icon" onClick={prevMonth} aria-label="Mês anterior">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={resetToNow} aria-label="Mês atual">
                    Hoje
                  </Button>
                  <Button variant="ghost" size="icon" onClick={nextMonth} aria-label="Próximo mês">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:ml-6 mt-4 md:mt-0"></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={openBudgetModal}
              className="rounded-full border-border bg-card"
            >
              <PencilLine className="mr-1.5 h-4 w-4" /> Editar metas
            </Button>
            <Button variant="outline" onClick={exportCurrentReport} className="rounded-full border-border bg-card">
              <Download className="mr-1.5 h-4 w-4" /> Exportar relatório
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:opacity-90"
            >
              <Link to="/transacoes/nova">
                <Plus className="mr-1.5 h-4 w-4" /> Nova movimentação
              </Link>
            </Button>
          </div>
        </div>

        <Dialog open={budgetModalOpen} onOpenChange={setBudgetModalOpen}>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configurar metas de orçamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Meta mensal total</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={budgetDraft.monthlyLimit}
                  onChange={(event) =>
                    setBudgetDraft((current) => ({
                      ...current,
                      monthlyLimit: Math.max(0, Number(event.target.value) || 0),
                    }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-ring"
                />
              </div>

              <div className="space-y-3">
                {Object.keys(budgetDraft.categoryLimits).map((category) => (
                  <div key={category} className="space-y-2 rounded-2xl border border-border bg-muted/30 p-3">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-foreground">{category}</span>
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {budgetDraft.categoryLimits[category] ? formatBRL(budgetDraft.categoryLimits[category]) : "Sem meta"}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={budgetDraft.categoryLimits[category] ?? 0}
                      onChange={(event) =>
                        setBudgetDraft((current) => ({
                          ...current,
                          categoryLimits: {
                            ...current.categoryLimits,
                            [category]: Math.max(0, Number(event.target.value) || 0),
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm outline-none transition focus:border-ring"
                    />
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBudgetModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveBudgetModal} className="bg-primary text-primary-foreground">
                Salvar metas
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard
            label="Saldo do mês"
            value={saldo}
            icon={<Wallet className="h-4 w-4" />}
            highlight
            loading={loading}
          />
          <KpiCard
            label="Receitas"
            value={receitas}
            icon={<ArrowUpRight className="h-4 w-4 text-success" />}
            tone="success"
            loading={loading}
          />
          <KpiCard
            label="Despesas"
            value={despesas}
            icon={<ArrowDownRight className="h-4 w-4 text-destructive" />}
            tone="destructive"
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                <Target className="h-4 w-4" /> Resumo de orçamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Meta mensal
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular">{formatBRL(budgetSummary.monthlyLimit)}</p>
                </div>
                <Badge
                  variant={budgetSummary.remainingBudget >= 0 ? "secondary" : "destructive"}
                  className="rounded-full"
                >
                  {budgetSummary.remainingBudget >= 0 ? "Dentro do limite" : "Acima do limite"}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Gasto acumulado</span>
                  <span className="font-medium text-foreground">
                    {formatBRL(budgetSummary.totalExpenses)}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${
                      budgetSummary.remainingBudget >= 0
                        ? "bg-gradient-primary"
                        : "bg-destructive"
                    }`}
                    style={{ width: `${Math.min(100, budgetSummary.spentPercentage)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-muted/30 p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Restante
                  </p>
                  <p className="mt-2 text-xl font-bold tabular">
                    {formatBRL(budgetSummary.remainingBudget)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/30 p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Uso do orçamento
                  </p>
                  <p className="mt-2 text-xl font-bold tabular">
                    {Math.min(100, budgetSummary.spentPercentage).toFixed(0)}%
                  </p>
                </div>
              </div>

              {budgetSummary.overBudgetCategories.length > 0 ? (
                <div className="space-y-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <AlertTriangle className="h-4 w-4" /> Categorias acima da meta
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {budgetSummary.overBudgetCategories.map((item) => (
                      <Badge key={item.category} variant="destructive" className="rounded-full">
                        {item.category}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Nenhuma categoria excedeu a meta neste período.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                <Target className="h-4 w-4" /> Meta por categoria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Meta mensal total
                </span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={budgetConfig.monthlyLimit}
                  onChange={(event) =>
                    setBudgetConfig((current) => ({
                      ...current,
                      monthlyLimit: Math.max(0, Number(event.target.value) || 0),
                    }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-0 transition focus:border-ring"
                />
              </label>

              <div className="space-y-3">
                {visibleCategoryBudgets.map((item) => (
                  <div key={item.category} className="space-y-2 rounded-2xl border border-border bg-muted/30 p-3">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-foreground">{item.category}</span>
                      <span className="tabular text-muted-foreground">
                        {formatBRL(item.spent)} / {formatBRL(item.limit || 0)}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={budgetConfig.categoryLimits[item.category] ?? 0}
                      onChange={(event) =>
                        setBudgetConfig((current) => ({
                          ...current,
                          categoryLimits: {
                            ...current.categoryLimits,
                            [item.category]: Math.max(0, Number(event.target.value) || 0),
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm outline-none ring-0 transition focus:border-ring"
                    />
                    <div className="h-2 overflow-hidden rounded-full bg-background">
                      <div
                        className={`h-full rounded-full ${
                          item.isOverBudget ? "bg-destructive" : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(100, item.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5" /> Despesas por categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : despPorCategoria.length === 0 ? (
                <EmptyChart text="Nenhuma despesa neste mês" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={despPorCategoria}>
                    <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                    <XAxis
                      dataKey="category"
                      stroke="oklch(0.68 0.02 250)"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                    />
                    <YAxis
                      stroke="oklch(0.68 0.02 250)"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      tickFormatter={(v) => `R$ ${Number(v).toLocaleString("pt-BR")}`}
                    />
                    <Tooltip
                      cursor={{ fill: "oklch(1 0 0 / 4%)" }}
                      contentStyle={{
                        backgroundColor: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      formatter={(v) => formatBRL(Number(v))}
                    />
                    <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                      {despPorCategoria.map((d, i) => (
                        <Cell
                          key={i}
                          fill={CATEGORY_COLORS[d.category] ?? "var(--color-chart-2)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Receitas por categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : recPorCategoria.length === 0 ? (
                <EmptyChart text="Nenhuma receita neste mês" />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={recPorCategoria}
                        dataKey="total"
                        nameKey="category"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {recPorCategoria.map((d, i) => (
                          <Cell
                            key={i}
                            fill={CATEGORY_COLORS[d.category] ?? "var(--color-chart-1)"}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-popover)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                        formatter={(v) => formatBRL(Number(v))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <ul className="mt-3 space-y-1.5">
                    {recPorCategoria.slice(0, 5).map((d) => (
                      <li key={d.category} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: CATEGORY_COLORS[d.category] }}
                          />
                          {d.category}
                        </span>
                        <span className="tabular text-muted-foreground">{formatBRL(d.total)}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AppShell>
  );
}

function KpiCard({
  label,
  value,
  icon,
  tone,
  highlight,
  loading,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "success" | "destructive";
  highlight?: boolean;
  loading?: boolean;
}) {
  return (
    <Card
      className={`relative overflow-hidden border-border ${
        highlight ? "bg-accent/20" : "bg-card"
      }`}
    >
      {highlight && (
        <div className="pointer-events-none absolute inset-0 bg-primary/5" />
      )}
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider">
          <span>{label}</span>
          {icon}
        </div>
        {loading ? (
          <Skeleton className="h-9 w-32 mt-3" />
        ) : (
          <div
            className={`mt-3 tabular font-display text-3xl font-bold ${
              tone === "success"
                ? "text-success"
                : tone === "destructive"
                  ? "text-foreground"
                  : "text-gradient-primary"
            }`}
          >
            {formatBRL(value)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyChart({ text }: { text: string }) {
  return (
    <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
