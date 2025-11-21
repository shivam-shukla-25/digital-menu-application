"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function QRCodePage({ params }: { params: { id: string } }) {
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [menuLink, setMenuLink] = useState("")

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const link = `${baseUrl}/menu/${params.id}`
    setMenuLink(link)

    // Generate QR code using QR Server API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`
    setQrCodeUrl(qrUrl)
  }, [params.id])

  const handleDownloadQR = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `menu-qr-${params.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(menuLink)
    alert("Link copied to clipboard!")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Share Menu</h2>

        <div className="grid gap-6 max-w-3xl">
          {/* QR Code Card */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>Scan this QR code to view your menu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {qrCodeUrl && (
                <div className="flex justify-center p-6 bg-background rounded-lg border">
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="Menu QR Code" className="w-64 h-64" />
                </div>
              )}
              <Button onClick={handleDownloadQR} className="w-full">
                Download QR Code
              </Button>
            </CardContent>
          </Card>

          {/* Shared Link Card */}
          <Card>
            <CardHeader>
              <CardTitle>Shareable Link</CardTitle>
              <CardDescription>Share this link with your customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg break-all text-sm font-mono">{menuLink}</div>
              <Button onClick={handleCopyLink} className="w-full">
                Copy Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
