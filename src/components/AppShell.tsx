import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Tag,
  LogOut,
  User,
  MoonStar,
  SunMedium,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */

type UserDTO = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
};

/* ---------------- HELPERS ---------------- */

function getInitials(name: string) {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ---------------- USER MENU ---------------- */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function UserMenu() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadUser();
  }, []);

  async function loadUser() {
    try {
      const res = await api<UserDTO>("/api/user"); // ajuste se necessário
      setUser(res);
    } catch (err) {
      console.error("Erro ao carregar usuário");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate({ to: "/login" });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background font-semibold text-foreground shadow-sm transition hover:bg-accent">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            getInitials(user?.name || "")
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          {loading ? (
            <span className="text-sm text-muted-foreground">Carregando...</span>
          ) : (
            <>
              <span className="font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate({ to: "/perfil" })}>
          <User className="mr-2 h-4 w-4" />
          Perfil
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------------- NAV ---------------- */

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transacoes", label: "Movimentações", icon: ArrowLeftRight },
  { to: "/contas", label: "Contas", icon: Wallet },
  { to: "/convenios", label: "Convênios", icon: Tag },
] as const;

/* ---------------- APP SHELL ---------------- */

export function AppShell({ children }: { children: React.ReactNode }) {
  const { location } = useRouterState();
  const path = location.pathname;
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light";

    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
              F
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-bold tracking-tight">
                MeuFinanceiro
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Controle financeiro
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-border bg-muted/40 p-1 md:flex">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? path === "/" : path.startsWith(to);

              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>
            <UserMenu />
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? path === "/" : path.startsWith(to);

            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-2 text-xs font-medium",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>

      <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-muted-foreground sm:px-6">
        MeuFinanceiro · controle pessoal · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
