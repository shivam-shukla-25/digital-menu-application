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

export default function NewDishPage(params: {params: string}) {
  console.log('console.params', params.params)
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
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
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/restaurants/${params?.params}/categories`)
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error("Failed to fetch categories:", err)
      }
    }
    fetchCategories()
  }, [params?.params])

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
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/restaurants/${params?.params}/dishes`, {
        method: "POST",
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
        setError(data.error || "Failed to create dish")
        return
      }

      router.push(`/dashboard/restaurants/${params?.params}`)
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Add New Dish</CardTitle>
          <CardDescription>Create a new menu item</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Dish Name</label>
                <Input
                  required
                  placeholder="e.g., Cappuccino"
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
                  placeholder="80"
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
                placeholder="Describe the dish..."
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
                placeholder="3"
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
                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No categories available. Create one first.</p>
                ) : (
                  categories.map((category) => (
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
                  ))
                )}
              </div>
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Dish"}
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
