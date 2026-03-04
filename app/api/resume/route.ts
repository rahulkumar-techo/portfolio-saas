/**
 * Resume API Route
 * Supports full resume fetch or section-based fetch
 */

import resumeService from "@/services/resume.service";
import { ResponseHandler } from "@/utils/response-handler";
import { asyncHandler } from "@/utils/async-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";

export const GET = asyncHandler(async (req: Request) => {
  // 🔐 Get user (replace with your auth logic)
  const session = await getServerSession(authOptions);

  console.log("Session:Resume (Debug session data)", session); //

  if (!session?.user?.id) {
    return ResponseHandler.unauthorized("Unauthorized access");
  }

  const userId = session.user.id;

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  // connect to db
  await connectDB();

  // If section query exists → fetch specific section
  if (section) {
    const data = await resumeService.getResumeSection(userId, section);
    return ResponseHandler.ok(data, `${section} fetched successfully`);
  }

  // Otherwise fetch full resume
  const resume = await resumeService.getFullResume(userId);
  return ResponseHandler.ok(resume, "Resume fetched successfully");
});

/*
GET /api/resume?section=experience
GET /api/resume?section=contactInfo
GET /api/resume?section=skills
*/ 
