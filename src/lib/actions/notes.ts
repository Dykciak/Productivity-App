"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function revalidateAll() {
  revalidatePath("/", "layout");
}

export async function createNote() {
  const note = await prisma.note.create({ data: { title: "Untitled note", content: "" } });
  revalidateAll();
  return note;
}

export async function updateNote(id: string, input: { title?: string; content?: string }) {
  await prisma.note.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() || "Untitled note" } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
    },
  });
  revalidateAll();
}

export async function deleteNote(id: string) {
  await prisma.note.delete({ where: { id } });
  revalidateAll();
}
