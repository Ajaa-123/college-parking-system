"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { NewBookingForm } from "@/components/bookings/new-booking-form"

export default function NewBookingPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <NewBookingForm />
      </div>
    </ProtectedRoute>
  )
}
