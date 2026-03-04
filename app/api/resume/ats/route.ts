/**
 * ATS analysis endpoint
 */

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { asyncHandler } from "@/utils/async-handler";
import { ResponseHandler } from "@/utils/response-handler";
import BuildResumeService from "@/services/build-resume.service";
import AIResumeService from "@/services/ai-resume.service";

export const POST = asyncHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return ResponseHandler.unauthorized("Unauthorized");
  }

  const body = await req.json().catch(() => ({}));
  const jobDescription = BuildResumeService.parseJobDescription(body?.jobDescription);
  if (!jobDescription) {
    return ResponseHandler.badRequest("jobDescription is required for ATS analysis");
  }

  const resumeData = await BuildResumeService.buildResumeData(session.user.id);
  const analysis = await AIResumeService.analyzeResume(resumeData, jobDescription);

  return ResponseHandler.ok({
    analysis,
  });
});
