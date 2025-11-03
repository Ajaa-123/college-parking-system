"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { MyBookingsList } from "@/components/bookings/my-bookings-list"

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <MyBookingsList />
      </div>
    </ProtectedRoute>
  )
}
