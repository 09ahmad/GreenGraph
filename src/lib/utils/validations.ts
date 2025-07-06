import {z} from "zod";

export interface ITransaction extends Document{
  amount: number;
  description?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  category: ICategory | string;
}

export interface ICategory extends Document {
  name: string;
  icon?: string;
  color?: string;
  budget?: number;
  type: "expense" | "income";
}

export const validTransaction = z.object({
  amount: z.number().min(0.01, "Amount must be at least 0.01"),
  description: z.string().max(200, "Maximum 200 character allowed").optional(),
  date: z.string().or(z.date()).transform((val) => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }),
  category: z.string().min(1, "Category is required")
});

export const validCategory = z.object({
  name: z.string()
    .min(4, "Name must have at least 4 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),
  icon: z.string().optional(),
  color: z.string().optional(),
  type: z.enum(["expense", "income"]).default("expense"),
  budget: z.number().min(0, "Budget must be non-negative").optional(),
});