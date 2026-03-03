/**
 * User API Route
 * Handles GET & PUT for user profile
 */

import { asyncHandler } from "@/utils/async-handler"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import userService from "@/services/user.service"
import { UserValidator } from "@/validators/user.validator"
import { ResponseHandler } from "@/utils/response-handler"
import { connectDB } from "@/lib/db"

/* ---------------- PATCH ---------------- */

export const PATCH = asyncHandler(async (req: Request) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        )
    }

    const body = await req.json()
    // Debug log
    console.info("Received data for update:", body);
    const validatedData = UserValidator.parse(body);
    console.info("Validated data for update:", validatedData);
    await connectDB();

    const updatedUser = await userService.updateUserInfo(
        session.user.id,
        validatedData
    )

    return ResponseHandler.ok(
        updatedUser,
        "User information updated successfully"
    )
})

/* ---------------- GET ---------------- */

export const GET = asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    console.log("Session:User (Debug session data)", session); // Debug log

    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        )
    }
    await connectDB();
    const userInfo = await userService.getUserInfo(session.user.id)

    return ResponseHandler.ok(
        userInfo,
        "User information fetched successfully"
    )
})