export const dynamic = "force-dynamic";

// This file will be moved to src/app/dashboard/page.tsx. No code changes needed here, just move.

import { Dashboard } from "@/components/Dashboard";
import { getTransactions, getCategories } from "@/lib/api";

export default async function Home() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories()
  ]);

  return <Dashboard transactions={transactions} categories={categories} />;
}


