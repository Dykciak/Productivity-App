"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function saveJournalEntry(input: {
  grateful: string;
  wentWell: string;
  couldImprove: string;
  rating: number;
}) {
  const date = startOfDay(new Date());
  await prisma.journalEntry.upsert({
    where: { date },
    update: input,
    create: { date, ...input },
  });
  revalidatePath("/", "layout");
}
