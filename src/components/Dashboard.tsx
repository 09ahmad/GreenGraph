"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { BudgetVsActualChart } from "@/components/BudgetVsActualChart";
import { Transaction, Category } from "@/types";
import { TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";

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

  const StatCard = ({ icon: Icon, title, value, subtitle, trend }: any) => (
    <Card className="hover:shadow-xl transition-smooth">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={`p-2.5 rounded-lg ${trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
            <Icon className={`w-5 h-5 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full min-h-screen bg-background pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your financial overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={TrendingUp}
            title="Total Income"
            value={formatMoney(totalIncome)}
            subtitle={`Monthly avg: ${formatMoney(monthlyAvgIncome)}`}
            trend="up"
          />
          <StatCard
            icon={TrendingDown}
            title="Total Expenses"
            value={formatMoney(totalExpenses)}
            subtitle={`Monthly avg: ${formatMoney(monthlyAvgExpense)}`}
            trend="down"
          />
          <StatCard
            icon={Wallet}
            title="Net Balance"
            value={formatMoney(balance)}
            subtitle={balance >= 0 ? "Positive balance" : "Negative balance"}
            trend={balance >= 0 ? "up" : "down"}
          />
          <StatCard
            icon={Activity}
            title="Transactions"
            value={totalTransactions}
            subtitle={`This month: ${thisMonthTransactions}`}
            trend="up"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>Your spending trend over months</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyExpensesChart transactions={transactions} />
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryPieChart transactions={transactions} />
            </CardContent>
          </Card>
        </div>

        {/* Budget Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Budget vs Actual</CardTitle>
            <CardDescription>How you're spending compared to your budget</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetVsActualChart transactions={transactions} categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
 