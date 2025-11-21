import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  const restaurant = await db.restaurant.findFirst({
    where: { id},
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
      dishes: {
        include: {
          categories: true,
        },
      },
    },
  })

  if (!restaurant || restaurant.userId !== user.id) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">{restaurant.name}</h2>
          <p className="text-muted-foreground">{restaurant.location}</p>
        </div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="dishes">All Dishes</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Menu Categories</h3>
              <Link href={`/dashboard/restaurants/${restaurant.id}/categories/new`}>
                <Button>Add Category</Button>
              </Link>
            </div>

            {restaurant.categories.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No categories yet</p>
                  <Link href={`/dashboard/restaurants/${restaurant.id}/categories/new`}>
                    <Button>Create First Category</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {restaurant.categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{category.name}</CardTitle>
                        <div className="flex gap-2">
                          <Link href={`/dashboard/restaurants/${restaurant.id}/categories/${category.id}`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Link href={`/dashboard/restaurants/${restaurant.id}/categories/${category.id}/delete`}>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{category.dishes.length} dishes in this category</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="dishes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">All Dishes</h3>
              <Link href={`/dashboard/restaurants/${restaurant.id}/dishes/new`}>
                <Button>Add Dish</Button>
              </Link>
            </div>

            {restaurant.dishes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No dishes yet</p>
                  <Link href={`/dashboard/restaurants/${restaurant.id}/dishes/new`}>
                    <Button>Create First Dish</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {restaurant.dishes.map((dish) => (
                  <Card key={dish.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{dish.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{dish.description}</p>
                          <div className="flex gap-2 items-center">
                            <span className="text-lg font-bold text-primary">₹{dish.price}</span>
                            {dish.spiceLevel && (
                              <span className="text-xs bg-accent px-2 py-1 rounded">Spice: {dish.spiceLevel}/5</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/dashboard/restaurants/${restaurant.id}/dishes/${dish.id}`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Link href={`/dashboard/restaurants/${restaurant.id}/dishes/${dish.id}/delete`}>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
