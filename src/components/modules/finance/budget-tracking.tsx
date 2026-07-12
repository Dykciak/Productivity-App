"use client";

import { Car, Clapperboard, ShoppingCart, Trash2, UtensilsCrossed, Wallet } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency } from "@/lib/utils";
import type { BudgetCategory, Transaction } from "@/lib/types";
import { deleteBudgetCategory } from "@/lib/actions/finance";
import { BudgetCategoryFormDialog } from "@/components/modules/finance/budget-category-form-dialog";

const ICONS: Record<string, typeof Wallet> = {
  ShoppingCart,
  Clapperboard,
  Car,
  UtensilsCrossed,
  Wallet,
};

export function BudgetTracking({
  categories,
  transactions,
}: {
  categories: BudgetCategory[];
  transactions: Transaction[];
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <BudgetCategoryFormDialog />
      </div>
      {categories.length === 0 && (
        <p className="text-sm text-muted-foreground">No budget categories yet.</p>
      )}
      {categories.map((cat) => {
        const spent = transactions
          .filter((t) => t.type === "EXPENSE" && t.category === cat.name)
          .reduce((sum, t) => sum + t.amount, 0);
        const pct = Math.min(100, Math.round((spent / cat.monthlyLimit) * 100));
        const Icon = ICONS[cat.icon] ?? Wallet;
        const isOver = spent > cat.monthlyLimit;

        return (
          <div key={cat.id} className="group">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" /> {cat.name}
              </span>
              <span className="flex items-center gap-2">
                <span className={cn("tabular-nums text-muted-foreground", isOver && "text-destructive")}>
                  {formatCurrency(spent)} / {formatCurrency(cat.monthlyLimit)}
                </span>
                <button
                  onClick={() => deleteBudgetCategory(cat.id)}
                  className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  aria-label={`Delete budget ${cat.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            </div>
            <Progress value={pct} className="h-1.5" indicatorClassName={isOver ? "bg-destructive" : undefined} />
          </div>
        );
      })}
    </div>
  );
}
