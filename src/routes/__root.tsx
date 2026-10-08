import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-gradient-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">A página que você procura não existe.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MeuFinanceiro — Controle financeiro pessoal" },
      {
        name: "description",
        content: "Organize receitas, despesas, contas e convênios com clareza.",
      },
      { name: "theme-color", content: "#1f2024" },
      { property: "og:title", content: "MeuFinanceiro — Controle financeiro pessoal" },
      { name: "twitter:title", content: "MeuFinanceiro — Controle financeiro pessoal" },
      {
        property: "og:description",
        content: "Organize receitas, despesas, contas e convênios com clareza.",
      },
      {
        name: "twitter:description",
        content: "Organize receitas, despesas, contas e convênios com clareza.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4c628a94-9029-44fb-915a-87983139e004/id-preview-14453e56--793059bf-ada7-4750-ac72-0d0ed919a1c4.lovable.app-1776707539534.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4c628a94-9029-44fb-915a-87983139e004/id-preview-14453e56--793059bf-ada7-4750-ac72-0d0ed919a1c4.lovable.app-1776707539534.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { location } = useRouterState();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [authChecked, setAuthChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const hasStoredToken = Boolean(token);
    const savedTheme = localStorage.getItem("theme") ?? "system";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (savedTheme === "system" && prefersDark);

    document.documentElement.classList.toggle("dark", isDark);
    setTheme(isDark ? "dark" : "light");
    setHasToken(hasStoredToken);
    setAuthChecked(true);

    if (!hasStoredToken && currentPath !== "/login") {
      navigate({ to: "/login", search: { redirect: currentPath }, replace: true });
      return;
    }

    if (hasStoredToken && currentPath === "/login") {
      navigate({ to: "/", replace: true });
    }
  }, [currentPath, navigate]);

  if (!authChecked || (currentPath !== "/login" && !hasToken)) {
    return null;
  }

  return (
    <>
      <Outlet />
      <Toaster theme={theme} position="top-right" richColors />
    </>
  );
}
