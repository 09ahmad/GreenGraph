import { NextRequest, NextResponse } from "next/server";
import { runDB } from "@/lib/db/db";
import { Types } from "mongoose";
import { TransactionModel } from "@/lib/db/models/transationSchema";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await runDB();
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const updated = await TransactionModel.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
