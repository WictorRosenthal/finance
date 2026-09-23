import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, ArrowLeftRight, Wallet, Tag, LogOut, User } from "lucide-react";

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
        <button className="h-10 w-10 rounded-full bg-gradient-primary text-white flex items-center justify-center font-semibold shadow hover:opacity-90 transition">
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

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative h-9 w-9 rounded-xl bg-gradient-primary shadow-glow-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-lg">F</span>
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-lg tracking-tight">
                Finance<span className="text-gradient-primary">Flow</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Controle financeiro
              </div>
            </div>
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-card/60 border border-border/50">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? path === "/" : path.startsWith(to);

              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-glow-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* USER MENU */}
          <div className="flex items-center gap-3">
            <UserMenu />
          </div>
        </div>

        {/* NAV MOBILE */}
        <nav className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? path === "/" : path.startsWith(to);

            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground bg-card/60 border border-border/50",
                )}
              >
                <Icon className="h-3 w-3" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>

      <footer className="mx-auto max-w-7xl px-6 py-10 text-center text-xs text-muted-foreground">
        FinanceFlow · controle pessoal · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
