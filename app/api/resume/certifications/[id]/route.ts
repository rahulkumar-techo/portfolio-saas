import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import certificateService from "@/services/certificate.service";
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
    const certificateId = params?.id;
    if (!certificateId) {
      return ResponseHandler.badRequest("Certificate ID is required");
    }

    await connectDB();
    const certificate = await certificateService.getCertificateById(
      session.user.id,
      certificateId
    );
    if (!certificate) {
      return ResponseHandler.notFound("Certificate not found");
    }

    return ResponseHandler.ok(certificate);
  }
);
