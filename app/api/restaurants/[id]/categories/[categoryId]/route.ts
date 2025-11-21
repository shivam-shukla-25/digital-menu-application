import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest, { params }: { params: { id: string; categoryId: string } }) {
  const {id, categoryId} = await params;
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

    // Delete associated dish-category relationships first
    await db.dishCategory.deleteMany({
      where: { categoryId },
    })

    await db.category.delete({
      where: { id: categoryId },
    })

    return NextResponse.json({ message: "Category deleted" })
  } catch (error) {
    console.error("Delete category error:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
