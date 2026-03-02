/**
 * Async Handler for Next.js Route Handlers
 * Catches errors and formats response
 */

import { NextResponse } from "next/server";
import { AppError } from "./app-error";

export const asyncHandler =
  (handler: Function) =>
  async (req: Request, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error: any) {

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