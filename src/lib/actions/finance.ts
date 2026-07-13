"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { TransactionType } from "@/lib/types";

function revalidateAll() {
  revalidatePath("/", "layout");
}

export async function createTransaction(input: {
  amount: number;
  type: TransactionType;
  category: string;
  note?: string;
}) {
  if (!input.amount || input.amount <= 0 || !input.category.trim()) return;
  await prisma.transaction.create({
    data: {
      amount: input.amount,
      type: input.type,
      category: input.category.trim(),
      note: input.note?.trim() || null,
    },
  });
  revalidateAll();
}

export async function deleteTransaction(id: string) {
  await prisma.transaction.delete({ where: { id } });
  revalidateAll();
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfNextMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export async function clearMonthTransactions() {
  const now = new Date();
  await prisma.transaction.deleteMany({
    where: { date: { gte: startOfMonth(now), lt: startOfNextMonth(now) } },
  });
  revalidateAll();
}

export async function createBudgetCategory(name: string, monthlyLimit: number) {
  if (!name.trim() || monthlyLimit <= 0) return;
  await prisma.budgetCategory.create({ data: { name: name.trim(), monthlyLimit } });
  revalidateAll();
}

export async function deleteBudgetCategory(id: string) {
  await prisma.budgetCategory.delete({ where: { id } });
  revalidateAll();
}

export async function createIncomeCategory(name: string) {
  if (!name.trim()) return;
  await prisma.incomeCategory.create({ data: { name: name.trim() } });
  revalidateAll();
}

export async function deleteIncomeCategory(id: string) {
  await prisma.incomeCategory.delete({ where: { id } });
  revalidateAll();
}

export async function createSavingsGoal(name: string, targetAmount: number) {
  if (!name.trim() || targetAmount <= 0) return;
  await prisma.savingsGoal.create({ data: { name: name.trim(), targetAmount } });
  revalidateAll();
}

export async function deleteSavingsGoal(id: string) {
  await prisma.savingsGoal.delete({ where: { id } });
  revalidateAll();
}

export async function contributeToSavingsGoal(id: string, amount: number) {
  if (!amount) return;
  await prisma.savingsGoal.update({
    where: { id },
    data: { currentAmount: { increment: amount } },
  });
  revalidateAll();
}
