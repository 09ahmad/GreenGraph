export interface Transaction {
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

export interface Category {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
  type: "expense" | "income";
  budget?: number;
} 