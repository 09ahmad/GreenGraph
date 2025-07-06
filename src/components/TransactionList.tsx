"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types";

interface TransactionListProps {
  onEdit: (transaction: Transaction) => void;
  transactions: Transaction[];
  onRefresh: () => void;
}

export function TransactionList({ onEdit, transactions, onRefresh }: TransactionListProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/transactions/delete/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast({ title: "Transaction deleted successfully" });
        onRefresh();
      } else {
        toast({ title: "Failed to delete transaction", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error deleting transaction", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="text-center">Deleting transaction...</div>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-gray-500">No transactions found. Add your first transaction!</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction: Transaction) => (
        <Card key={transaction._id} className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {transaction.category && typeof transaction.category === 'object' 
                  ? transaction.category.icon || "📁" 
                  : "📁"}
              </div>
              <div>
                <div className={`text-xl font-bold ${
                  transaction.category && typeof transaction.category === 'object' && transaction.category.type === 'income' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  ${transaction.amount.toFixed(2)}
                </div>
                <div className="text-gray-600 text-sm">
                  {transaction.description || "No description"}
                </div>
                <div className="text-xs text-gray-400">
                  {transaction.category && typeof transaction.category === 'object' 
                    ? transaction.category.name 
                    : "Unknown Category"} • {new Date(transaction.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(transaction)}
              >
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDelete(transaction._id)}
                disabled={loading}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 