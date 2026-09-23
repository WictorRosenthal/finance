import { api } from "@/lib/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
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
  const [form, setForm] = useState({ email: "", password: "", name: "" });

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
      // Para login, envie apenas email e password; para signup, envie também name
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : { email: form.email, password: form.password, name: form.name };

      const data = await api<{ token?: string }>(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md border-border/60 bg-gradient-card shadow-card">
        <CardContent className="space-y-6 p-6 md:p-8">
          <div className="space-y-2 text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Finance<span className="text-gradient-primary">Flow</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
            </p>
          </div>

              <div className="grid grid-cols-2 gap-2 rounded-xl bg-background/50 p-1">
                {[
                  { key: "login", label: "Entrar" },
                  { key: "signup", label: "Criar conta" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setMode(item.key as "login" | "signup")}
                    className={
                      mode === item.key
                        ? "rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                        : "rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground"
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    autoComplete="username"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Seu email"
                    className="bg-background/50"
                    required
                  />
                </div>

              {mode === "signup" && (
                  <div className="space-y-1.5">
                    <Label>Nome</Label>
                    <Input
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Seu nome"
                      className="bg-background/50"
                      required
                    />
                  </div>
                )}

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

            <Button
              type="submit"
              disabled={submitting}
              className="h-11 w-full rounded-xl bg-gradient-primary text-primary-foreground shadow-glow-primary hover:opacity-90"
            >
              {submitting ? "Processando..." : mode === "login" ? "Entrar" : "Criar conta"}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
