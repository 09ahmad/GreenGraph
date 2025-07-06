"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Transaction } from "@/types";

interface ChartData {
  name: string;
  value: number;
  color: string;
  icon?: string;
}

const COLORS = [
  "#6366f1",
  "#f59e42",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#eab308",
  "#8b5cf6",
  "#f472b6",
  "#22d3ee",
  "#84cc16",
  "#f87171",
  "#a3e635",
];

export function CategoryPieChart({ transactions }: { transactions: Transaction[] }) {
  const processData = (): ChartData[] => {
    const categoryTotals: Record<string, { total: number; color: string; icon?: string }> = {};
    
    transactions.forEach((transaction) => {
      if (transaction.category && typeof transaction.category === 'object') {
        const categoryId = transaction.category._id;
        const categoryName = transaction.category.name;
        const categoryColor = transaction.category.color || "#888888";
        const categoryIcon = transaction.category.icon;
        
        if (categoryTotals[categoryId]) {
          categoryTotals[categoryId].total += transaction.amount;
        } else {
          categoryTotals[categoryId] = {
            total: transaction.amount,
            color: categoryColor,
            icon: categoryIcon
          };
        }
      }
    });

    return Object.entries(categoryTotals).map(([id, data]) => ({
      name: transactions.find(t => t.category && typeof t.category === 'object' && t.category._id === id)?.category.name || 'Unknown',
      value: data.total,
      color: data.color,
      icon: data.icon
    }));
  };

  const data = processData();

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          No category data available. Add some transactions first!
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : name}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            stroke="#232323"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
            contentStyle={{ fontSize: '0.85rem', background: '#232323', color: '#fff', border: '1px solid #333' }}
            itemStyle={{ fontSize: '0.85rem' }}
          />
          <Legend
            iconType="circle"
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: '0.85rem', color: '#fff', marginTop: 8 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <style jsx global>{`
        .recharts-legend-item-text { font-size: 0.85rem !important; }
        .recharts-default-legend { color: #fff !important; }
        .recharts-pie-label-text { font-size: 0.8rem !important; }
      `}</style>
    </Card>
  );
} 