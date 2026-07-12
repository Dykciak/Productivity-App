"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function revalidateAll() {
  revalidatePath("/", "layout");
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function toggleHabitEntry(habitId: string, date: Date) {
  const day = startOfDay(date);
  const existing = await prisma.habitEntry.findUnique({
    where: { habitId_date: { habitId, date: day } },
  });

  if (existing) {
    await prisma.habitEntry.update({
      where: { id: existing.id },
      data: { completed: !existing.completed },
    });
  } else {
    await prisma.habitEntry.create({
      data: { habitId, date: day, completed: true },
    });
  }
  revalidateAll();
}

export async function createHabit(name: string, icon: string, color: string = "primary") {
  if (!name.trim()) return;
  await prisma.habitDef.create({ data: { name: name.trim(), icon, color } });
  revalidateAll();
}

export async function deleteHabit(habitId: string) {
  await prisma.habitDef.delete({ where: { id: habitId } });
  revalidateAll();
}
