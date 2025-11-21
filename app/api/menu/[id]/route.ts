import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const {id} = await params;
  try {
    const restaurant = await db.restaurant.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            dishes: {
              include: {
                    category: true,
              },
            },
          },
        },
      },
    })

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    // Map the categories with their dishes
    const formattedRestaurant = {
      ...restaurant,
      categories: restaurant.categories.map((category) => ({
        ...category,
        dishes: category.dishes,
      })),
    }

    return NextResponse.json(formattedRestaurant)
  } catch (error) {
    console.error("Fetch menu error:", error)
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 })
  }
}
