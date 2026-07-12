"use client";

import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TodoList } from "@/components/modules/todo/todo-list";
import { Timeline } from "@/components/modules/calendar/timeline";
import { scheduleTask } from "@/lib/actions/timeblocks";
import type { TaskWithTimeBlock } from "@/lib/types";
import { ListTodo, CalendarClock } from "lucide-react";

export function PlannerBoard({ tasks }: { tasks: TaskWithTimeBlock[] }) {
  const [activeTask, setActiveTask] = useState<TaskWithTimeBlock | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveTask((event.active.data.current?.task as TaskWithTimeBlock) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const hour = over.data.current?.hour as number | undefined;
    if (hour === undefined) return;
    scheduleTask(active.id as string, hour);
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bento-cell">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <ListTodo className="h-4 w-4 text-primary" />
            <CardTitle>To-Do List</CardTitle>
          </CardHeader>
          <div className="px-5 pb-5">
            <TodoList tasks={tasks} />
          </div>
        </Card>

        <Card className="bento-cell">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <CalendarClock className="h-4 w-4 text-primary" />
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <div className="px-5 pb-5">
            <Timeline tasks={tasks} />
          </div>
        </Card>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rounded-md border border-primary/40 bg-card px-3 py-1.5 text-xs font-medium shadow-lg">
            {activeTask.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
