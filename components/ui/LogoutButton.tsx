"use client"

/**
 * Logout Button
 */

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        padding: "8px 16px",
        marginTop: "20px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  )
}