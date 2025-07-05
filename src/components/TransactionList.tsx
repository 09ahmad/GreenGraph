"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface Transaction {
  _id: string;
  amount: number;
  description?: string;
  date: string;
}

export function TransactionList({ onEdit, transactions, onRefresh, refreshKey }: any) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (id:any) => {
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
        // Refresh the parent component's data
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast({ title: "Failed to delete transaction", variant: "destructive" });
      }
    } catch (err) {
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
      {transactions.map((transaction) => (
        <Card key={transaction._id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xl font-bold text-green-600">
                ${transaction.amount.toFixed(2)}
              </div>
              <div className="text-gray-600">
                {transaction.description || "No description"}
              </div>
              <div className="text-sm text-gray-400">
                {new Date(transaction.date).toLocaleDateString()}
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