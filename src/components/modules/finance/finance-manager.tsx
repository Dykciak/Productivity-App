import { History, PiggyBank, PlusCircle, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickExpenseEntry } from "@/components/modules/finance/quick-expense-entry";
import { MonthlyOverview } from "@/components/modules/finance/monthly-overview";
import { BudgetTracking } from "@/components/modules/finance/budget-tracking";
import { SavingsGoals } from "@/components/modules/finance/savings-goals";
import { TransactionHistory } from "@/components/modules/finance/transaction-history";
import type { BudgetCategory, SavingsGoal, Transaction } from "@/lib/types";

export function FinanceManager({
  transactions,
  allTransactions,
  budgetCategories,
  savingsGoals,
}: {
  transactions: Transaction[];
  allTransactions: Transaction[];
  budgetCategories: BudgetCategory[];
  savingsGoals: SavingsGoal[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bento-cell">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <PlusCircle className="h-4 w-4 text-primary" />
            <CardTitle>Quick entry</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickExpenseEntry budgetCategories={budgetCategories} />
          </CardContent>
        </Card>

        <Card className="bento-cell">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <TrendingUp className="h-4 w-4 text-primary" />
            <CardTitle>This month</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyOverview transactions={transactions} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bento-cell">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Wallet className="h-4 w-4 text-primary" />
            <CardTitle>Budgets</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetTracking categories={budgetCategories} transactions={transactions} />
          </CardContent>
        </Card>

        <Card className="bento-cell">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <PiggyBank className="h-4 w-4 text-primary" />
            <CardTitle>Savings goals</CardTitle>
          </CardHeader>
          <CardContent>
            <SavingsGoals goals={savingsGoals} />
          </CardContent>
        </Card>
      </div>

      <Card className="bento-cell">
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <History className="h-4 w-4 text-primary" />
          <CardTitle>Income &amp; expense history</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionHistory transactions={allTransactions} />
        </CardContent>
      </Card>
    </div>
  );
}
