export const dynamic = "force-dynamic";



import { Dashboard } from "@/components/Dashboard";
import { getTransactions, getCategories } from "@/lib/api";

export default async function Home() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories()
  ]);

  return <Dashboard transactions={transactions} categories={categories} />;
}


