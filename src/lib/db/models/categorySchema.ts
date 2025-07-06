import { Schema, model, models } from "mongoose";
import { ICategory } from "@/lib/utils/validations";
const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Category name too long"],
    },
    icon: {
      type: String,
      default: "dollar-sign", 
    },
    color: {
      type: String,
      default: "#888888",
    },
     type: {
      type: String,
      required: true,
      enum: ["expense", "income"],
      default: "expense"
    },
    budget: {
      type: Number,
      min: [0, "Budget must be non-negative"],
      default: 0,
    },
  },
  {
    timestamps: true
  }
);

export const CategoryModel = models.Category || model<ICategory>("Category", categorySchema);
