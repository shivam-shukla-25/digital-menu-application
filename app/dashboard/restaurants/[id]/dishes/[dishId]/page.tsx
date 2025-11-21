"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface Category {
  id: string
  name: string
}

export default function EditDishPage({
  params,
}: {
  params: { id: string; dishId: string }
}) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    spiceLevel: "",
    image: "",
    selectedCategories: [] as string[],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dishRes, categoriesRes] = await Promise.all([
          fetch(`/api/restaurants/${params.id}/dishes/${params.dishId}`),
          fetch(`/api/restaurants/${params.id}/categories`),
        ])

        const dish = await dishRes.json()
        const cats = await categoriesRes.json()

        setCategories(cats)
        setFormData({
          name: dish.name,
          description: dish.description,
          price: dish.price.toString(),
          spiceLevel: dish.spiceLevel?.toString() || "",
          image: dish.image,
          selectedCategories: dish.categories.map((c: any) => c.categoryId),
        })
        if (dish.image) {
          setImagePreview(dish.image)
        }
      } catch (err) {
        setError("Failed to load dish")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, params.dishId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData({ ...formData, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFormData({
      ...formData,
      selectedCategories: formData.selectedCategories.includes(categoryId)
        ? formData.selectedCategories.filter((id) => id !== categoryId)
        : [...formData.selectedCategories, categoryId],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const response = await fetch(`/api/restaurants/${params.id}/dishes/${params.dishId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          spiceLevel: formData.spiceLevel ? Number.parseInt(formData.spiceLevel) : null,
          image: formData.image,
          categoryIds: formData.selectedCategories,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Failed to update dish")
        return
      }

      router.push(`/dashboard/restaurants/${params.id}`)
    } catch (err) {
      setError("An error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Edit Dish</CardTitle>
          <CardDescription>Update menu item details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Dish Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price (₹)</label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                required
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Spice Level (0-5, optional)</label>
              <Input
                type="number"
                min="0"
                max="5"
                value={formData.spiceLevel}
                onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dish Image</label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-32 object-cover rounded" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-4">Assign to Categories</label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <Checkbox
                      id={category.id}
                      checked={formData.selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                    <label htmlFor={category.id} className="text-sm cursor-pointer">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
