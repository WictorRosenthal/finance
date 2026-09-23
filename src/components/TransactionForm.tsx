import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CATEGORIES,
  PAYMENT_METHODS,
  applyDiscount,
  fallsInNextPayroll,
  formatBRL,
  todayISO,
} from "@/lib/finance";

type Account = { id: string; name: string; bank: string | null };
type Convenio = {
  id: string;
  name: string;
  discount_percent: number;
  cutoff_day: number;
  active: boolean;
};
type AgreementDTO = { id: string; name: string; monthlyFee: number | null; isActive: boolean };
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

type Frequency = "weekly" | "biweekly" | "monthly" | "bimonthly" | "yearly";
type EndMode = "count" | "until";

export type FormValues = {
  type: "receita" | "despesa";
  amount: string;
  description: string;
  due_date: string;
  payment_date: string;
  payment_method: string;
  category: string;
  convenio_id: string;
  account_id: string;
  is_paid: boolean;
  notes: string;
  is_recurring: boolean;
  frequency: Frequency;
  end_mode: EndMode;
  occurrences: string;
  end_date: string;
};

const EMPTY: FormValues = {
  type: "despesa",
  amount: "",
  description: "",
  due_date: todayISO(),
  payment_date: "",
  payment_method: "pix",
  category: "Outros",
  convenio_id: "",
  account_id: "",
  is_paid: false,
  notes: "",
  is_recurring: false,
  frequency: "monthly",
  end_mode: "count",
  occurrences: "12",
  end_date: "",
};

const FREQUENCY_LABELS: Record<Frequency, string> = {
  weekly: "Semanal",
  biweekly: "Quinzenal",
  monthly: "Mensal",
  bimonthly: "Bimestral",
  yearly: "Anual",
};

function addInterval(isoDate: string, freq: Frequency, n: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  switch (freq) {
    case "weekly":
      date.setDate(date.getDate() + 7 * n);
      break;
    case "biweekly":
      date.setDate(date.getDate() + 14 * n);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + n);
      break;
    case "bimonthly":
      date.setMonth(date.getMonth() + 2 * n);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + n);
      break;
  }
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function buildOccurrenceDates(
  startDate: string,
  freq: Frequency,
  endMode: EndMode,
  occurrences: number,
  endDate: string,
): string[] {
  const dates: string[] = [];
  if (endMode === "count") {
    const max = Math.max(1, Math.min(occurrences, 120));
    for (let i = 0; i < max; i++) dates.push(addInterval(startDate, freq, i));
  } else {
    if (!endDate) return [startDate];
    let i = 0;
    while (i < 240) {
      const d = addInterval(startDate, freq, i);
      if (d > endDate) break;
      dates.push(d);
      i++;
    }
  }
  return dates;
}

