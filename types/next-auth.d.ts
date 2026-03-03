import { DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: "USER" | "ADMIN"
      isVerified?: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role?: "USER" | "ADMIN"
    isVerified?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: "USER" | "ADMIN"
    isVerified?: boolean
  }
}