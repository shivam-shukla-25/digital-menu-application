import { db } from "@/lib/db"
import { createSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Missing email or code" }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!user.verificationCode || user.verificationCode !== code) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    if (user.verificationCodeExpiry && user.verificationCodeExpiry < new Date()) {
      return NextResponse.json({ error: "Verification code expired" }, { status: 400 })
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationCode: null,
        verificationCodeExpiry: null,
      },
    })

    await createSession(user.id)

    return NextResponse.json({ message: "Email verified successfully", userId: user.id }, { status: 200 })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
