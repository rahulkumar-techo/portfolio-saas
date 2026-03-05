/**
 * Portfolio API Route
 */

import { NextRequest, NextResponse } from "next/server";
import { updatePortfolioSchema } from "@/validators/portfolio.validator";
import { PortfolioService } from "@/services/portfolio.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ResponseHandler } from "@/utils/response-handler";

const service = new PortfolioService();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return ResponseHandler.unauthorized("Unauthorized access");
    }

    await connectDB();
    const portfolio = await service.getPortfolioByUserId(userId);

    return ResponseHandler.ok(
      portfolio,
      portfolio ? "Portfolio fetched successfully" : "Portfolio not found"
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to fetch portfolio" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updatePortfolioSchema.parse(body);

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectDB();
    const result = await service.updatePortfolio(userId, parsed);

    return NextResponse.json(result);

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
