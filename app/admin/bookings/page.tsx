"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { BookingsList } from "@/components/admin/bookings-list"

export default function BookingsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <BookingsList />
      </div>
    </ProtectedRoute>
  )
}
