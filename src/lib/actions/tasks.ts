"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Timeframe } from "@/lib/types";

function revalidateAll() {
  revalidatePath("/", "layout");
}

export async function createTask(input: {
  title: string;
  timeframe: Timeframe;
  isUrgent?: boolean;
  isImportant?: boolean;
}) {
  if (!input.title.trim()) return;
  await prisma.task.create({
    data: {
      title: input.title.trim(),
      timeframe: input.timeframe,
      isUrgent: input.isUrgent ?? false,
      isImportant: input.isImportant ?? false,
    },
  });
  revalidateAll();
}

export async function toggleTaskCompleted(taskId: string, completed: boolean) {
  await prisma.task.update({
    where: { id: taskId },
    data: { completed, completedAt: completed ? new Date() : null },
  });
  revalidateAll();
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({ where: { id: taskId } });
  revalidateAll();
}

export async function setPriority(taskId: string, isUrgent: boolean, isImportant: boolean) {
  await prisma.task.update({ where: { id: taskId }, data: { isUrgent, isImportant } });
  revalidateAll();
}

export async function moveTaskTimeframe(taskId: string, timeframe: Timeframe) {
  await prisma.task.update({ where: { id: taskId }, data: { timeframe } });
  revalidateAll();
}

export async function setOneThing(taskId: string) {
  await prisma.$transaction([
    prisma.task.updateMany({ data: { isOneThing: false }, where: { isOneThing: true } }),
    prisma.task.update({ where: { id: taskId }, data: { isOneThing: true } }),
  ]);
  revalidateAll();
}
