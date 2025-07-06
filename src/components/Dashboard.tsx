"use client";

import { Card } from "@/components/ui/card";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { Transaction, Category } from "@/types";

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
}

function formatMoney(amount: number) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

export function Dashboard({ transactions, categories }: DashboardProps) {
  const expenses = transactions.filter(t => t.category && typeof t.category === 'object' && t.category.type === 'expense');
  const income = transactions.filter(t => t.category && typeof t.category === 'object' && t.category.type === 'income');
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const totalTransactions = transactions.length;
  const months = 12;
  const monthlyAvgIncome = totalIncome / months;
  const monthlyAvgExpense = totalExpenses / months;
  const thisMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="w-full min-h-screen bg-background text-white font-mono pt-12 px-2 sm:px-0">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <Card className="bg-[#181818] border border-[#333] p-8 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">↗️</span>
            <span className="text-2xl font-bold">{formatMoney(totalIncome)}</span>
          </div>
          <div className="text-base opacity-80">Total Income</div>
          <div className="text-sm opacity-60">Monthly average: {formatMoney(monthlyAvgIncome)}</div>
        </Card>
        <Card className="bg-[#181818] border border-[#333] p-8 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">↘️</span>
            <span className="text-2xl font-bold">{formatMoney(totalExpenses)}</span>
          </div>
          <div className="text-base opacity-80">Total Expenses</div>
          <div className="text-sm opacity-60">Monthly average: {formatMoney(monthlyAvgExpense)}</div>
        </Card>
        <Card className="bg-[#181818] border border-[#333] p-8 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💲</span>
            <span className="text-2xl font-bold">{formatMoney(balance)}</span>
          </div>
          <div className="text-base opacity-80">Net Balance</div>
          <div className="text-sm opacity-60">Available balance</div>
        </Card>
        <Card className="bg-[#181818] border border-[#333] p-8 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📈</span>
            <span className="text-2xl font-bold">{totalTransactions}</span>
          </div>
          <div className="text-base opacity-80">Transactions</div>
          <div className="text-sm opacity-60">This month: {thisMonthTransactions}</div>
        </Card>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <Card className="bg-[#232323] border border-[#333] p-8 flex flex-col items-center justify-center min-h-[320px] w-full overflow-x-auto">
          <div className="w-full">
            <MonthlyExpensesChart transactions={transactions} />
          </div>
        </Card>
        <Card className="bg-[#232323] border border-[#333] p-8 flex flex-col items-center justify-center min-h-[320px] w-full overflow-x-auto">
          <div className="w-full">
            <CategoryPieChart transactions={transactions} />
          </div>
        </Card>
      </div>
    </div>
  );
} 