import { asyncHandler } from "@/utils/async-handler";
import { ProjectService } from "@/services/project.service";
import { NextResponse } from "next/server";

const service = new ProjectService();
const getUserId = () => "USER_ID_FROM_SESSION";

export const GET = asyncHandler(async (_: Request, { params }:any) => {
  const project = await service.getProject(getUserId(), params.projectId);

  return NextResponse.json({ success: true, data: project });
});

export const PUT = asyncHandler(async (req: Request, { params }:any) => {
  const body = await req.json();

  const updated = await service.updateProject(
    getUserId(),
    params.projectId,
    body
  );

  return NextResponse.json({ success: true, data: updated });
});

export const DELETE = asyncHandler(async (_: Request, { params }:any) => {
  const result = await service.deleteProject(
    getUserId(),
    params.projectId
  );

  return NextResponse.json({ success: true, data: result });
});