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
import { createIncomeCategory } from "@/lib/actions/finance";

export function IncomeCategoryFormDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    startTransition(async () => {
      await createIncomeCategory(name);
      setName("");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" /> Add category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New income category</DialogTitle>
          <DialogDescription>A source of income to log entries against.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="income-category-name">Category name</Label>
            <Input
              id="income-category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Freelance"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending || !name.trim()}>
            Create category
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
