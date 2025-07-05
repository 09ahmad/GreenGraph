import { NextRequest, NextResponse } from "next/server";
import { runDB } from "@/lib/db/db";
import { TransactionModel } from "@/lib/db/models/transationSchema";
import { Types } from "mongoose";



export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await runDB();
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const deleted = await TransactionModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
