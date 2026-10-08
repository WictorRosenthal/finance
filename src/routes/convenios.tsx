import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Tag, Trash2, Power } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/convenios")({
  component: ConveniosPage,
});

type AgreementDTO = {
  id: string;
  name: string;
  category: string;
  monthlyFee: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type Convenio = {
  id: string;
  name: string;
  discount_percent: number;
  cutoff_day: number;
  description: string | null;
  active: boolean;
};

function mapAgreementToConvenio(agreement: AgreementDTO): Convenio {
  return {
    id: agreement.id,
    name: agreement.name,
    discount_percent: agreement.monthlyFee ?? 0,
    cutoff_day: 15,
    description: agreement.category || null,
    active: agreement.isActive,
  };
}

function ConveniosPage() {
  const [items, setItems] = useState<Convenio[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    discount_percent: "0",
    cutoff_day: "15",
    description: "",
  });

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api<AgreementDTO[]>("/api/agreements?includeInactive=true");
      setItems((data ?? []).map(mapAgreementToConvenio));
    } catch (err: any) {
      toast.error(err?.message || "Erro ao carregar convênios");
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    if (!form.name.trim()) return toast.error("Nome obrigatório");
    const dp = Number(form.discount_percent.replace(",", ".")) || 0;
    const cd = parseInt(form.cutoff_day) || 15;
    if (dp < 0 || dp > 100) return toast.error("Desconto entre 0 e 100");
    if (cd < 1 || cd > 31) return toast.error("Dia de corte entre 1 e 31");

    try {
      await api("/api/agreements", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          category: form.description.trim() || "Convênio",
          monthlyFee: dp,
        }),
      });

      toast.success("Convênio criado!");
      setForm({ name: "", discount_percent: "0", cutoff_day: "15", description: "" });
      setOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao criar convênio");
    }
  }

  async function toggleActive(c: Convenio) {
    try {
      await api(`/api/agreements/${c.id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !c.active }),
      });
      toast.success(c.active ? "Convênio desativado" : "Convênio ativado");
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao atualizar status");
    }
  }

  async function remove(c: Convenio) {
    if (!confirm(`Excluir convênio "${c.name}"?`)) return;

    try {
      await api(`/api/agreements/${c.id}`, {
        method: "DELETE",
      });
      toast.success("Convênio removido");
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao remover convênio");
    }
  }

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Descontos & folha
            </p>
            <h1 className="font-display text-4xl font-bold mt-1">Convênios</h1>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-primary text-primary-foreground hover:opacity-90">
                <Plus className="mr-1.5 h-4 w-4" /> Novo convênio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo convênio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>Nome *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Conv. ABC Supermercado"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Desconto (%)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={form.discount_percent}
                      onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                      className="tabular"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Dia de corte</Label>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={form.cutoff_day}
                      onChange={(e) => setForm({ ...form, cutoff_day: e.target.value })}
                      className="tabular"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Compras feitas após o dia de corte serão lançadas na próxima folha de pagamento.
                </p>
                <div className="space-y-1.5">
                  <Label>Descrição</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={create} className="bg-primary text-primary-foreground">
                  Criar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="p-16 text-center text-muted-foreground">
              Nenhum convênio cadastrado.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((c) => (
              <Card
                key={c.id}
                className={`border-border bg-card group ${!c.active ? "opacity-60" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-foreground">
                        <Tag className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-semibold text-lg flex items-center gap-2">
                          {c.name}
                          {!c.active && (
                            <Badge variant="outline" className="text-[10px]">
                              inativo
                            </Badge>
                          )}
                        </div>
                        {c.description && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {c.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleActive(c)}
                        title={c.active ? "Desativar" : "Ativar"}
                      >
                        <Power className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => remove(c)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-background/40 border border-border/40 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Desconto
                      </div>
                      <div className="tabular font-display text-2xl font-bold text-success mt-0.5">
                        {Number(c.discount_percent)}%
                      </div>
                    </div>
                    <div className="rounded-lg bg-background/40 border border-border/40 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Dia de corte
                      </div>
                      <div className="tabular font-display text-2xl font-bold mt-0.5">
                        {c.cutoff_day}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </AppShell>
  );
}
