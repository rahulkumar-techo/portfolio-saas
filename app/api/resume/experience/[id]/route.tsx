/**
 * GET Single Experience By ID
 * Secure + Authenticated
 */

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import experienceService from "@/services/experience.service";
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

        const userId = session.user.id;

        const params = await context?.params;
        const exp_id = params?.id;

        if (!exp_id) {
            return ResponseHandler.badRequest("Experience ID is required");
        }

        await connectDB();

        const exp = await experienceService.getByExperienceId(
            userId,
            exp_id
        );

        if (!exp) {
            return ResponseHandler.notFound("Experience not found");
        }

        return ResponseHandler.ok(exp);
    }
);
