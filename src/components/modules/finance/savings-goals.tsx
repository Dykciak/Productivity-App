"use client";

import { useState, useTransition } from "react";
import { Laptop, PiggyBank, Plane, ShieldCheck, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { SavingsGoal } from "@/lib/types";
import { contributeToSavingsGoal, deleteSavingsGoal } from "@/lib/actions/finance";
import { SavingsGoalFormDialog } from "@/components/modules/finance/savings-goal-form-dialog";

const ICONS: Record<string, typeof PiggyBank> = { Plane, ShieldCheck, Laptop, PiggyBank };

function SavingsGoalRow({ goal }: { goal: SavingsGoal }) {
  const [amount, setAmount] = useState("");
  const [isPending, startTransition] = useTransition();
  const Icon = ICONS[goal.icon] ?? PiggyBank;
  const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  function handleContribute(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value) return;
    setAmount("");
    startTransition(() => contributeToSavingsGoal(goal.id, value));
  }

  return (
    <div className="group rounded-lg border border-border p-3">
      <div className="mb-1.5 flex items-start justify-between gap-2 text-xs">
        <span className="flex min-w-0 items-center gap-1.5 font-medium text-foreground">
          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{goal.name}</span>
        </span>
        <button
          onClick={() => deleteSavingsGoal(goal.id)}
          className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          aria-label={`Delete goal ${goal.name}`}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      <p className="mb-1.5 text-xs tabular-nums text-muted-foreground">
        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
      </p>
      <Progress value={pct} className="h-1.5" />
      <form onSubmit={handleContribute} className="mt-2 flex gap-1.5">
        <Input
          type="number"
          inputMode="decimal"
          placeholder="Add funds"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-7 text-xs"
        />
        <Button type="submit" size="sm" variant="outline" className="h-7 shrink-0 text-xs" disabled={isPending || !amount}>
          Add
        </Button>
      </form>
    </div>
  );
}

export function SavingsGoals({ goals }: { goals: SavingsGoal[] }) {
  return (
    <div className="space-y-2.5">
      <div className="flex justify-end">
        <SavingsGoalFormDialog />
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {goals.length === 0 ? (
          <p className="text-sm text-muted-foreground sm:col-span-3">No savings goals yet.</p>
        ) : (
          goals.map((g) => <SavingsGoalRow key={g.id} goal={g} />)
        )}
      </div>
    </div>
  );
}
