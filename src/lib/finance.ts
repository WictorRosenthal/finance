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
