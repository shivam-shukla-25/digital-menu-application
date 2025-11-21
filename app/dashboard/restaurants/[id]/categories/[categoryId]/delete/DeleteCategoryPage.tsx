"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function DeleteCategoryPage({
  params,
}: {
  params: { id: string; categoryId: string }
}) {

  const { id, categoryId } = params;
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/restaurants/${id}/categories/${categoryId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        setError("Failed to delete category")
        return
      }

      router.push(`/dashboard/restaurants/${id}`)
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <Card className="max-w-md border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Category</CardTitle>
          <CardDescription>This action cannot be undone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Are you sure you want to delete this category? Dishes in this category will remain but the category
            association will be removed.
          </p>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <div className="flex gap-2">
            <Button onClick={handleDelete} disabled={loading} variant="destructive">
              {loading ? "Deleting..." : "Delete"}
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
