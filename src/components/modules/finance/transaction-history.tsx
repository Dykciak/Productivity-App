"use client";

import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/lib/types";
import { deleteTransaction } from "@/lib/actions/finance";

function TransactionRow({ transaction }: { transaction: Transaction }) {
  return (
    <div className="group flex items-center justify-between gap-3 border-b border-border px-1 py-2.5 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-foreground">{transaction.category}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(transaction.date), "MMM d, yyyy")}
          {transaction.note ? ` · ${transaction.note}` : ""}
        </p>
      </div>
      <span
        className={
          "shrink-0 text-sm font-medium tabular-nums " +
          (transaction.type === "INCOME" ? "text-success" : "text-destructive")
        }
      >
        {transaction.type === "INCOME" ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </span>
      <button
        onClick={() => deleteTransaction(transaction.id)}
        className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        aria-label={`Delete transaction ${transaction.category}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  const income = transactions.filter((t) => t.type === "INCOME");
  const expenses = transactions.filter((t) => t.type === "EXPENSE");

  return (
    <Tabs defaultValue="expense">
      <TabsList>
        <TabsTrigger value="expense">Expenses ({expenses.length})</TabsTrigger>
        <TabsTrigger value="income">Income ({income.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="expense" className="max-h-96 overflow-y-auto no-scrollbar">
        {expenses.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No expenses recorded yet.</p>
        ) : (
          expenses.map((t) => <TransactionRow key={t.id} transaction={t} />)
        )}
      </TabsContent>
      <TabsContent value="income" className="max-h-96 overflow-y-auto no-scrollbar">
        {income.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No income recorded yet.</p>
        ) : (
          income.map((t) => <TransactionRow key={t.id} transaction={t} />)
        )}
      </TabsContent>
    </Tabs>
  );
}
