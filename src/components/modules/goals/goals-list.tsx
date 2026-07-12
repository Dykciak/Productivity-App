"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ProjectCategory, ProjectWithSubtasks } from "@/lib/types";
import { toggleSubtask, createSubtask, deleteSubtask, deleteProject } from "@/lib/actions/goals";
import { ProjectFormDialog } from "@/components/modules/goals/project-form-dialog";
import { cn } from "@/lib/utils";

function ProjectCard({ project }: { project: ProjectWithSubtasks }) {
  const [expanded, setExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [isPending, startTransition] = useTransition();

  const total = project.subtasks.length;
  const done = project.subtasks.filter((s) => s.completed).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  function handleAddSubtask(e: React.FormEvent) {
    e.preventDefault();
    const title = newSubtask.trim();
    if (!title) return;
    setNewSubtask("");
    startTransition(() => createSubtask(project.id, title));
  }

  return (
    <div className="group rounded-lg border border-border p-3">
      <div className="flex items-center gap-2">
        <button
          className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left"
          onClick={() => setExpanded((v) => !v)}
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{project.title}</p>
            {project.description && (
              <p className="truncate text-xs text-muted-foreground">{project.description}</p>
            )}
          </div>
          <span className="shrink-0 text-xs font-semibold tabular-nums text-primary">{pct}%</span>
        </button>
        <ProjectFormDialog project={project} />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
          aria-label={`Delete project ${project.title}`}
          onClick={() => deleteProject(project.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <Progress value={pct} className="mt-2 h-1.5" />

      {expanded && (
        <div className="mt-3 space-y-1.5">
          {project.subtasks.map((s) => (
            <div key={s.id} className="group/subtask flex items-center gap-2 text-xs">
              <Checkbox
                checked={s.completed}
                onCheckedChange={(checked) => toggleSubtask(s.id, checked === true)}
                className="h-4 w-4"
              />
              <span className={cn("flex-1", s.completed && "text-muted-foreground line-through")}>
                {s.title}
              </span>
              <button
                onClick={() => deleteSubtask(s.id)}
                className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover/subtask:opacity-100"
                aria-label={`Delete sub-task ${s.title}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          <form onSubmit={handleAddSubtask} className="flex gap-1.5 pt-1">
            <Input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add sub-task..."
              className="h-7 text-xs"
              disabled={isPending}
            />
            <Button type="submit" size="icon" variant="outline" className="h-7 w-7 shrink-0">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export function GoalsList({
  projects,
  category = "general",
  constrainHeight = true,
}: {
  projects: ProjectWithSubtasks[];
  category?: ProjectCategory;
  constrainHeight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <ProjectFormDialog category={category} />
      </div>
      <div
        className={cn(
          "flex flex-col gap-2.5",
          constrainHeight && "max-h-72 overflow-y-auto no-scrollbar"
        )}
      >
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing here yet.</p>
        ) : (
          projects.map((p) => <ProjectCard key={p.id} project={p} />)
        )}
      </div>
    </div>
  );
}
