/**
 * Portfolio API Route
 */

import { NextRequest, NextResponse } from "next/server";
import { updatePortfolioSchema } from "@/validators/portfolio.validator";
import { PortfolioService } from "@/services/portfolio.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const service = new PortfolioService();

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updatePortfolioSchema.parse(body);

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const result = await service.updatePortfolio(userId, parsed);

    return NextResponse.json(result);

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
