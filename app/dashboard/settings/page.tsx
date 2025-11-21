import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsPage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <h2 className="text-3xl font-bold">Settings</h2>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Full Name</label>
              <p className="text-lg font-medium">{user.fullName}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Country</label>
              <p className="text-lg font-medium">{user.country}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Account Status</label>
              <p className="text-lg font-medium">{user.verified ? "Verified" : "Unverified"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
