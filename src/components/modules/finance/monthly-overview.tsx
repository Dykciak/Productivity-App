"use client";

import { useState, useTransition } from "react";
import { ArrowDownRight, ArrowUpRight, RotateCcw } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { clearMonthTransactions } from "@/lib/actions/finance";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export function MonthlyOverview({ transactions }: { transactions: Transaction[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const income = transactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0);
  const net = income - expenses;

  function handleClear() {
    startTransition(async () => {
      await clearMonthTransactions();
      setOpen(false);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
              disabled={transactions.length === 0}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear this month&apos;s transactions?</DialogTitle>
              <DialogDescription>
                This permanently deletes all {transactions.length} income and expense entries recorded this
                month. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="destructive" size="sm" onClick={handleClear} disabled={isPending}>
                Clear month
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-success/10 p-3">
          <div className="flex items-center gap-1 text-xs text-success">
            <ArrowUpRight className="h-3.5 w-3.5" /> Income
          </div>
          <p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(income)}</p>
        </div>
        <div className="rounded-lg bg-destructive/10 p-3">
          <div className="flex items-center gap-1 text-xs text-destructive">
            <ArrowDownRight className="h-3.5 w-3.5" /> Expenses
          </div>
          <p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(expenses)}</p>
        </div>
        <div className="rounded-lg bg-muted p-3">
          <div className="text-xs text-muted-foreground">Net</div>
          <p className={cn("mt-1 text-lg font-semibold tabular-nums", net >= 0 ? "text-success" : "text-destructive")}>
            {formatCurrency(net)}
          </p>
        </div>
      </div>
    </div>
  );
}
