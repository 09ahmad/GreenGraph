"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Transaction } from "@/types";

interface ChartData {
  month: string;
  total: number;
}

export function MonthlyExpensesChart({ transactions }: { transactions: Transaction[] }) {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const monthlyData = processTransactions(transactions);
      setChartData(monthlyData);
    } else {
      setChartData([]);
    }
  }, [transactions]);

  const processTransactions = (transactions: Transaction[]): ChartData[] => {
    const monthlyTotals: Record<string, number> = {};
    
    transactions.forEach((transaction: Transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] += transaction.amount;
      } else {
        monthlyTotals[monthKey] = transaction.amount;
      }
    });

    return Object.keys(monthlyTotals).map(month => ({
      month: month,
      total: monthlyTotals[month]
    }));
  };

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          No data available for chart. Add some transactions first!
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Expenses Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value) => [`$${value}`, 'Total']}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Bar 
            dataKey="total" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
} 