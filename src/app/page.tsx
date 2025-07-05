import { TransactionPage } from "@/components/TransactionPage";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center px-2 py-6">
      <TransactionPage />
    </main>
  );
}
