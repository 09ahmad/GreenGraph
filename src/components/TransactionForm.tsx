"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  _id: string;
  amount: number;
  description?: string;
  date: string;
  category: string;
}

interface Category {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
  type: "expense" | "income";
}

export function TransactionForm({ onSuccess, transaction }: { onSuccess: () => void; transaction?: Transaction | null }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description || "");
      setDate(transaction.date ? new Date(transaction.date).toISOString().slice(0, 10) : "");
      setCategory(transaction.category || "");
    } else {
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().slice(0, 10));
      setCategory("");
    }
  }, [transaction]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category/getAll");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    if (!date) {
      toast({ title: "Please select a date", variant: "destructive" });
      return;
    }

    if (!category) {
      toast({ title: "Please select a category", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const transactionData = {
        amount: parseFloat(amount),
        description: description.trim(),
        date: new Date(date),
        category: category
      };

      let response;
      if (transaction && transaction._id) {
        response = await fetch(`/api/transactions/update/${transaction._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transactionData)
        });
      } else {
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
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md border border-gray-700 rounded-xl bg-[#18181b] p-8">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                className="border border-gray-700 rounded-lg px-4 py-2 bg-[#18181b] focus:border-gray-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full border border-gray-700 rounded-lg px-4 py-2 bg-[#18181b] text-card-foreground font-mono shadow-none focus:border-gray-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name} ({cat.type})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description (optional)"
                maxLength={100}
                className="border border-gray-700 rounded-lg px-4 py-2 bg-[#18181b] focus:border-gray-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center border border-gray-700 rounded-lg px-4 py-2 bg-[#18181b] focus:border-gray-500 text-left relative"
                    onClick={() => setDatePickerOpen((open) => !open)}
                  >
                    <span className="flex-1">
                      {date ? format(new Date(date), "MM/dd/yyyy") : "Pick a date"}
                    </span>
                    <CalendarIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#18181b] border border-gray-700 rounded-xl">
                  <Calendar
                    mode="single"
                    selected={date ? new Date(date) : undefined}
                    onSelect={(selected) => {
                      setDate(selected ? selected.toISOString().slice(0, 10) : "");
                      setDatePickerOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <CardFooter className="flex-col gap-2 p-0 mt-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : (transaction ? "Update Transaction" : "Add Transaction")}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 