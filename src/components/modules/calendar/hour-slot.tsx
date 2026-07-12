"use client";

import { useDroppable } from "@dnd-kit/core";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskWithTimeBlock } from "@/lib/types";
import { unscheduleTask } from "@/lib/actions/timeblocks";

function formatHour(hour: number) {
  const period = hour < 12 ? "AM" : "PM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display} ${period}`;
}

export function HourSlot({ hour, tasks }: { hour: number; tasks: TaskWithTimeBlock[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: `hour-${hour}`, data: { hour } });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[2.75rem] gap-3 border-t border-border/70 px-1 py-1 transition-colors first:border-t-0",
        isOver && "bg-primary/10"
      )}
    >
      <span className="w-14 shrink-0 pt-0.5 text-[11px] tabular-nums text-muted-foreground">
        {formatHour(hour)}
      </span>
      <div className="flex flex-1 flex-wrap items-start gap-1.5 py-0.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-center gap-1.5 rounded-md bg-primary/15 px-2 py-1 text-xs font-medium text-foreground"
          >
            <span className="max-w-[10rem] truncate">{task.title}</span>
            <button
              onClick={() => unscheduleTask(task.id)}
              className="opacity-0 transition-opacity group-hover:opacity-100"
              aria-label={`Remove ${task.title} from timeline`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
