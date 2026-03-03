import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import userService from "@/services/user.service";
import { getSession } from "next-auth/react";
import { UserValidator } from "@/validators/user.validator";
import { ResponseHandler } from "@/utils/response-handler";

const PUT = asyncHandler(async (req: Request) => {
    const body = await req.json();

    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const validateUserData = UserValidator.parse(body);
    const updatedUser = await  userService.updateUserInfo(userId,validateUserData);
    return ResponseHandler.ok(updatedUser, "User information updated successfully");
});

export { PUT };
