/**
 * Register API - Creates new user (Mongoose)
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/users/user.model";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      )
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let usernameBase = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    User.findOne({ username: usernameBase }).then(existing => {
      if (existing) {
        usernameBase += Math.floor(Math.random() * 1000); // Simple way to ensure uniqueness
      }
    });
    const username = usernameBase;

    await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      provider: "credentials",
    })

    return NextResponse.json({ message: "User created" })
  } catch (error: any) {
    console.error("REGISTER ERROR:", error)

    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    )
  }
}