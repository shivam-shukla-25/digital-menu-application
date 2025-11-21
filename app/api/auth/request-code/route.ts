import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000)

    await db.user.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationCodeExpiry: expiryTime,
      },
    })

    const emailResult = await sendVerificationEmail(email, verificationCode, user.fullName)

    if (!emailResult.success) {
      return NextResponse.json({ error: "Failed to send verification email. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ message: "Verification code sent to your email" }, { status: 200 })
  } catch (error) {
    console.error("Request code error:", error)
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 })
  }
}
