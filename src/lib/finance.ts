import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const CATEGORIES = [
  "Salário",
  "Freelancer",
  "Casa",
  "Carro",
  "Moto",
  "Saúde",
  "Esportes",
  "Lazer",
  "Alimentação",
  "Alimentação/Lazer",
  "Outros",
] as const;

export const PAYMENT_METHODS = [
  "débito",
  "crédito",
  "pix",
  "dinheiro",
  "boleto",
  "convênio",
  "transferência",
] as const;

export const ACCOUNT_TYPES = ["corrente", "poupança", "carteira"] as const;

export type Category = (typeof CATEGORIES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  Salário: "var(--color-chart-1)",
  Freelancer: "var(--color-chart-6)",
  Casa: "var(--color-chart-4)",
  Carro: "var(--color-chart-2)",
  Moto: "var(--color-chart-5)",
  Saúde: "var(--color-chart-3)",
  Esportes: "var(--color-chart-6)",
  Lazer: "var(--color-chart-5)",
  Alimentação: "var(--color-chart-3)",
  "Alimentação/Lazer": "var(--color-chart-2)",
  Outros: "var(--color-chart-4)",
};

export function formatBRL(value: number | null | undefined): string {
  const v = Number(value ?? 0);
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function formatDateBR(date: string | null | undefined): string {
  if (!date) return "—";
  try {
    return format(parseISO(date), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return date;
  }
}

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export type BudgetConfig = {
  monthlyLimit: number;
  categoryLimits: Record<string, number>;
};

export const BUDGET_STORAGE_KEY = "meuFinanceiro-budget-config";

export function getDefaultBudgetConfig(): BudgetConfig {
  return {
    monthlyLimit: 4500,
    categoryLimits: {
      Casa: 1200,
      Carro: 650,
      Moto: 350,
      Saúde: 500,
      Esportes: 300,
      Lazer: 450,
      Alimentação: 800,
      "Alimentação/Lazer": 250,
      Outros: 400,
    },
  };
}

export function getBudgetConfig(): BudgetConfig {
  if (typeof window === "undefined") {
    return getDefaultBudgetConfig();
  }

  try {
    const raw = window.localStorage.getItem(BUDGET_STORAGE_KEY);
    const defaults = getDefaultBudgetConfig();

    if (!raw) {
      return defaults;
    }

    const parsed = JSON.parse(raw) as Partial<BudgetConfig>;
    return {
      monthlyLimit: Number(parsed.monthlyLimit ?? defaults.monthlyLimit) || defaults.monthlyLimit,
      categoryLimits: {
        ...defaults.categoryLimits,
        ...(parsed.categoryLimits ?? {}),
      },
    };
  } catch {
    return getDefaultBudgetConfig();
  }
}

export function saveBudgetConfig(config: BudgetConfig) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(config));
}

export type BudgetSummaryItem = {
  category: string;
  spent: number;
  limit: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
};

export function calculateBudgetSummary(
  monthTx: Array<{ type: "receita" | "despesa"; category: string; amount: number; final_amount?: number | null }>,
  config: BudgetConfig,
) {
  const totalIncome = monthTx
    .filter((t) => t.type === "receita")
    .reduce((sum, t) => sum + Number(t.final_amount ?? t.amount ?? 0), 0);

  const totalExpenses = monthTx
    .filter((t) => t.type === "despesa")
    .reduce((sum, t) => sum + Number(t.final_amount ?? t.amount ?? 0), 0);

  const monthlyLimit = Number(config.monthlyLimit ?? 0);
  const remainingBudget = monthlyLimit - totalExpenses;
  const spentPercentage = monthlyLimit > 0 ? (totalExpenses / monthlyLimit) * 100 : 0;

  const categoryMap = new Map<string, number>();
  monthTx
    .filter((t) => t.type === "despesa")
    .forEach((t) => {
      const category = t.category || "Outros";
      categoryMap.set(category, (categoryMap.get(category) ?? 0) + Number(t.final_amount ?? t.amount ?? 0));
    });

  const categoryBreakdown: BudgetSummaryItem[] = Array.from(categoryMap.entries())
    .map(([category, spent]) => {
      const limit = Number(config.categoryLimits?.[category] ?? 0);
      const remaining = limit - spent;
      const percentage = limit > 0 ? Math.min((spent / limit) * 100, 1000) : 0;

      return {
        category,
        spent,
        limit,
        remaining,
        percentage,
        isOverBudget: limit > 0 && spent > limit,
      };
    })
    .sort((a, b) => b.spent - a.spent);

  const overBudgetCategories = categoryBreakdown.filter((item) => item.isOverBudget);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    monthlyLimit,
    remainingBudget,
    spentPercentage,
    categoryBreakdown,
    overBudgetCategories,
  };
}

/**
 * Calcula valor final aplicando desconto do convênio.
 */
export function applyDiscount(amount: number, discountPercent: number): number {
  const v = amount - amount * (discountPercent / 100);
  return Math.round(v * 100) / 100;
}

/**
 * Determina se a transação cai na próxima folha de pagamento.
 * Regra: se data de pagamento (ou vencimento) > cutoff_day → true.
 */
export function fallsInNextPayroll(
  payment_date: string | null,
  due_date: string | null,
  cutoff_day: number,
): boolean {
  const ref = payment_date ?? due_date;
  if (!ref) return false;
  try {
    const day = parseISO(ref).getDate();
    return day > cutoff_day;
  } catch {
    return false;
  }
}
