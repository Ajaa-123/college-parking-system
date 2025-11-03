"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Car, Clock, MapPin } from "lucide-react"
import { mockBookings, mockParkingSpots, mockTimeSlots } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function UserDashboard() {
  const { user } = useAuth()

  const userBookings = mockBookings.filter((b) => b.userId === user?.id)
  const activeBookings = userBookings.filter((b) => b.status === "active")
  const availableSpots = mockParkingSpots.filter((s) => s.status === "available")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Manage your parking bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBookings.length}</div>
            <p className="text-xs text-muted-foreground">{userBookings.length} total bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableSpots.length}</div>
            <p className="text-xs text-muted-foreground">Ready to book</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Action</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/bookings/new">
              <Button className="w-full">Book a Spot</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* My Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>My Active Bookings</CardTitle>
          <CardDescription>Your current parking reservations</CardDescription>
        </CardHeader>
        <CardContent>
          {activeBookings.length === 0 ? (
            <div className="text-center py-8">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No active bookings</p>
              <Link href="/bookings/new">
                <Button>Book Your First Spot</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((booking) => {
                const spot = mockParkingSpots.find((s) => s.id === booking.spotId)
                const timeSlot = mockTimeSlots.find((t) => t.id === booking.timeSlotId)
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{spot?.spotNumber}</p>
                        <p className="text-sm text-muted-foreground">{spot?.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {timeSlot?.startTime} - {timeSlot?.endTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Active
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Spots Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Parking Spots</CardTitle>
              <CardDescription>Browse and book available spots</CardDescription>
            </div>
            <Link href="/bookings/new">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableSpots.slice(0, 3).map((spot) => (
              <div key={spot.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{spot.spotNumber}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{spot.type}</span>
                </div>
                <p className="text-sm text-muted-foreground">{spot.location}</p>
                <p className="text-xs text-muted-foreground">{spot.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
