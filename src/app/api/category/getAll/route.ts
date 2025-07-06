import { runDB } from "@/lib/db/db";
import { CategoryModel } from "@/lib/db/models/categorySchema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await runDB();
    
    const categories = await CategoryModel.find({});
    
    return NextResponse.json({
      success: true,
      data: categories,
      message: "Categories fetched successfully"
    }, { status: 200 });
    
  } catch {
    return NextResponse.json({
      success: false,
      message: "Error fetching categories"
    }, { status: 500 });
  }
} 