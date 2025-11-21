import { cookies } from "next/headers"
import { db } from "./db"

export async function createSession(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set("userId", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("userId")
}

export async function getSession() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  if (!userId) return null

  const user = await db.user.findUnique({
    where: { id: userId },
  })

  return user
}
