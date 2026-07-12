"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function revalidateAll() {
  revalidatePath("/", "layout");
}

export async function createInboxNote(content: string) {
  if (!content.trim()) return;
  await prisma.inboxNote.create({ data: { content: content.trim() } });
  revalidateAll();
}

export async function resolveInboxNote(id: string) {
  await prisma.inboxNote.update({ where: { id }, data: { resolved: true } });
  revalidateAll();
}

export async function deleteInboxNote(id: string) {
  await prisma.inboxNote.delete({ where: { id } });
  revalidateAll();
}

export async function convertInboxNoteToTask(id: string) {
  const note = await prisma.inboxNote.findUnique({ where: { id } });
  if (!note) return;
  await prisma.$transaction([
    prisma.task.create({ data: { title: note.content, timeframe: "SOMEDAY" } }),
    prisma.inboxNote.update({ where: { id }, data: { resolved: true } }),
  ]);
  revalidateAll();
}
