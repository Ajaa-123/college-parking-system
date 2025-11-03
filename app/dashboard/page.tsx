"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { useAuth } from "@/contexts/auth-context"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { UserDashboard } from "@/components/dashboard/user-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        {user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
      </div>
    </ProtectedRoute>
  )
}
