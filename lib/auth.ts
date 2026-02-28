/**
 * NextAuth v4 Configuration (Mongoose Version)
 */

import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { connectDB } from "./db";
import User from "@/models/users/user.model";


export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    /**
     * 🔐 Credentials Login
     */
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await connectDB()

        const user = await User.findOne({
          email: credentials.email,
        })

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
        }
      },
    }),

    /**
     * 🌐 Google OAuth
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    /**
     * 🧠 JWT Callback
     */
    async jwt({ token, user, account, profile }) {
      await connectDB()

      // If login via Google
      if (account?.provider === "google" && profile?.email) {
        let existingUser = await User.findOne({
          email: profile.email,
        })

        // Create user if not exists
        if (!existingUser) {
          existingUser = await User.create({
            name: profile.name,
            email: profile.email,
          })
        }

        token.id = existingUser._id.toString()
      }

      // Credentials login
      if (user) {
        token.id = user.id
      }

      return token
    },

    /**
     * 🧩 Session Callback
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },

    /**
     * 🔒 Optional Google Email Verification
     */
    async signIn({ account, profile }: any) {
      if (account?.provider === "google") {
        return !!profile?.email_verified
      }
      return true
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}