import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

import { ACCOUNT_TYPES, formatBRL } from "@/lib/finance";

export const Route = createFileRoute("/contas")({
  component: AccountsPage,
});

type Account = {
  id: string;
  name: string;
  type: string | null;
  bank: string | null;
  balance: number;
};

function AccountsPage() {
  const [items, setItems] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "corrente", bank: "", balance: "0" });

  useEffect(() => { void load(); }, []);



async function load() {
  setLoading(true);
  try {
    const data = await api<Account[]>("/api/accounts");
    setItems(data);
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
}



async function create() {
  if (!form.name.trim()) {
    return toast.error("Nome obrigatório");
  }

  try {
    await api("/api/accounts", {
      method: "POST",
      body: JSON.stringify({
        name: form.name.trim(),
        type: form.type,
        bank: form.bank.trim() || null,
        balance: Number(form.balance.replace(",", ".")) || 0,
      }),
    });

    toast.success("Conta criada!");
    setForm({ name: "", type: "corrente", bank: "", balance: "0" });
    setOpen(false);
    await load();
  } catch (err: any) {
    toast.error(err.message);
  }
}


async function remove(a: Account) {
  if (!confirm(`Excluir conta "${a.name}"?`)) return;

  try {
    await api(`/api/accounts/${a.id}`, {
      method: "DELETE",
    });

    toast.success("Conta removida");
    await load();
  } catch (err: any) {
    toast.error(err.message);
  }
}


  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Suas contas</p>
            <h1 className="font-display text-4xl font-bold mt-1">Contas</h1>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground shadow-glow-primary hover:opacity-90 rounded-full">
                <Plus className="mr-1.5 h-4 w-4" /> Nova conta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nova conta</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>Nome *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Bradesco principal" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Tipo</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ACCOUNT_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Banco</Label>
                    <Input value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} placeholder="Bradesco" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Saldo inicial (R$)</Label>
                  <Input type="number" step="0.01" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} className="tabular" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={create} className="bg-gradient-primary text-primary-foreground">Criar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : items.length === 0 ? (
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="p-16 text-center text-muted-foreground">
              Nenhuma conta cadastrada.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((a) => (
              <Card key={a.id} className="bg-gradient-card border-border/50 shadow-card group hover:shadow-glow-primary transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => remove(a)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="mt-4">
                    <div className="font-display font-semibold text-lg">{a.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {[a.type, a.bank].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Saldo</div>
                    <div className="tabular font-display text-2xl font-bold mt-0.5">{formatBRL(a.balance)}</div>
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
