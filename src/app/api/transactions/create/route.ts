import { runDB } from "@/lib/db/db";
import { TransactionModel } from "@/lib/db/models/transationSchema";
import { validTransaction } from "@/lib/utils/validations";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await runDB();
    const body = await req.json();
    const validateInput = validTransaction.safeParse(body);
    if(!validateInput.success){
      return NextResponse.json({
        message:"Invalid Input"
      },{status:401})
    }
    const newTransaction = await TransactionModel.create(body);
    return NextResponse.json(newTransaction, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
