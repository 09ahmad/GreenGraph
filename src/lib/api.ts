import { Transaction, Category } from "@/types";

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/transactions/getDetails`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/category/getAll`, {
      cache: 'no-store' 
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function createTransaction(transactionData: Partial<Transaction>): Promise<Transaction | null> {
  try {
    const response = await fetch("/api/transactions/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Error creating transaction:", error);
    return null;
  }
}

export async function createCategory(categoryData: Partial<Category>): Promise<Category | null> {
  try {
    const response = await fetch("/api/category/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
}

export async function updateTransaction(id: string, transactionData: Partial<Transaction>): Promise<Transaction | null> {
  try {
    const response = await fetch(`/api/transactions/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Error updating transaction:", error);
    return null;
  }
}

export async function deleteTransaction(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/transactions/delete/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return false;
  }
} 