export function TransactionForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    void loadRefs();
    if (id) void loadTx(id);
  }, [id]);

  async function loadRefs() {
    try {
      const [accountsRes, agreementsRes] = await Promise.all([
        api<Account[]>("/api/accounts"),
        api<AgreementDTO[]>("/api/agreements?includeInactive=true"),
      ]);

      setAccounts(
        (accountsRes ?? []).map((account) => ({
          id: account.id,
          name: account.name,
          bank: null,
        })),
      );

      setConvenios(
        (agreementsRes ?? [])
          .filter((agreement) => agreement.isActive)
          .map((agreement) => ({
            id: agreement.id,
            name: agreement.name,
            discount_percent: agreement.monthlyFee ?? 0,
            cutoff_day: 15,
            active: agreement.isActive,
          })),
      );
    } catch (err: any) {
      toast.error(err?.message || "Erro ao carregar referências");
    }
  }

  async function loadTx(txId: string) {
    try {
      const data = await api<TransactionApiDTO>(`/api/transactions/${txId}`);
      setValues({
        type: data.type === "INCOME" ? "receita" : "despesa",
        amount: String(data.amount),
        description: data.description,
        due_date: data.date.slice(0, 10),
        payment_date: "",
        payment_method: "pix",
        category: data.category,
        convenio_id: data.agreementId ?? "",
        account_id: data.accountId ?? "",
        is_paid: false,
        notes: "",
        is_recurring: false,
        frequency: "monthly",
        end_mode: "count",
        occurrences: "12",
        end_date: "",
      });
    } catch (err: any) {
      toast.error(err?.message || "Movimentação não encontrada");
      navigate({ to: "/transacoes" });
    } finally {
      setLoading(false);
    }
  }

  function set<K extends keyof FormValues>(key: K, v: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  // Calcular preview
  const amountNum = Number(values.amount.replace(",", ".")) || 0;
  const conv = convenios.find((c) => c.id === values.convenio_id);
  const finalAmount = conv ? applyDiscount(amountNum, Number(conv.discount_percent)) : amountNum;
  const willBeNextPayroll =
    !!conv &&
    fallsInNextPayroll(values.payment_date || null, values.due_date || null, conv.cutoff_day);

  // Preview de ocorrências (apenas para nova + recorrente)
  const recurringDates =
    !id && values.is_recurring && values.due_date
      ? buildOccurrenceDates(
          values.due_date,
          values.frequency,
          values.end_mode,
          Number(values.occurrences) || 0,
          values.end_date,
        )
      : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (amountNum <= 0) return toast.error("Valor deve ser maior que zero");
    if (!values.description.trim()) return toast.error("Descrição obrigatória");
    if (!values.category) return toast.error("Categoria obrigatória");
    if (values.payment_date && values.due_date && values.payment_date < values.due_date) {
      const ok = window.confirm(
        "Data de pagamento é anterior à data de vencimento. Confirmar mesmo assim?",
      );
      if (!ok) return;
    }

    const isRecurringNew = !id && values.is_recurring;
    if (isRecurringNew) {
      if (!values.due_date) return toast.error("Data de vencimento é obrigatória para recorrência");
      if (values.end_mode === "count") {
        const n = Number(values.occurrences);
        if (!n || n < 1) return toast.error("Informe o número de ocorrências (mín. 1)");
        if (n > 120) return toast.error("Máximo de 120 ocorrências");
      } else {
        if (!values.end_date) return toast.error("Informe a data final da recorrência");
        if (values.end_date < values.due_date)
          return toast.error("Data final deve ser após o vencimento inicial");
      }
      if (recurringDates.length === 0) return toast.error("Nenhuma ocorrência foi gerada");
    }

    setSaving(true);

    if (!values.account_id) {
      toast.error("Conta obrigatória");
      setSaving(false);
      return;
    }

    const basePayload = {
      description: values.description.trim(),
      amount: amountNum,
      type: values.type === "receita" ? "INCOME" : "EXPENSE",
      category: values.category,
      accountId: values.account_id,
      agreementId: values.convenio_id || undefined,
      date: values.due_date || todayISO(),
    };

    let error: Error | null = null;

    if (id) {
      try {
        await api(`/api/transactions/${id}`, {
          method: "PUT",
          body: JSON.stringify(basePayload),
        });
      } catch (err: any) {
        error = err;
      }
    } else if (isRecurringNew) {
      const total = recurringDates.length;
      const createPromises = recurringDates.map((dueISO, idx) => {
        return api("/api/transactions", {
          method: "POST",
          body: JSON.stringify({
            ...basePayload,
            description: `${basePayload.description} (${idx + 1}/${total})`,
            date: dueISO,
          }),
        });
      });

      try {
        await Promise.all(createPromises);
      } catch (err: any) {
        error = err;
      }
    } else {
      try {
        await api("/api/transactions", {
          method: "POST",
          body: JSON.stringify(basePayload),
        });
      } catch (err: any) {
        error = err;
      }
    }

    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return;
    }

    let msg: string;
    if (id) {
      msg = "Movimentação atualizada!";
    } else if (isRecurringNew) {
      msg = `${recurringDates.length} movimentações recorrentes cadastradas!`;
    } else {
      msg = "Movimentação cadastrada!";
    }
    if (conv && finalAmount !== amountNum && !isRecurringNew) {
      msg += ` Desconto de ${conv.discount_percent}% aplicado: ${formatBRL(finalAmount)}.`;
    }
    if (willBeNextPayroll && !isRecurringNew) msg += " Será lançada na próxima folha.";
    toast.success(msg);
    navigate({ to: "/transacoes" });
  }

  if (loading) {
    return (
      <AppShell>
        <div className="text-muted-foreground">Carregando...</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-3 -ml-3">
            <Link to="/transacoes">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Voltar
            </Link>
          </Button>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            {id ? "Editar movimentação" : "Nova movimentação"}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="p-6 space-y-5">
              {/* Tipo */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-background/50 rounded-xl">
                {(["despesa", "receita"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("type", t)}
                    className={`py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                      values.type === t
                        ? t === "receita"
                          ? "bg-success text-success-foreground shadow-glow-primary"
                          : "bg-card border border-border shadow-card"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Valor (R$) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    inputMode="decimal"
                    value={values.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    placeholder="0,00"
                    required
                    className="bg-background/50 tabular text-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Categoria *</Label>
                  <Select value={values.category} onValueChange={(v) => set("category", v)}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Descrição *</Label>
                <Input
                  value={values.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Ex: Supermercado da semana"
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Data de vencimento</Label>
                  <Input
                    type="date"
                    value={values.due_date}
                    onChange={(e) => set("due_date", e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Data de pagamento</Label>
                  <Input
                    type="date"
                    value={values.payment_date}
                    onChange={(e) => set("payment_date", e.target.value)}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Forma de pagamento</Label>
                  <Select
                    value={values.payment_method}
                    onValueChange={(v) => set("payment_method", v)}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m} value={m} className="capitalize">
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Conta</Label>
                  <Select
                    value={values.account_id || "none"}
                    onValueChange={(v) => set("account_id", v === "none" ? "" : v)}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— Nenhuma —</SelectItem>
                      {accounts.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                          {a.bank ? ` · ${a.bank}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {accounts.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Nenhuma conta.{" "}
                      <Link to="/contas" className="text-primary underline">
                        Criar uma
                      </Link>
                      .
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Convênio</Label>
                <Select
                  value={values.convenio_id || "none"}
                  onValueChange={(v) => set("convenio_id", v === "none" ? "" : v)}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Sem convênio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Sem convênio —</SelectItem>
                    {convenios.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} · {c.discount_percent}% off · corte dia {c.cutoff_day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {convenios.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Nenhum convênio.{" "}
                    <Link to="/convenios" className="text-primary underline">
                      Criar um
                    </Link>
                    .
                  </p>
                )}
              </div>

              {/* Preview de cálculo */}
              {(conv || amountNum > 0) && (
                <div className="rounded-xl border border-border/50 bg-background/40 p-4 space-y-1.5">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Preview
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Valor original</span>
                    <span className="tabular">{formatBRL(amountNum)}</span>
                  </div>
                  {conv && finalAmount !== amountNum && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Desconto ({conv.discount_percent}%)
                        </span>
                        <span className="tabular text-success">
                          − {formatBRL(amountNum - finalAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-semibold pt-1 border-t border-border/40">
                        <span>Valor final</span>
                        <span className="tabular text-gradient-primary">
                          {formatBRL(finalAmount)}
                        </span>
                      </div>
                    </>
                  )}
                  {willBeNextPayroll && (
                    <p className="text-xs text-warning mt-2">
                      ⓘ Compra após dia {conv?.cutoff_day} — será lançada na próxima folha.
                    </p>
                  )}
                </div>
              )}

              {/* Recorrência (apenas em criação) */}
              {!id && (
                <div className="rounded-xl border border-border/50 bg-background/40 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="recurring" className="cursor-pointer">
                        Movimentação recorrente
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Repete ao longo do tempo (ex: aluguel, assinatura)
                      </p>
                    </div>
                    <Switch
                      id="recurring"
                      checked={values.is_recurring}
                      onCheckedChange={(v) => set("is_recurring", v)}
                    />
                  </div>

                  {values.is_recurring && (
                    <div className="space-y-4 pt-2 border-t border-border/40">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label>Frequência</Label>
                          <Select
                            value={values.frequency}
                            onValueChange={(v) => set("frequency", v as Frequency)}
                          >
                            <SelectTrigger className="bg-background/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((f) => (
                                <SelectItem key={f} value={f}>
                                  {FREQUENCY_LABELS[f]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label>Repetir até</Label>
                          <Select
                            value={values.end_mode}
                            onValueChange={(v) => set("end_mode", v as EndMode)}
                          >
                            <SelectTrigger className="bg-background/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="count">Número de ocorrências</SelectItem>
                              <SelectItem value="until">Data final</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {values.end_mode === "count" ? (
                        <div className="space-y-1.5">
                          <Label>Número de ocorrências</Label>
                          <Input
                            type="number"
                            min="1"
                            max="120"
                            step="1"
                            value={values.occurrences}
                            onChange={(e) => set("occurrences", e.target.value)}
                            className="bg-background/50 tabular"
                          />
                          <p className="text-xs text-muted-foreground">
                            Inclui a primeira. Máximo 120.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <Label>Data final</Label>
                          <Input
                            type="date"
                            value={values.end_date}
                            min={values.due_date || undefined}
                            onChange={(e) => set("end_date", e.target.value)}
                            className="bg-background/50"
                          />
                        </div>
                      )}

                      {recurringDates.length > 0 && (
                        <div className="rounded-lg bg-background/60 border border-border/40 p-3 space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Serão geradas</span>
                            <span className="font-semibold tabular text-gradient-primary">
                              {recurringDates.length} movimentações
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              Primeira: {recurringDates[0].split("-").reverse().join("/")}
                            </span>
                            <span>
                              Última:{" "}
                              {recurringDates[recurringDates.length - 1]
                                .split("-")
                                .reverse()
                                .join("/")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm pt-1 border-t border-border/40 mt-2">
                            <span className="text-muted-foreground">Total</span>
                            <span className="font-semibold tabular">
                              {formatBRL(finalAmount * recurringDates.length)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-xl bg-background/40 border border-border/50">
                <div>
                  <Label htmlFor="paid" className="cursor-pointer">
                    Já está pago?
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Marque se a transação já foi quitada
                  </p>
                </div>
                <Switch
                  id="paid"
                  checked={values.is_paid}
                  onCheckedChange={(v) => set("is_paid", v)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Observações</Label>
                <Textarea
                  value={values.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Opcional"
                  className="bg-background/50 min-h-[80px]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" asChild className="flex-1">
                  <Link to="/transacoes">Cancelar</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-primary text-primary-foreground shadow-glow-primary hover:opacity-90"
                >
                  <Save className="mr-1.5 h-4 w-4" />
                  {saving ? "Salvando..." : id ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </AppShell>
  );
}
