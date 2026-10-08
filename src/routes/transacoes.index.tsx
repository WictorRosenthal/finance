import { api } from "@/lib/api";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  Filter,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { CATEGORIES, formatBRL, formatDateBR } from "@/lib/finance";

export const Route = createFileRoute("/transacoes/")({
  component: TransactionsPage,
});

type Tx = {
  id: string;
  type: "receita" | "despesa";
  amount: number;
  final_amount: number | null;
  description: string;
  due_date: string | null;
  payment_date: string | null;
  payment_method: string | null;
  category: string;
  convenio_id: string | null;
  is_paid: boolean;
  next_payroll: boolean;
  account_id: string | null;
  notes: string | null;
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
  paymentDate?: string | null;
  payment_date?: string | null;
  paidAt?: string | null;
  paid_at?: string | null;
  paymentMethod?: string | null;
  payment_method?: string | null;
  finalAmount?: number | null;
  final_amount?: number | null;
  notes?: string | null;
};

function mapApiTx(tx: TransactionApiDTO & Record<string, any>): Tx {
  const paymentDate = tx.paymentDate ?? tx.payment_date ?? tx.paidAt ?? tx.paid_at ?? null;

  const paymentMethod = tx.paymentMethod ?? tx.payment_method ?? null;

  return {
    id: tx.id,
    type: tx.type === "INCOME" ? "receita" : "despesa",
    amount: tx.amount,
    final_amount: tx.finalAmount ?? tx.final_amount ?? tx.amount,
    description: tx.description,
    due_date: tx.date ?? null,
    payment_date: paymentDate,
    payment_method: paymentMethod,
    category: tx.category,
    convenio_id: tx.agreementId ?? null,
    is_paid: !!paymentDate,
    next_payroll: false,
    account_id: tx.accountId ?? null,
    notes: tx.notes ?? null,
  };
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

function TransactionsPage() {
  const [items, setItems] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all"); // paid | pending | all
  const [toDelete, setToDelete] = useState<Tx | null>(null);

  // date range state: default = current month (local first and last day)
  const nowDefault = new Date();
  const firstOfMonth = new Date(nowDefault.getFullYear(), nowDefault.getMonth(), 1);
  const lastOfMonth = new Date(nowDefault.getFullYear(), nowDefault.getMonth() + 1, 0);
  const [startDate, setStartDate] = useState<string>(isoDateLocal(firstOfMonth));
  const [endDate, setEndDate] = useState<string>(isoDateLocal(lastOfMonth));

  useEffect(() => {
    void load(); // load with default start/end
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load(optionalStart?: string, optionalEnd?: string) {
    setLoading(true);

    const s = optionalStart ?? startDate; // 'YYYY-MM-DD'
    const e = optionalEnd ?? endDate; // 'YYYY-MM-DD'

    try {
      // send local-day range: start at 00:00:00 local, end at 23:59:59 local
      const tz = tzOffsetString();
      const startParam = `${s}T00:00:00${tz}`;
      const endParam = `${e}T23:59:59${tz}`;

      const res = await api<{ data: TransactionApiDTO[] }>(
        `/api/transactions?startDate=${encodeURIComponent(startParam)}&endDate=${encodeURIComponent(endParam)}&page=1&limit=1000`,
      );

      const now = new Date(); // compute next_payroll relative to "today"
      const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const firstOfMonthAfterNext = new Date(
        firstOfNextMonth.getFullYear(),
        firstOfNextMonth.getMonth() + 1,
        1,
      );

      const mapped = (res.data ?? []).map((tx) => {
        const m = mapApiTx(tx);
        if (m.due_date) {
          const due = new Date(m.due_date);
          m.next_payroll = due >= firstOfNextMonth && due < firstOfMonthAfterNext;
        } else {
          m.next_payroll = false;
        }
        return m;
      });

      // sort by due_date desc
      mapped.sort((a, b) => {
        const da = a.due_date ?? "";
        const db = b.due_date ?? "";
        return db.localeCompare(da);
      });

      setItems(mapped);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao carregar movimentações");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchByRange() {
    if (!startDate || !endDate) {
      toast.error("Informe data inicial e final");
      return;
    }
    if (startDate > endDate) {
      toast.error("Data inicial não pode ser maior que a final");
      return;
    }
    void load(startDate, endDate);
  }

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await api(`/api/transactions/${toDelete.id}`, {
        method: "DELETE",
      });
      toast.success("Movimentação excluída");
      setItems((prev) => prev.filter((i) => i.id !== toDelete.id));
    } catch (err: any) {
      toast.error(err?.message || "Erro ao excluir");
    }
    setToDelete(null);
  }

  // mark as paid
  async function markAsPaid(id: string, paymentDate?: string | null) {
    try {
      // determine ISO payment date to send
      const iso = paymentDate ?? new Date().toISOString();

      const res = await api<{ data: TransactionApiDTO }>(`/api/transactions/${id}/pay`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentDate: iso }),
      });

      const updated = res?.data
        ? mapApiTx(res.data as TransactionApiDTO & Record<string, any>)
        : null;

      setItems((prev) =>
        prev.map((t) =>
          t.id === id ? (updated ?? { ...t, is_paid: true, payment_date: iso }) : t,
        ),
      );

      toast.success("Movimentação marcada como paga");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao marcar como pago");
    }
  }

  const filtered = useMemo(() => {
    return items.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (category !== "all" && t.category !== category) return false;
      if (status === "paid" && !t.is_paid) return false;
      if (status === "pending" && t.is_paid) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, type, category, status, search]);

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Histórico</p>
            <h1 className="font-display text-4xl font-bold mt-1">Movimentações</h1>
          </div>
          <Button asChild className="rounded-full bg-primary text-primary-foreground hover:opacity-90">
            <Link to="/transacoes/nova">
              <Plus className="mr-1.5 h-4 w-4" /> Nova
            </Link>
          </Button>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground mr-2">De</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-md border bg-background/50 px-2 py-1 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground mr-2">Até</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-md border bg-background/50 px-2 py-1 text-sm"
              />
            </div>

            <Button onClick={handleSearchByRange} className="h-9">
              Buscar
            </Button>

            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-[140px] bg-background/50">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="receita">Receitas</SelectItem>
                <SelectItem value="despesa">Despesas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px] bg-background/50">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[170px] bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="paid">Pagas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border bg-card">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-sm text-muted-foreground">
                  {items.length === 0
                    ? "Nenhuma movimentação ainda."
                    : "Nenhum resultado para os filtros."}
                </p>
                {items.length === 0 && (
                  <Button asChild variant="outline" className="mt-4 rounded-full">
                    <Link to="/transacoes/nova">
                      <Plus className="mr-1.5 h-4 w-4" /> Cadastrar primeira
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-border/40">
                {filtered.map((t) => {
                  const v = Number(t.final_amount ?? t.amount);
                  const hasDiscount =
                    t.final_amount !== null && Number(t.final_amount) !== Number(t.amount);
                  const isReceita = t.type === "receita";
                  return (
                    <li
                      key={t.id}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
                    >
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                          isReceita
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {isReceita ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium truncate">{t.description}</span>
                          {t.is_paid ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 h-4 border-success/40 text-success"
                            >
                              pago
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 h-4 border-warning/40 text-warning"
                            >
                              pendente
                            </Badge>
                          )}
                          {t.next_payroll && (
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 h-4 border-accent/40 text-accent"
                            >
                              próxima folha
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>{t.category}</span>
                          <span>·</span>
                          <span>venc {formatDateBR(t.due_date)}</span>
                          {t.payment_method && (
                            <>
                              <span>·</span>
                              <span>{t.payment_method}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div
                          className={`tabular font-semibold ${isReceita ? "text-success" : "text-foreground"}`}
                        >
                          {isReceita ? "+" : "−"} {formatBRL(v)}
                        </div>
                        {hasDiscount && (
                          <div className="text-[10px] text-muted-foreground line-through tabular">
                            {formatBRL(Number(t.amount))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!t.is_paid && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Marcar como pago"
                            onClick={() => markAsPaid(t.id)}
                            className="h-8 w-8 text-success hover:text-success"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                          <Link to="/transacoes/$id" params={{ id: t.id }}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setToDelete(t)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir movimentação?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete && (
                <>
                  <strong>{toDelete.description}</strong> —{" "}
                  {formatBRL(Number(toDelete.final_amount ?? toDelete.amount))}
                  <br />
                  Esta ação não pode ser desfeita.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
