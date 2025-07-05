"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { MonthlyExpensesChart } from "./MonthlyExpensesChart";

export function TransactionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch transactions on component mount
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
    // Refresh data without page reload
    fetchTransactions();
    setRefreshKey(prev => prev + 1);
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Personal Finance Tracker</h1>
        <p className="text-gray-600">Keep track of your daily expenses</p>
      </div>

      {/* Add Transaction Button */}
      <div className="flex justify-end mb-6">
        <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700">
          + Add Transaction
        </Button>
      </div>

      {/* Transaction Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm 
            onSuccess={handleFormSuccess} 
            transaction={editingTransaction} 
          />
        </DialogContent>
      </Dialog>

      {/* Transaction List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <TransactionList 
          onEdit={handleEditClick} 
          transactions={transactions}
          onRefresh={fetchTransactions}
          refreshKey={refreshKey}
        />
      </div>

      {/* Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
        <MonthlyExpensesChart transactions={transactions} />
      </div>

      <Toaster />
    </div>
  );
} 