"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ProjectCategory } from "@/lib/types";

function revalidateAll() {
  revalidatePath("/", "layout");
}

export async function createProject(title: string, description?: string, category: ProjectCategory = "general") {
  if (!title.trim()) return;
  const order = await prisma.project.count({ where: { category } });
  await prisma.project.create({
    data: { title: title.trim(), description: description?.trim() || null, category, order },
  });
  revalidateAll();
}

export async function updateProject(projectId: string, title: string, description?: string) {
  if (!title.trim()) return;
  await prisma.project.update({
    where: { id: projectId },
    data: { title: title.trim(), description: description?.trim() || null },
  });
  revalidateAll();
}

export async function deleteProject(projectId: string) {
  await prisma.project.delete({ where: { id: projectId } });
  revalidateAll();
}

export async function createSubtask(projectId: string, title: string) {
  if (!title.trim()) return;
  const order = await prisma.subtask.count({ where: { projectId } });
  await prisma.subtask.create({ data: { projectId, title: title.trim(), order } });
  revalidateAll();
}

export async function toggleSubtask(subtaskId: string, completed: boolean) {
  await prisma.subtask.update({ where: { id: subtaskId }, data: { completed } });
  revalidateAll();
}

export async function deleteSubtask(subtaskId: string) {
  await prisma.subtask.delete({ where: { id: subtaskId } });
  revalidateAll();
}
