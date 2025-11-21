import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, location } = await req.json()

    if (!name || !location) {
      return NextResponse.json({ error: "Name and location are required" }, { status: 400 })
    }

    const restaurant = await db.restaurant.create({
      data: {
        name,
        location,
        userId: user.id,
      },
    })

    return NextResponse.json(restaurant, { status: 201 })
  } catch (error) {
    console.error("Restaurant creation error:", error)
    return NextResponse.json({ error: "Failed to create restaurant" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const restaurants = await db.restaurant.findMany({
      where: { userId: user.id },
      include: {
        categories: true,
        dishes: true,
      },
    })

    return NextResponse.json(restaurants)
  } catch (error) {
    console.error("Fetch restaurants error:", error)
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 })
  }
}
