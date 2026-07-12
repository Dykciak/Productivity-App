"use client";

import { useRef, useState, useTransition } from "react";
import { Flame, Plus, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createTask } from "@/lib/actions/tasks";
import type { Timeframe } from "@/lib/types";

export function AddTaskForm({ timeframe }: { timeframe: Timeframe }) {
  const [value, setValue] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const title = value.trim();
    if (!title) return;
    setValue("");
    startTransition(async () => {
      await createTask({ title, timeframe, isUrgent, isImportant });
      setIsUrgent(false);
      setIsImportant(false);
      inputRef.current?.focus();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a task..."
          className="h-9"
          disabled={isPending}
        />
        <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={isPending || !value.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => setIsUrgent((v) => !v)}
          className={cn(
            "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors",
            isUrgent
              ? "border-destructive/40 bg-destructive/15 text-destructive"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <Flame className="h-3 w-3" /> Urgent
        </button>
        <button
          type="button"
          onClick={() => setIsImportant((v) => !v)}
          className={cn(
            "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors",
            isImportant
              ? "border-primary/40 bg-primary/15 text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <Star className="h-3 w-3" /> Important
        </button>
      </div>
    </form>
  );
}
