import type { TaskWithTimeBlock, EisenhowerQuadrants } from "@/lib/types";
import { TaskItem } from "@/components/modules/todo/task-item";

function bucketTasks(tasks: TaskWithTimeBlock[]): EisenhowerQuadrants {
  return {
    urgentImportant: tasks.filter((t) => t.isUrgent && t.isImportant),
    notUrgentImportant: tasks.filter((t) => !t.isUrgent && t.isImportant),
    urgentNotImportant: tasks.filter((t) => t.isUrgent && !t.isImportant),
    notUrgentNotImportant: tasks.filter((t) => !t.isUrgent && !t.isImportant),
  };
}

const QUADRANTS: {
  key: keyof EisenhowerQuadrants;
  label: string;
  hint: string;
  accent: string;
}[] = [
  { key: "urgentImportant", label: "Do first", hint: "Urgent & Important", accent: "border-destructive/40" },
  { key: "notUrgentImportant", label: "Schedule", hint: "Important, not urgent", accent: "border-primary/40" },
  { key: "urgentNotImportant", label: "Delegate", hint: "Urgent, not important", accent: "border-warning/40" },
  { key: "notUrgentNotImportant", label: "Eliminate", hint: "Neither", accent: "border-border" },
];

export function EisenhowerMatrix({ tasks }: { tasks: TaskWithTimeBlock[] }) {
  const quadrants = bucketTasks(tasks);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {QUADRANTS.map((q) => (
        <div key={q.key} className={`rounded-lg border ${q.accent} p-2`}>
          <div className="mb-1 flex items-baseline justify-between px-1">
            <span className="text-xs font-semibold text-foreground">{q.label}</span>
            <span className="text-[11px] text-muted-foreground">{q.hint}</span>
          </div>
          <div className="flex max-h-40 flex-col gap-0.5 overflow-y-auto no-scrollbar">
            {quadrants[q.key].length === 0 ? (
              <p className="px-1 py-2 text-xs text-muted-foreground">Nothing here</p>
            ) : (
              quadrants[q.key].map((t) => <TaskItem key={t.id} task={t} draggable={false} />)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
