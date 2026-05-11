import { createFileRoute } from "@tanstack/react-router";
import { TransactionForm } from "@/components/TransactionForm";

export const Route = createFileRoute("/transacoes/nova")({
  component: () => <TransactionForm />,
});
