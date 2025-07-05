import { NextResponse } from 'next/server';
import { runDB as connectToDB } from '@/lib/db/db';
import { TransactionModel as Transaction } from '@/lib/db/models/transationSchema';

export async function GET() {
  try {
    await connectToDB();
    
    const transactions = await Transaction.find({});
    
    return NextResponse.json({
      success: true,
      data: transactions,
      message: "Transactions fetched successfully"
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching transactions"
    }, { status: 500 });
  }
}