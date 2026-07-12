import { Sparkles } from "lucide-react";
import type { Task } from "@/lib/types";

export function OneThingCard({ task }: { task: Task | null }) {
  if (!task) {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground/80">
          <Sparkles className="h-3.5 w-3.5" /> One Thing
        </span>
        <p className="text-sm text-primary-foreground/70">
          Mark a task as your One Thing to highlight it here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
        <Sparkles className="h-3.5 w-3.5" /> One Thing Today
      </span>
      <p className="text-xl font-semibold leading-snug text-primary-foreground sm:text-2xl">
        {task.title}
      </p>
      {task.notes && (
        <p className="text-sm text-primary-foreground/75">{task.notes}</p>
      )}
    </div>
  );
}
