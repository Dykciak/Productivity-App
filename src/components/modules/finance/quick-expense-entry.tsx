"use client";

import { useEffect, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTransaction } from "@/lib/actions/finance";
import type { BudgetCategory, IncomeCategory, TransactionType } from "@/lib/types";

export function QuickExpenseEntry({
  budgetCategories,
  incomeCategories,
}: {
  budgetCategories: BudgetCategory[];
  incomeCategories: IncomeCategory[];
}) {
  const expenseOptions = budgetCategories.length > 0 ? budgetCategories.map((c) => c.name) : ["Other"];
  const incomeOptions = incomeCategories.length > 0 ? incomeCategories.map((c) => c.name) : ["Other"];

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [category, setCategory] = useState(expenseOptions[0]);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const categoryOptions = type === "EXPENSE" ? expenseOptions : incomeOptions;

  // Keep the selected category valid whenever the active list changes (type switch or list edited elsewhere).
  useEffect(() => {
    if (!categoryOptions.includes(category)) {
      setCategory(categoryOptions[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, categoryOptions.join("|")]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    startTransition(async () => {
      await createTransaction({ amount: value, type, category, note: note || undefined });
      setAmount("");
      setNote("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-1.5">
        <Button
          type="button"
          size="sm"
          variant={type === "EXPENSE" ? "default" : "outline"}
          className="h-8 flex-1 text-xs"
          onClick={() => setType("EXPENSE")}
        >
          Expense
        </Button>
        <Button
          type="button"
          size="sm"
          variant={type === "INCOME" ? "default" : "outline"}
          className="h-8 flex-1 text-xs"
          onClick={() => setType("INCOME")}
        >
          Income
        </Button>
      </div>
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-9 pr-11"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            PLN
          </span>
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-9 w-36 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-1.5">
        <Input
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="h-9"
        />
        <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={isPending || !amount}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
