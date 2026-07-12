"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskItem } from "@/components/modules/todo/task-item";
import { AddTaskForm } from "@/components/modules/todo/add-task-form";
import { EisenhowerMatrix } from "@/components/modules/todo/eisenhower-matrix";
import type { TaskWithTimeBlock, Timeframe } from "@/lib/types";

const TIMEFRAME_TABS: { value: Timeframe; label: string }[] = [
  { value: "TODAY", label: "Today" },
  { value: "WEEK", label: "This week" },
  { value: "SOMEDAY", label: "Someday" },
];

export function TodoList({ tasks }: { tasks: TaskWithTimeBlock[] }) {
  const [tab, setTab] = useState<string>("TODAY");

  const grouped = useMemo(() => {
    const groups: Record<Timeframe, TaskWithTimeBlock[]> = { TODAY: [], WEEK: [], SOMEDAY: [] };
    for (const t of tasks) groups[t.timeframe as Timeframe].push(t);
    for (const key of Object.keys(groups) as Timeframe[]) {
      groups[key].sort((a, b) => Number(a.completed) - Number(b.completed));
    }
    return groups;
  }, [tasks]);

  const activeTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);

  return (
    <Tabs value={tab} onValueChange={setTab} className="flex h-full flex-col">
      <TabsList className="w-full justify-start overflow-x-auto no-scrollbar">
        {TIMEFRAME_TABS.map((t) => (
          <TabsTrigger key={t.value} value={t.value}>
            {t.label}
            <span className="ml-1 text-[10px] text-muted-foreground">{grouped[t.value].length}</span>
          </TabsTrigger>
        ))}
        <TabsTrigger value="MATRIX">Matrix</TabsTrigger>
      </TabsList>

      {TIMEFRAME_TABS.map((t) => (
        <TabsContent key={t.value} value={t.value} className="flex-1 space-y-2">
          <AddTaskForm timeframe={t.value} />
          <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto no-scrollbar">
            {grouped[t.value].length === 0 ? (
              <p className="px-2 py-4 text-sm text-muted-foreground">Nothing scheduled yet.</p>
            ) : (
              grouped[t.value].map((task) => <TaskItem key={task.id} task={task} />)
            )}
          </div>
        </TabsContent>
      ))}

      <TabsContent value="MATRIX" className="flex-1">
        <EisenhowerMatrix tasks={activeTasks} />
      </TabsContent>
    </Tabs>
  );
}
