"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-balance">DigiMenu</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Manage your restaurant menu digitally. Share with customers via QR codes or links. No printing, no hassle.
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button size="lg" className="px-8">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Create Account
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full">
            <div className="p-6 bg-card rounded-lg border">
              <h3 className="font-bold text-lg mb-2">Easy Setup</h3>
              <p className="text-sm text-muted-foreground">Create restaurants and manage multiple menus in minutes</p>
            </div>
            <div className="p-6 bg-card rounded-lg border">
              <h3 className="font-bold text-lg mb-2">QR Code Sharing</h3>
              <p className="text-sm text-muted-foreground">Generate unique QR codes for each restaurant menu</p>
            </div>
            <div className="p-6 bg-card rounded-lg border">
              <h3 className="font-bold text-lg mb-2">Real-Time Updates</h3>
              <p className="text-sm text-muted-foreground">Update prices and items instantly across all channels</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
