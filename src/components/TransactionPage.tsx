"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import { Card } from "@/components/ui/card";

interface TransactionCard {
  _id: string;
  amount: number;
  description?: string;
  date: string;
  category: {
    _id: string;
    name: string;
    icon?: string;
    color?: string;
    type: "expense" | "income";
  };
}

interface TransactionFormType {
  _id: string;
  amount: number;
  description?: string;
  date: string;
  category: string;
}

export function TransactionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionFormType | null>(null);
  const [transactions, setTransactions] = useState<TransactionCard[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions/getDetails");
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    fetchTransactions();
  };

  const handleEditClick = (transaction: TransactionCard) => {
    setEditingTransaction({
      _id: transaction._id,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
      category: transaction.category._id
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/transactions/delete/${id}`, { method: "DELETE" });
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center">
      {/* Add Transaction Button - top right */}
      <div className="w-full flex justify-end mt-4 mb-8">
        <Button
          onClick={handleAddClick}
          variant="outline"
          
        >
          Add Transaction
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogTitle className="sr-only">{editingTransaction ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
          <TransactionForm 
            onSuccess={handleFormSuccess} 
            transaction={editingTransaction}
          />
        </DialogContent>
      </Dialog>

      <div className="w-full flex flex-col gap-4 mt-8">
        {transactions.length === 0 ? (
          <div className="text-center text-white opacity-60">No transactions found. Add your first transaction!</div>
        ) : (
          transactions.map((transaction) => (
            <Card key={transaction._id} className="bg-[#181818] border border-[#333] p-6 flex flex-col gap-2 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{transaction.category?.icon || "📁"}</div>
                  <div>
                    <div className="text-xl font-bold text-white">${transaction.amount.toFixed(2)}</div>
                    <div className="text-white text-sm opacity-80">
                      {transaction.description || "No description"}
                    </div>
                    <div className="text-xs text-white opacity-60">
                      {transaction.category?.name || "Unknown Category"} • {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditClick(transaction)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(transaction._id)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    disabled={deletingId === transaction._id}
                  >
                    {deletingId === transaction._id ? "..." : "Delete"}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 