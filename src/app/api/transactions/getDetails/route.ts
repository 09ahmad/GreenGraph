import { runDB } from "@/lib/db/db";
import { TransactionModel } from "@/lib/db/models/transationSchema";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await runDB();
    
    const transactions = await TransactionModel.find({}).populate('category');
    
    return NextResponse.json({
      success: true,
      data: transactions,
      message: "Transactions fetched successfully"
    }, { status: 200 });
    
  } catch {
    return NextResponse.json({
      success: false,
      message: "Error fetching transactions"
    }, { status: 500 });
  }
}