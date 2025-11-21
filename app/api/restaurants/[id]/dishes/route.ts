import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const {id} = await params;
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const restaurant = await db.restaurant.findUnique({
      where: { id },
    })

    if (!restaurant || restaurant.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { name, description, price, spiceLevel, image, categoryIds } = await req.json()

    if (!name || !description || !price) {
      return NextResponse.json({ error: "Name, description, and price are required" }, { status: 400 })
    }

    const dish = await db.dish.create({
      data: {
        name,
        description,
        price: Number.parseFloat(price),
        spiceLevel: spiceLevel ? Number.parseInt(spiceLevel) : null,
        image: image || "",
        restaurantId: id,
        categories: {
          create: (categoryIds || []).map((categoryId: string) => ({
            categoryId,
          })),
        },
      },
      include: {
        categories: true,
      },
    })

    return NextResponse.json(dish, { status: 201 })
  } catch (error) {
    console.error("Create dish error:", error)
    return NextResponse.json({ error: "Failed to create dish" }, { status: 500 })
  }
}
