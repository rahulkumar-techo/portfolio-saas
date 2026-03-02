import { asyncHandler } from "@/utils/async-handler";
import { ProjectService } from "@/services/project.service";
import { NextResponse } from "next/server";

const service = new ProjectService();

// Replace with real session extraction
const getUserId = () => "USER_ID_FROM_SESSION";

export const GET = asyncHandler(async () => {
  const projects = await service.getUserProjects(getUserId());

  return NextResponse.json({
    success: true,
    data: projects,
  });
});

export const POST = asyncHandler(async (req: Request) => {
  const body = await req.json();

  const project = await service.createProject(getUserId(), body);

  return NextResponse.json({
    success: true,
    data: project,
  });
});