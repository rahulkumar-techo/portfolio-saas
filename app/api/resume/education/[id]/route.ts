import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import educationService from "@/services/education.service";
import { asyncHandler } from "@/utils/async-handler";
import { ResponseHandler } from "@/utils/response-handler";
import { getServerSession } from "next-auth";

export const GET = asyncHandler(
  async (
    _req: Request,
    context?: { params?: Record<string, string> | Promise<Record<string, string>> }
  ) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return ResponseHandler.unauthorized("Unauthorized access");
    }

    const params = await context?.params;
    const educationId = params?.id;
    if (!educationId) {
      return ResponseHandler.badRequest("Education ID is required");
    }

    await connectDB();
    const education = await educationService.getEducationById(session.user.id, educationId);
    if (!education) {
      return ResponseHandler.notFound("Education not found");
    }

    return ResponseHandler.ok(education);
  }
);
