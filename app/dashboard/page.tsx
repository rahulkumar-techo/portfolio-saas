import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/ui/LogoutButton"

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <div className=" underline">Welcome {session.user?.email}</div>
    <LogoutButton/>
    </div>
  )
}