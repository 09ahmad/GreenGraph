import { Schema, model, models } from "mongoose";
import { ITransaction } from "../utils/validations";


const transactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be at least 0.01"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [100, "Description cannot exceed 100 characters"],
      default: "", 
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

export const TransactionModel = models.Transaction || model<ITransaction>("Transaction", transactionSchema);