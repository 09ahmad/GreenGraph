import { getTransactions, getCategories } from "@/lib/api";
import { AnalyticsClient } from "@/components/AnalyticsClient";

export default async function Analytics() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories()
  ]);

  return <AnalyticsClient transactions={transactions} categories={categories} />;
} 