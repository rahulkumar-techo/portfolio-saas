/**
 * Global Error Response
 * Converts errors to JSON response
 */

import { NextResponse } from "next/server";
import { AppError } from "./app-error";

export const errorResponse = (error: unknown) => {
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode }
    );
  }

  return NextResponse.json(
    { success: false, message: "Internal Server Error" },
    { status: 500 }
  );
};