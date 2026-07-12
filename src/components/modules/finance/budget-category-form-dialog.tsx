"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBudgetCategory } from "@/lib/actions/finance";

export function BudgetCategoryFormDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(limit);
    if (!name.trim() || !value || value <= 0) return;
    startTransition(async () => {
      await createBudgetCategory(name, value);
      setName("");
      setLimit("");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" /> Add budget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New budget category</DialogTitle>
          <DialogDescription>Set a monthly spending limit to track against.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="budget-name">Category name</Label>
            <Input
              id="budget-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Subscriptions"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="budget-limit">Monthly limit</Label>
            <div className="relative">
              <Input
                id="budget-limit"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="0.00"
                className="pr-11"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                PLN
              </span>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending || !name.trim() || !limit}>
            Create budget
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
