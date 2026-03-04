import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import resumeProjectService from "@/services/resume-project.service";
import { ProjectRequestBody } from "@/types/server-types/resume";
import { asyncHandler } from "@/utils/async-handler";
import { ResponseHandler } from "@/utils/response-handler";
import { getServerSession } from "next-auth";

export const POST = asyncHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  await connectDB();
  const body = (await req.json()) as ProjectRequestBody;
  if (!body.title || !body.description || !body.link) {
    return ResponseHandler.badRequest("Missing required fields");
  }

  const project = await resumeProjectService.addProject(session.user.id, {
    ...body,
    tech: Array.isArray(body.tech) ? body.tech : [],
    image: body.image || "",
    stars: Number(body.stars) || 0,
  });

  return ResponseHandler.ok(project, "Project added successfully");
});

export const PUT = asyncHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  await connectDB();
  const { projectId, body } = (await req.json()) as {
    projectId?: string;
    body?: Partial<ProjectRequestBody>;
  };

  if (!projectId || !body) {
    return ResponseHandler.badRequest("projectId and body are required");
  }

  const project = await resumeProjectService.updateProject(session.user.id, projectId, body);
  if (!project) {
    return ResponseHandler.notFound("Project not found");
  }

  return ResponseHandler.ok(project, "Project updated successfully");
});

export const DELETE = asyncHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  await connectDB();
  const { projectId } = (await req.json()) as { projectId?: string };
  if (!projectId) {
    return ResponseHandler.badRequest("Project ID is required");
  }

  const result = await resumeProjectService.deleteProject(session.user.id, projectId);
  if (!result.success) {
    return ResponseHandler.notFound("Project not found");
  }

  return ResponseHandler.ok(result, "Project deleted successfully");
});
