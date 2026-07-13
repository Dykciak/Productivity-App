"use client";

import { TrendingUp, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { IncomeCategory, Transaction } from "@/lib/types";
import { deleteIncomeCategory } from "@/lib/actions/finance";
import { IncomeCategoryFormDialog } from "@/components/modules/finance/income-category-form-dialog";

export function IncomeCategories({
  categories,
  transactions,
}: {
  categories: IncomeCategory[];
  transactions: Transaction[];
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <IncomeCategoryFormDialog />
      </div>
      {categories.length === 0 && (
        <p className="text-sm text-muted-foreground">No income categories yet.</p>
      )}
      {categories.map((cat) => {
        const received = transactions
          .filter((t) => t.type === "INCOME" && t.category === cat.name)
          .reduce((sum, t) => sum + t.amount, 0);

        return (
          <div key={cat.id} className="group flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" /> {cat.name}
            </span>
            <span className="flex items-center gap-2">
              <span className="tabular-nums text-success">{formatCurrency(received)}</span>
              <button
                onClick={() => deleteIncomeCategory(cat.id)}
                className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                aria-label={`Delete income category ${cat.name}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          </div>
        );
      })}
    </div>
  );
}
