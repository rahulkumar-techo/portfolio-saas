"use client"

/**
 * Global Providers Wrapper
 */

import { SessionProvider } from "next-auth/react"
import Navbar from "./ui/Navbar"

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>
    <Navbar />
    {children}
  </SessionProvider>

}