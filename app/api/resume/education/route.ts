import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import educationService from "@/services/education.service";
import { EducationRequestBody } from "@/types/server-types/resume";
import { asyncHandler } from "@/utils/async-handler";
import { ResponseHandler } from "@/utils/response-handler";
import { getServerSession } from "next-auth";

export const POST = asyncHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  const userId = session.user.id;
  await connectDB();

  const body = (await req.json()) as EducationRequestBody;
  if (!body.degree || !body.field || !body.institution || !body.startYear) {
    return ResponseHandler.badRequest("Missing required fields");
  }

  const education = await educationService.addEducation(userId, body);
  return ResponseHandler.ok(education, "Education added successfully");
});

export const PUT = asyncHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  const userId = session.user.id;
  await connectDB();

  const { educationId, body } = (await req.json()) as {
    educationId?: string;
    body?: Partial<EducationRequestBody>;
  };

  if (!educationId || !body) {
    return ResponseHandler.badRequest("educationId and body are required");
  }

  const education = await educationService.updateEducation(userId, educationId, body);
  if (!education) {
    return ResponseHandler.notFound("Education not found");
  }

  return ResponseHandler.ok(education, "Education updated successfully");
});

export const DELETE = asyncHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  const userId = session.user.id;
  await connectDB();

  const { educationId } = (await req.json()) as { educationId?: string };
  if (!educationId) {
    return ResponseHandler.badRequest("Education ID is required");
  }

  const result = await educationService.deleteEducation(userId, educationId);
  if (!result.success) {
    return ResponseHandler.notFound("Education not found");
  }

  return ResponseHandler.ok(result, "Education deleted successfully");
});
