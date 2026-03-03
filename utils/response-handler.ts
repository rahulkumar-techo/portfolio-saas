import { NextResponse } from "next/server";

export class ResponseHandler {
  // Success Responses
  static ok(data: any = null, message = "Success") {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status: 200 }
    );
  }

  static created(data: any = null, message = "Resource created") {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status: 201 }
    );
  }

  // Client Errors
  static badRequest(message = "Bad request") {
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 }
    );
  }

  static unauthorized(message = "Unauthorized access") {
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 401 }
    );
  }

  static forbidden(message = "Forbidden") {
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 403 }
    );
  }

  static notFound(message = "Resource not found") {
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 404 }
    );
  }

  // Server Error
  static internalError(message = "Internal server error") {
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}