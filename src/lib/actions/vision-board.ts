"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";

function revalidateAll() {
  revalidatePath("/", "layout");
}

export async function uploadVisionImage(formData: FormData) {
  const caption = String(formData.get("caption") ?? "").trim();
  const image = formData.get("image") as File | null;

  const url = await saveUploadedFile(image);
  if (!url) return;

  await prisma.visionImage.create({ data: { url, caption: caption || null } });
  revalidateAll();
}

export async function deleteVisionImage(id: string) {
  await prisma.visionImage.delete({ where: { id } });
  revalidateAll();
}
