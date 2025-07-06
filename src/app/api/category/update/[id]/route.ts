import { NextRequest, NextResponse } from "next/server";
import { runDB } from "@/lib/db/db";
import { Types } from "mongoose";
import { CategoryModel } from "@/lib/db/models/categorySchema";
import { validCategory } from "@/lib/utils/validations";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await runDB();
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    // Only validate fields that are being updated
    const validateInput = validCategory.partial().safeParse(body);
    if (!validateInput.success) {
      return NextResponse.json({
        message: "Invalid Input",
        errors: validateInput.error.errors
      }, { status: 400 });
    }
    const updated = await CategoryModel.findByIdAndUpdate(id, validateInput.data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
} 