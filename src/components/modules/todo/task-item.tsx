"use client";

import { useDraggable } from "@dnd-kit/core";
import { Flame, GripVertical, Sparkles, Star, Timer, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TaskWithTimeBlock } from "@/lib/types";
import { toggleTaskCompleted, deleteTask, setOneThing, setPriority } from "@/lib/actions/tasks";
import { usePomodoroStore } from "@/store/pomodoro-store";

export function TaskItem({ task, draggable = true }: { task: TaskWithTimeBlock; draggable?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
    disabled: !draggable,
  });
  const linkTask = usePomodoroStore((s) => s.linkTask);
  const linkedTaskId = usePomodoroStore((s) => s.linkedTaskId);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group flex items-center gap-2 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-border hover:bg-muted/50",
        isDragging && "opacity-40",
        task.isOneThing && "bg-primary/5",
        linkedTaskId === task.id && "ring-1 ring-primary/40"
      )}
    >
      {draggable && (
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          aria-label="Drag to schedule"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => toggleTaskCompleted(task.id, checked === true)}
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
      />
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm text-foreground", task.completed && "text-muted-foreground line-through")}>
          {task.title}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => setPriority(task.id, !task.isUrgent, task.isImportant)}
          className={cn(
            "hidden h-7 w-7 items-center justify-center rounded-md transition-colors sm:flex",
            task.isUrgent ? "text-destructive" : "text-muted-foreground/40 hover:text-muted-foreground"
          )}
          title={task.isUrgent ? "Urgent — click to unmark" : "Mark as urgent"}
        >
          <Flame className={cn("h-3.5 w-3.5", task.isUrgent && "fill-destructive/20")} />
        </button>
        <button
          onClick={() => setPriority(task.id, task.isUrgent, !task.isImportant)}
          className={cn(
            "hidden h-7 w-7 items-center justify-center rounded-md transition-colors sm:flex",
            task.isImportant ? "text-primary" : "text-muted-foreground/40 hover:text-muted-foreground"
          )}
          title={task.isImportant ? "Important — click to unmark" : "Mark as important"}
        >
          <Star className={cn("h-3.5 w-3.5", task.isImportant && "fill-primary/20")} />
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100"
          title="Set as One Thing"
          onClick={() => setOneThing(task.id)}
        >
          <Sparkles className={cn("h-3.5 w-3.5", task.isOneThing && "fill-warning text-warning")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100"
          title="Start a Pomodoro on this task"
          onClick={() => linkTask(task.id, task.title)}
        >
          <Timer className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 text-destructive group-hover:opacity-100"
          title="Delete task"
          onClick={() => deleteTask(task.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
