/**
 * Generate ATS Resume using AI
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

  const { resumeData } =
    await BuildResumeService.checkResumeStrength(session.user.id);

  const generated = await AIResumeService.generateATSResume(resumeData, jobDescription);

  return ResponseHandler.ok({
    generated,
  });

});
