import { asyncHandler } from "@/utils/async-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ResponseHandler } from "@/utils/response-handler";
import experienceService from "@/services/experience.service";
import { ExperienceRequestBody } from "@/types/server-types/resume";
import { connectDB } from "@/lib/db";



export const POST = asyncHandler(async (req: Request) => {
    const session = await getServerSession(authOptions)


    if (!session?.user?.id) {
        return ResponseHandler.unauthorized("Unauthorized access");
    }

    const userId = session.user.id;

    if (!userId) {
        return ResponseHandler.unauthorized("Unauthorized access");
    }

    await connectDB();

    const { jobRole, company, period, description, tech, order, jobType } = await req.json() as ExperienceRequestBody;

    if (!jobRole || !company || !period || !description || !jobType) {
        return ResponseHandler.badRequest("Missing required fields");
    }

    const exp = await experienceService.addExperience(userId, {
        jobRole,
        jobType,
        company,
        period,
        description,
        tech: Array.isArray(tech) ? tech : [],
        order,
    });

    return ResponseHandler.ok(exp, "Experience added successfully");
}
);


export const PUT = asyncHandler(async (req: Request) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return ResponseHandler.unauthorized("Unauthorized access");
    }

    const userId = session.user.id;

    if (!userId) {
        return ResponseHandler.unauthorized("Unauthorized access");
    }

    await connectDB();

    const { experienceId, body } = await req.json() as { body: ExperienceRequestBody, experienceId: string };

    if (!experienceId || !body) {
        return ResponseHandler.badRequest("experienceId and body are required");
    }

    const exp = await experienceService.update(userId, experienceId, body)
    if (!exp) {
        return ResponseHandler.notFound("Experience not found");
    }

    return ResponseHandler.ok(exp, "Experience updated successfully");
});

export const DELETE = asyncHandler(async (req: Request) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return ResponseHandler.unauthorized("Unauthorized access");
    }

    const userId = session.user.id;
    await connectDB();

    const { experienceId } = await req.json() as { experienceId?: string };
    if (!experienceId) {
        return ResponseHandler.badRequest("Experience ID is required");
    }

    const result = await experienceService.delete(userId, experienceId);
    if (!result?.success) {
        return ResponseHandler.notFound("Experience not found");
    }

    return ResponseHandler.ok(result, "Experience deleted successfully");
});


