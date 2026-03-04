import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import skillsService from "@/services/skills.service";
import { SkillGroup } from "@/types/server-types/resume";
import { asyncHandler } from "@/utils/async-handler";
import { ResponseHandler } from "@/utils/response-handler";
import { getServerSession } from "next-auth";

const getUserId = async () => {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
};

export const GET = asyncHandler(async () => {
  const userId = await getUserId();
  if (!userId) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  await connectDB();
  const skills = await skillsService.getSkills(userId);
  return ResponseHandler.ok(skills, "Skills fetched successfully");
});

export const PUT = asyncHandler(async (req: Request) => {
  const userId = await getUserId();
  if (!userId) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  const { skillGroups } = (await req.json()) as { skillGroups?: SkillGroup[] };
  if (!Array.isArray(skillGroups)) {
    return ResponseHandler.badRequest("skillGroups must be an array");
  }

  await connectDB();
  const skills = await skillsService.updateSkills(userId, skillGroups);
  return ResponseHandler.ok(skills, "Skills updated successfully");
});

export const POST = asyncHandler(async (req: Request) => {
  const userId = await getUserId();
  if (!userId) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  const { group } = (await req.json()) as { group?: SkillGroup };
  if (!group) {
    return ResponseHandler.badRequest("group is required");
  }

  await connectDB();
  const skills = await skillsService.addSkillGroup(userId, group);
  return ResponseHandler.ok(skills, "Skill group saved successfully");
});

export const DELETE = asyncHandler(async (req: Request) => {
  const userId = await getUserId();
  if (!userId) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  const { category } = (await req.json()) as { category?: string };
  if (!category?.trim()) {
    return ResponseHandler.badRequest("category is required");
  }

  await connectDB();
  const skills = await skillsService.deleteSkillGroup(userId, category);
  return ResponseHandler.ok(skills, "Skill group deleted successfully");
});
