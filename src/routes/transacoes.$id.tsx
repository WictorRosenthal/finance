import { createFileRoute } from "@tanstack/react-router";
import { TransactionForm } from "@/components/TransactionForm";

export const Route = createFileRoute("/transacoes/$id")({
  component: EditTx,
});

function EditTx() {
  const { id } = Route.useParams();
  return <TransactionForm id={id} />;
}
