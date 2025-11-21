import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  const restaurants = await db.restaurant.findMany({
    where: { userId: user.id },
    include: {
      categories: true,
      dishes: true,
    },
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Welcome, {user.fullName}!</h3>
          <p className="text-muted-foreground">Manage your restaurant menus below</p>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Restaurants</h2>
          <Link href="/dashboard/restaurants/new">
            <Button>Add Restaurant</Button>
          </Link>
        </div>

        {restaurants.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No restaurants yet</p>
              <Link href="/dashboard/restaurants/new">
                <Button>Create Your First Restaurant</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="hover:bg-accent/50 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{restaurant.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">{restaurant.location}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">{restaurant.categories.length} categories</p>
                      <p className="text-muted-foreground">{restaurant.dishes.length} dishes</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/restaurants/${restaurant.id}`}>
                      <Button variant="default">Manage Menu</Button>
                    </Link>
                    <Link href={`/menu/${restaurant.id}`} target="_blank">
                      <Button variant="outline">View Customer Menu</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
