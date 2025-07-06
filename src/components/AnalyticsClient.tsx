"use client";

import { CategoryPieChart } from "@/components/CategoryPieChart";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { BudgetVsActualChart } from "@/components/BudgetVsActualChart";
import { Card } from "@/components/ui/card";
import { Transaction, Category } from "@/types";

interface AnalyticsClientProps {
  transactions: Transaction[];
  categories: Category[];
}

export function AnalyticsClient({ transactions, categories }: AnalyticsClientProps) {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const expenseCategories = categories.filter(c => c.type === "expense");
  const categoryStats = expenseCategories.map(category => {
    const actual = transactions
      .filter(t => t.category && typeof t.category === 'object' && t.category._id === category._id)
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      ...category,
      actual,
      remaining: (category.budget || 0) - actual,
      over: (category.budget || 0) > 0 && actual > (category.budget || 0),
    };
  });
  const overBudget = categoryStats.filter(c => c.over);
  const underBudget = categoryStats.filter(c => (c.budget || 0) > 0 && !c.over);
  const highestSpending = categoryStats.reduce((max, c) => c.actual > (max?.actual || 0) ? c : max, null as any);

  return (
    <div className="w-full flex flex-col gap-8 items-center justify-center py-8">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="bg-[#232323] border border-[#333] p-8 flex flex-col items-center justify-center min-h-[320px]">
          <div className="w-full">
            <CategoryPieChart transactions={transactions} />
          </div>
        </Card>
        <Card className="bg-[#232323] border border-[#333] p-8 flex flex-col items-center justify-center min-h-[320px]">
          <div className="w-full">
            <MonthlyExpensesChart transactions={transactions} />
          </div>
        </Card>
      </div>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 gap-6 mb-12">
        <BudgetVsActualChart transactions={transactions} categories={categories} />
      </div>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="bg-[#232323] border border-[#333] p-8 flex flex-col gap-4 shadow-lg rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            
            <h3 className="text-xl font-bold tracking-tight">Spending Insights</h3>
          </div>
          {overBudget.length > 0 ? (
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-red-400">Over budget</span>
              </div>
              <ul className="space-y-1">
                {overBudget.map(c => (
                  <li key={c._id} className="flex items-center gap-2 bg-red-900/40 rounded px-2 py-1">
                    <span className="text-lg">{c.icon}</span>
                    <span className="font-medium">{c.name}:</span>
                    <span className="text-red-300 font-mono">${c.actual} / ${c.budget}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : <div className="mb-2 text-green-400 flex items-center gap-2"> No categories are over budget.</div>}
          {underBudget.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-green-400">Under budget</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <ul className="space-y-1">
                {underBudget.map(c => (
                  <li key={c._id} className="flex items-center gap-2 bg-green-900/30 rounded px-2 py-1">
                    <span className="text-lg">{c.icon}</span>
                    <span className="font-medium">{c.name}:</span>
                    <span className="text-green-300 font-mono">${c.actual} / ${c.budget}</span>
                    <span className="ml-auto text-xs text-green-200">left: ${c.remaining}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {highestSpending && (
            <div className="flex items-center gap-2 mt-2 bg-blue-900/30 rounded px-2 py-2">
              <span className="font-semibold text-blue-300">Highest spending:</span>
              <span className="text-lg">{highestSpending.icon}</span>
              <span className="font-medium">{highestSpending.name}</span>
              <span className="ml-auto text-blue-200 font-mono">${highestSpending.actual}</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 