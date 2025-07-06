import { NextRequest, NextResponse } from "next/server";
import { runDB } from "@/lib/db/db";
import { Types } from "mongoose";
import { TransactionModel } from "@/lib/db/models/transationSchema";
import { validTransaction } from "@/lib/utils/validations";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await runDB();
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const validateInput = validTransaction.safeParse(body);
    
    if (!validateInput.success) {
      return NextResponse.json({
        message: "Invalid Input",
        errors: validateInput.error.errors
      }, { status: 400 });
    }
    
    const updated = await TransactionModel.findByIdAndUpdate(id, validateInput.data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
