import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { email, fullName, country } = await req.json()

    if (!email || !fullName || !country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000)

    const user = await db.user.create({
      data: {
        email,
        fullName,
        country,
        verificationCode,
        verificationCodeExpiry: expiryTime,
      },
    })

    const emailResult = await sendVerificationEmail(email, verificationCode, fullName)

    // if (!emailResult.success) {
    //   console.warn(`[Warning] Email failed to send for ${email}, but user was created`)
    // }
    console.log('email verification code', verificationCode)

    return NextResponse.json(
      {
        message: "Check your email for verification code",
        userId: user.id,
        // emailSent: emailResult.success,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
