import { NextRequest, NextResponse } from "next/server";
import { generateScene } from "@/lib/generate-3d";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: "Prompt too long (max 500 characters)" },
        { status: 400 }
      );
    }

    const result = await generateScene(prompt.trim());

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Failed to generate scene. Please try again." },
      { status: 500 }
    );
  }
}
