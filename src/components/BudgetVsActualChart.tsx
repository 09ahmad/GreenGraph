import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";
import { Transaction, Category } from "@/types";

interface BudgetVsActualChartProps {
  transactions: Transaction[];
  categories: Category[];
}

function getCurrentMonthYear() {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}

export function BudgetVsActualChart({ transactions, categories }: BudgetVsActualChartProps) {
  const { month, year } = getCurrentMonthYear();
  const expenseCategories = categories.filter(c => c.type === "expense");

  const data = expenseCategories.map(category => {
    const actual = transactions
      .filter(t => t.category && typeof t.category === 'object' && t.category._id === category._id)
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      name: `${category.icon || ''} ${category.name}`,
      budget: category.budget || 0,
      actual,
      over: (category.budget || 0) > 0 && actual > (category.budget || 0),
    };
  });

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          No budget data available. Add budgets to your categories!
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Budget vs Actual Spending (This Month)</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v}`} />
          <Tooltip formatter={v => `$${v}`} />
          <Legend />
          <Bar dataKey="budget" fill="#6366f1" name="Budget" />
          <Bar dataKey="actual" fill="#ef4444" name="Actual">
            <LabelList dataKey="actual" position="top" formatter={v => v > 0 ? `$${v}` : ''} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
} 