import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string; dishId: string } }) {
  const {dishId} = await params;
  try {
    const dish = await db.dish.findUnique({
      where: { id: dishId },
      include: { categories: true },
    })

    if (!dish) {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 })
    }

    return NextResponse.json(dish)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dish" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string; dishId: string } }) {
  const {dishId, id} = await params;
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

    // Delete existing category associations
    await db.dishCategory.deleteMany({
      where: { dishId },
    })

    const dish = await db.dish.update({
      where: { id: dishId },
      data: {
        name,
        description,
        price: Number.parseFloat(price),
        spiceLevel: spiceLevel ? Number.parseInt(spiceLevel) : null,
        image: image || "",
        categories: {
          create: (categoryIds || []).map((categoryId: string) => ({
            categoryId,
          })),
        },
      },
      include: { categories: true },
    })

    return NextResponse.json(dish)
  } catch (error) {
    console.error("Update dish error:", error)
    return NextResponse.json({ error: "Failed to update dish" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string; dishId: string } }) {
  const {id, dishId} = await params;
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

    await db.dish.delete({
      where: { id: dishId },
    })

    return NextResponse.json({ message: "Dish deleted" })
  } catch (error) {
    console.error("Delete dish error:", error)
    return NextResponse.json({ error: "Failed to delete dish" }, { status: 500 })
  }
}
