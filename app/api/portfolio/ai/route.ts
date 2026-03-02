import { NextRequest, NextResponse } from "next/server";
import { generatePortfolioHtml } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const result = await generatePortfolioHtml(prompt);

    if (!/^<!DOCTYPE html>/i.test(result) && !/<html[\s>]/i.test(result)) {
      return NextResponse.json(
        { error: "AI returned invalid HTML output. Please try a clearer prompt." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
