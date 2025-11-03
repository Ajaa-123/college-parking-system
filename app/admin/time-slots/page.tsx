"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { TimeSlotsList } from "@/components/admin/time-slots-list"

export default function TimeSlotsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <TimeSlotsList />
      </div>
    </ProtectedRoute>
  )
}
