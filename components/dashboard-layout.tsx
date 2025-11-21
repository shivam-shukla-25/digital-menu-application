"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated - middleware handles this but we can add client-side safeguards
    setLoading(false)
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/auth/login")
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6">
        <div className="mb-8">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold">DigiMenu</h1>
          </Link>
        </div>

        <nav className="space-y-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/restaurants">
            <Button variant="ghost" className="w-full justify-start">
              My Restaurants
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start">
              Settings
            </Button>
          </Link>
        </nav>

        <div className="mt-auto pt-8 border-t">
          <Button onClick={handleLogout} variant="destructive" className="w-full">
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border p-6">
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
