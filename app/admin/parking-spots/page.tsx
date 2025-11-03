"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { ParkingSpotsList } from "@/components/admin/parking-spots-list"

export default function ParkingSpotsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <ParkingSpotsList />
      </div>
    </ProtectedRoute>
  )
}
