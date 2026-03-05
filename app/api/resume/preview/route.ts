/**
 * Resume Preview
 */

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { asyncHandler } from "@/utils/async-handler";
import { ResponseHandler } from "@/utils/response-handler";
import BuildResumeService from "@/services/build-resume.service";

export const GET = asyncHandler(async () => {

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return ResponseHandler.unauthorized("Unauthorized");
  }

  const resumeData = await BuildResumeService.buildResumeData(session.user.id);
  const previewText = BuildResumeService.buildResumePreview(resumeData);

  return ResponseHandler.ok({
    resumeData,
    previewText,
  });

});
