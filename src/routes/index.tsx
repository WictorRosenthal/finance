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
import { ArrowDownRight, ArrowUpRight, Wallet, TrendingUp, Plus, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORY_COLORS, formatBRL, formatDateBR } from "@/lib/finance";
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
  // control current month shown (use first day of month)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

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
    const endDate = isoDateLocal(lastOfMonth);    // YYYY-MM-DD

    try {
      // send with local times to avoid timezone shift (start at 00:00:00 local, end at 23:59:59 local)
      const tz = tzOffsetString();
      const startParam = `${startDate}T00:00:00${tz}`;
      const endParam = `${endDate}T23:59:59${tz}`;

      const [monthRes, recentRes] = await Promise.all([
        api<{ data: TransactionApiDTO[]; total: number; page: number; limit: number; totalPages: number }>(
          `/api/transactions?startDate=${encodeURIComponent(startParam)}&endDate=${encodeURIComponent(endParam)}&page=1&limit=500`,
        ),
        api<{ data: TransactionApiDTO[]; total: number; page: number; limit: number; totalPages: number }>(
          `/api/transactions?page=1&limit=5`,
        ),
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

  const { receitas, despesas, saldo, despPorCategoria, recPorCategoria } = useMemo(() => {
    const val = (t: Tx) => Number(t.final_amount ?? t.amount);
    const r = monthTx.filter((t) => t.type === "receita").reduce((s, t) => s + val(t), 0);
    const d = monthTx.filter((t) => t.type === "despesa").reduce((s, t) => s + val(t), 0);

    const groupBy = (type: "receita" | "despesa") => {
      const map = new Map<string, number>();
      monthTx.filter((t) => t.type === type).forEach((t) => {
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
    };
  }, [monthTx]);

  const monthLabel = currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

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
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Visão geral</p>
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
            <div className="flex items-center gap-2 md:ml-6 mt-4 md:mt-0"> 
            </div>
          </div>
          <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow-primary hover:opacity-90 rounded-full">
            <Link to="/transacoes/nova">
              <Plus className="mr-1.5 h-4 w-4" /> Nova movimentação
            </Link>
          </Button>
        </div>

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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 bg-gradient-card border-border/50 shadow-card">
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
                        <Cell key={i} fill={CATEGORY_COLORS[d.category] ?? "var(--color-chart-2)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card">
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
                          <Cell key={i} fill={CATEGORY_COLORS[d.category] ?? "var(--color-chart-1)"} />
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
      className={`relative overflow-hidden border-border/50 shadow-card ${
        highlight ? "bg-gradient-card" : "bg-card"
      }`}
    >
      {highlight && (
        <div className="absolute inset-0 bg-gradient-primary opacity-[0.06] pointer-events-none" />
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
              tone === "success" ? "text-success" : tone === "destructive" ? "text-foreground" : "text-gradient-primary"
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