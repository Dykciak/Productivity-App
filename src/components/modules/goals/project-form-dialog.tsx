"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createProject, updateProject } from "@/lib/actions/goals";
import type { Project, ProjectCategory } from "@/lib/types";

export function ProjectFormDialog({
  project,
  category = "general",
}: {
  project?: Project;
  category?: ProjectCategory;
}) {
  const isEdit = !!project;
  const isLearning = category === "learning";
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    startTransition(async () => {
      if (isEdit) {
        await updateProject(project.id, title, description);
      } else {
        await createProject(title, description, category);
        setTitle("");
        setDescription("");
      }
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100"
            aria-label={isLearning ? "Edit module" : "Edit project"}
            onClick={(e) => e.stopPropagation()}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" /> {isLearning ? "New module" : "New project"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? (isLearning ? "Edit module" : "Edit project") : isLearning ? "New module" : "New project"}
          </DialogTitle>
          <DialogDescription>
            {isLearning
              ? "A month or topic block in your learning plan."
              : "A goal you're working toward over time."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="project-title">Title</Label>
            <Input
              id="project-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isLearning ? "e.g. Month 13: Advanced topics" : "e.g. Learn Spanish to B2 level"}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="project-description">Description (optional)</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does success look like?"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending || !title.trim()}>
            {isEdit ? "Save changes" : isLearning ? "Create module" : "Create project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
