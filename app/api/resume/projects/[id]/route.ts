import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import resumeProjectService from "@/services/resume-project.service";
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
    const projectId = params?.id;
    if (!projectId) {
      return ResponseHandler.badRequest("Project ID is required");
    }

    await connectDB();
    const project = await resumeProjectService.getProjectById(session.user.id, projectId);
    if (!project) {
      return ResponseHandler.notFound("Project not found");
    }

    return ResponseHandler.ok(project);
  }
);
