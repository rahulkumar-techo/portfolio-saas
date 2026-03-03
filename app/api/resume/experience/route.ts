import { asyncHandler } from "@/utils/async-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ResponseHandler } from "@/utils/response-handler";
import experienceService from "@/services/experience.service";
import { ExperienceRequestBody } from "@/types/server-types/resume";
import { connectDB } from "@/lib/db";



export const POST = asyncHandler(async (req: Request) => {
 const session = await getServerSession(authOptions)


    console.log("Session:Resume EXperience  (Debug session data)", session?.user); //

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
        tech,
        order,
    });


    // Placeholder for add experience logic
    return ResponseHandler.ok(exp, "Experience added successfully");
}
);


export const PUT = asyncHandler(async (req: Request) => {
    // Placeholder for update experience logic
    return new Response(JSON.stringify({ message: "Update experience - To be implemented" }), { status: 200 });
});

export const DELETE = asyncHandler(async (req: Request) => {
    // Placeholder for delete experience logic
    return new Response(JSON.stringify({ message: "Delete experience - To be implemented" }), { status: 200 });
});


