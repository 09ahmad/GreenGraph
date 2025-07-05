"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  _id: string;
  amount: number;
  description?: string;
  date: string;
}

export function TransactionForm({ onSuccess, transaction }: { onSuccess: () => void; transaction?: Transaction | null }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Set form data when editing
  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description || "");
      setDate(transaction.date ? new Date(transaction.date).toISOString().slice(0, 10) : "");
    } else {
      // Reset form for new transaction
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    if (!date) {
      toast({ title: "Please select a date", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const transactionData = {
        amount: parseFloat(amount),
        description: description.trim(),
        date: new Date(date)
      };

      let response;
      if (transaction && transaction._id) {
        // Update existing transaction
        response = await fetch(`/api/transactions/update/${transaction._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transactionData)
        });
      } else {
        // Create new transaction
        response = await fetch("/api/transactions/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transactionData)
        });
      }

      if (response.ok) {
        const message = transaction ? "Transaction updated successfully!" : "Transaction added successfully!";
        toast({ title: message });
        onSuccess();
      } else {
        throw new Error("Failed to save transaction");
      }
    } catch {
      toast({ title: "Error saving transaction", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Amount ($)</label>
        <Input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description (optional)"
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Date</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : (transaction ? "Update Transaction" : "Add Transaction")}
      </Button>
    </form>
  );
} 