import { Wallet } from "lucide-react";
import { FinanceManager } from "@/components/modules/finance/finance-manager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default async function FinancePage() {
  const monthStart = startOfMonth(new Date());

  const [transactions, allTransactions, budgetCategories, incomeCategories, savingsGoals] = await Promise.all([
    prisma.transaction.findMany({ where: { date: { gte: monthStart } }, orderBy: { date: "desc" } }),
    prisma.transaction.findMany({ orderBy: { date: "desc" }, take: 300 }),
    prisma.budgetCategory.findMany(),
    prisma.incomeCategory.findMany(),
    prisma.savingsGoal.findMany(),
  ]);

  return (
    <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Wallet className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Finance Manager</h1>
          <p className="text-sm text-muted-foreground">Track spending, budgets, and savings goals.</p>
        </div>
      </div>

      <FinanceManager
        transactions={transactions}
        allTransactions={allTransactions}
        budgetCategories={budgetCategories}
        incomeCategories={incomeCategories}
        savingsGoals={savingsGoals}
      />
    </main>
  );
}
