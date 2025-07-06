import { runDB } from "@/lib/db/db";
import { CategoryModel } from "@/lib/db/models/categorySchema";
import { validCategory } from "@/lib/utils/validations";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await runDB();
    const body = await req.json();
    const validateInput = validCategory.safeParse(body);
    
    if (!validateInput.success) {
      return NextResponse.json({
        message: "Invalid Input",
        errors: validateInput.error.errors
      }, { status: 400 });
    }
    
    const newCategory = await CategoryModel.create(validateInput.data);
    return NextResponse.json(newCategory, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
} 