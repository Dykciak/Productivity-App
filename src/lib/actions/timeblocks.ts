"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function scheduleTask(taskId: string, startHour: number) {
  await prisma.timeBlock.upsert({
    where: { taskId },
    update: { startHour },
    create: { taskId, startHour, durationHours: 1 },
  });
  revalidatePath("/");
}

export async function unscheduleTask(taskId: string) {
  await prisma.timeBlock.deleteMany({ where: { taskId } });
  revalidatePath("/");
}
