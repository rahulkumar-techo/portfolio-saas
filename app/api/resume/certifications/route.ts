import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import certificateService from "@/services/certificate.service";
import { CertificateRequestBody } from "@/types/server-types/resume";
import { asyncHandler } from "@/utils/async-handler";
import { ResponseHandler } from "@/utils/response-handler";
import { getServerSession } from "next-auth";

export const POST = asyncHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  await connectDB();
  const body = (await req.json()) as CertificateRequestBody;
  if (!body.name || !body.issuer || !body.issueDate) {
    return ResponseHandler.badRequest("Missing required fields");
  }

  const certificate = await certificateService.addCertificate(session.user.id, body);
  return ResponseHandler.ok(certificate, "Certificate added successfully");
});

export const PUT = asyncHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  await connectDB();
  const { certificateId, body } = (await req.json()) as {
    certificateId?: string;
    body?: Partial<CertificateRequestBody>;
  };

  if (!certificateId || !body) {
    return ResponseHandler.badRequest("certificateId and body are required");
  }

  const certificate = await certificateService.updateCertificate(
    session.user.id,
    certificateId,
    body
  );
  if (!certificate) {
    return ResponseHandler.notFound("Certificate not found");
  }

  return ResponseHandler.ok(certificate, "Certificate updated successfully");
});

export const DELETE = asyncHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  await connectDB();
  const { certificateId } = (await req.json()) as { certificateId?: string };
  if (!certificateId) {
    return ResponseHandler.badRequest("Certificate ID is required");
  }

  const result = await certificateService.deleteCertificate(session.user.id, certificateId);
  if (!result.success) {
    return ResponseHandler.notFound("Certificate not found");
  }

  return ResponseHandler.ok(result, "Certificate deleted successfully");
});
