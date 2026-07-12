"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";
import type { BookStatus } from "@/lib/types";

function revalidateAll() {
  revalidatePath("/", "layout");
}

export async function createBook(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const status = String(formData.get("status") ?? "WANT_TO_READ") as BookStatus;
  const cover = formData.get("cover") as File | null;

  if (!title || !author) return;

  const coverUrl = await saveUploadedFile(cover);

  await prisma.book.create({
    data: { title, author, status, coverUrl },
  });
  revalidateAll();
}

export async function updateBookStatus(id: string, status: BookStatus) {
  await prisma.book.update({ where: { id }, data: { status } });
  revalidateAll();
}

export async function deleteBook(id: string) {
  await prisma.book.delete({ where: { id } });
  revalidateAll();
}
