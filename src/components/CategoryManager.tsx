"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface Category {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
  type: "expense" | "income";
  budget?: number;
}

const defaultCategories = [
  { name: "Food & Dining", icon: "🍽️", color: "#ef4444", type: "expense" as const },
  { name: "Transportation", icon: "🚗", color: "#3b82f6", type: "expense" as const },
  { name: "Shopping", icon: "🛍️", color: "#8b5cf6", type: "expense" as const },
  { name: "Entertainment", icon: "🎬", color: "#f59e0b", type: "expense" as const },
  { name: "Healthcare", icon: "🏥", color: "#10b981", type: "expense" as const },
  { name: "Salary", icon: "💰", color: "#22c55e", type: "income" as const },
  { name: "Freelance", icon: "💼", color: "#06b6d4", type: "income" as const },
  { name: "Investment", icon: "📈", color: "#84cc16", type: "income" as const },
];

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "", color: "#888888", type: "expense" as "expense" | "income" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category/getAll");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        await createDefaultCategories();
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const createDefaultCategories = async () => {
    try {
      for (const category of defaultCategories) {
        await fetch("/api/category/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        });
      }
      fetchCategories();
    } catch (error) {
      console.error("Error creating default categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({ title: "Please enter a category name", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/category/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        toast({ title: "Category added successfully!" });
        setNewCategory({ name: "", icon: "", color: "#888888", type: "expense" });
        setIsModalOpen(false);
        fetchCategories();
      } else {
        throw new Error("Failed to add category");
      }
    } catch (error) {
      toast({ title: "Error adding category", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          + Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category._id} className="p-6 flex flex-col items-center gap-2 border border-gray-700 rounded-xl bg-[#18181b]">
            <div className="text-3xl mb-2">{category.icon || "📁"}</div>
            <div className="font-semibold text-base text-white">{category.name}</div>
            <div className={`text-xs px-2 py-1 rounded-full ${category.type === "income" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>{category.type.charAt(0).toUpperCase() + category.type.slice(1)}</div>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogTitle className="sr-only">Add New Category</DialogTitle>
          <div className="flex justify-center items-center min-h-[60vh]">
            <Card className="w-full max-w-md border border-gray-700 rounded-xl bg-[#18181b] p-8">
              <form onSubmit={e => { e.preventDefault(); handleAddCategory(); }} className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="category-name">Name</Label>
                  <Input
                    id="category-name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Category name"
                    className="border border-gray-700 rounded-lg px-4 py-2 bg-[#18181b] focus:border-gray-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category-icon">Icon (emoji)</Label>
                  <Input
                    id="category-icon"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                    placeholder="🍽️"
                    className="border border-gray-700 rounded-lg px-4 py-2 bg-[#18181b] focus:border-gray-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category-type">Type</Label>
                  <select
                    id="category-type"
                    value={newCategory.type}
                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as "expense" | "income" })}
                    className="flex h-10 w-full border border-gray-700 rounded-lg px-4 py-2 bg-[#18181b] text-card-foreground font-mono shadow-none focus:border-gray-500"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <Button type="submit" disabled={loading} className="w-full mt-2">
                  {loading ? "Adding..." : "Add Category"}
                </Button>
              </form>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 