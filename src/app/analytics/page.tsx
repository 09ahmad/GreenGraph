export const dynamic = "force-dynamic";

import { CategoryPieChart } from "@/components/CategoryPieChart";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { getTransactions } from "@/lib/api";

export default async function Analytics() {
  const transactions = await getTransactions();

  return (
    <div className="w-full flex flex-col gap-8 items-center justify-center py-8">
      <CategoryPieChart transactions={transactions} />
      <MonthlyExpensesChart transactions={transactions} />
    </div>
  );
} 