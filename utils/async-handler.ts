/**
 * Async Handler for Next.js Route Handlers
 * Catches errors and formats response
 */

import { NextResponse } from "next/server";
import { AppError } from "./app-error";

type RouteHandler = (
  req: Request,
  context?: { params?: Record<string, string> }
) => Promise<Response>;

export const asyncHandler =
  (handler: RouteHandler) =>
  async (req: Request, context?: { params?: Record<string, string> }) => {
    try {
      return await handler(req, context);
    } catch (error: unknown) {
      // Known AppError
      if (error instanceof AppError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: error.statusCode }
        );
      }

      // Unknown error
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
    }
  };