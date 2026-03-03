/**
 * NextAuth v4 Configuration (Mongoose + JWT Strategy)
 * Clean + Fully Typed + SaaS Ready
 */

import type { NextAuthOptions } from "next-auth"
import type { Types } from "mongoose"

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import bcrypt from "bcryptjs"

import { connectDB } from "./db"
import UserModel from "@/models/users/user.model"

/* ---------------- Types ---------------- */

type DBUser = {
  _id: Types.ObjectId
  email: string
  name: string
  password?: string
  role?: "USER" | "ADMIN"
  isVerified?: boolean
  avatar?: {
    url?: string
    alt?: string
    ImageId?: string
  }
}

/* ---------------- Utils ---------------- */

const normalizeEmail = (email: string) =>
  email.trim().toLowerCase()

const toBaseUsername = (email: string) =>
  email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") || "user"

async function generateUniqueUsername(base: string): Promise<string> {
  let candidate = base
  let attempt = 0

  while (await UserModel.exists({ username: candidate })) {
    attempt++
    candidate = `${base}${attempt}`
  }

  return candidate
}

/* ---------------- Auth Config ---------------- */

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    /* 🔐 Credentials */
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await connectDB()

        const user = await UserModel.findOne({
          email: normalizeEmail(credentials.email),
        })
          .select("_id email name password role isVerified avatar")
          .lean<DBUser | null>()

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) return null

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified,
          avatar: user.avatar,
        }
      },
    }),

    /* 🌐 Google */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    /* 🔐 JWT */
    async jwt({ token, user, account, profile }: any) {

      // Credentials login
      if (user) {
        token.id = user.id
        token.role = user.role
        token.isVerified = user.isVerified
        token.avatar = user.avatar
      }

      // Google login
      if (account?.provider === "google" && profile?.email) {
        await connectDB()

        const email = normalizeEmail(profile.email)

        let dbUser = await UserModel.findOne({ email })
          .select("_id email name role isVerified avatar")
          .lean<DBUser | null>()

        if (!dbUser) {
          const username = await generateUniqueUsername(
            toBaseUsername(email)
          )

          const createdUser = await UserModel.create({
            name: profile.name || email.split("@")[0],
            email,
            username,
            provider: "google",
            oauthId: profile.sub,
            avatar: {
              url: profile.picture || "",
              alt: `${profile.name}'s avatar`,
              imageId: profile.sub,
            },
          })

          dbUser = {
            _id: createdUser._id,
            email: createdUser.email,
            name: createdUser.name,
            role: createdUser.role,
            isVerified: createdUser.isVerified,
            avatar: createdUser.avatar,
          }
        }

        token.id = dbUser._id.toString()
        token.role = dbUser.role
        token.isVerified = dbUser.isVerified
        token.avatar = dbUser.avatar
      }

      return token
    },

    /* 🧩 Session */
    async session({ session, token }: any) {
      if (session.user && token.id) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.isVerified = token.isVerified
        session.user.avatar = token.avatar
      }

      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}