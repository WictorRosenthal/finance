import { api } from "@/lib/api";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const search = Route.useSearch() as { redirect?: string };
  const redirectTo = useMemo(() => search.redirect || "/", [search.redirect]);

  useEffect(() => {
    // Se já estiver autenticado, redirecione
    const token = localStorage.getItem("token");
    if (token) {
      void navigate({ to: redirectTo as never });
    }
  }, [navigate, redirectTo]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/register";
      const data = await api<{ token?: string }>(endpoint, {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (mode === "login") {
        localStorage.setItem("token", data.token ?? "");
        toast.success("Login realizado com sucesso");
        void navigate({ to: redirectTo as never });
      } else {
        toast.success("Conta criada com sucesso");
        setMode("login");
      }
    } catch (err: any) {
      toast.error(err?.message || "Erro de conexão com o servidor");
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Acesso protegido
            </div>
            <div>
              <h1 className="font-display text-5xl font-bold tracking-tight text-foreground md:text-6xl">
                Finance<span className="text-gradient-primary">Flow</span>
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
                Entre para acompanhar movimentações, convênios e limites com dados isolados por usuário e sessão segura.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: LockKeyhole, title: "JWT automático", text: "Sua sessão fica protegida sem exigir configuração manual." },
              { icon: Mail, title: "Acesso por usuário", text: "Login tradicional com usuário e senha." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-border/50 bg-gradient-card p-5 shadow-card">
                <Icon className="h-5 w-5 text-primary" />
                <div className="mt-4 font-medium">{title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-border/60 bg-gradient-card shadow-card">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-background/50 p-1">
                {[
                  { key: "login", label: "Entrar" },
                  { key: "signup", label: "Criar conta" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setMode(item.key as "login" | "signup")}
                    className={mode === item.key ? "rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground" : "rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground"}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Usuário</Label>
                  <Input
                    type="text"
                    autoComplete="username"
                    value={form.username}
                    onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="Seu usuário"
                    className="bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Senha</Label>
                  <Input
                    type="password"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="bg-background/50"
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" disabled={submitting} className="h-11 w-full rounded-xl bg-gradient-primary text-primary-foreground shadow-glow-primary hover:opacity-90">
                  {submitting ? "Processando..." : mode === "login" ? "Entrar" : "Criar conta"}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground">
                Ao continuar, seus dados ficam protegidos por sessão individual.
                <Link to="/" className="ml-1 text-primary underline underline-offset-4">Voltar</Link>
              </p>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}