"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Car, Clock, XCircle } from "lucide-react"
import { mockBookings, mockParkingSpots, mockTimeSlots } from "@/lib/mock-data"
import type { Booking } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function MyBookingsList() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null)
  const { toast } = useToast()

  const userBookings = bookings.filter((b) => b.userId === user?.id)

  const handleCancel = () => {
    if (cancellingBooking) {
      setBookings(bookings.map((b) => (b.id === cancellingBooking.id ? { ...b, status: "cancelled" as const } : b)))
      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      })
      setCancellingBooking(null)
    }
  }

  const getSpotDetails = (spotId: string) => {
    return mockParkingSpots.find((s) => s.id === spotId)
  }

  const getTimeSlot = (timeSlotId: string) => {
    return mockTimeSlots.find((s) => s.id === timeSlotId)
  }

  const getStatusBadge = (status: Booking["status"]) => {
    const variants = {
      active: "default",
      completed: "secondary",
      cancelled: "destructive",
    } as const

    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your parking reservations</p>
        </div>
        <Link href="/bookings/new">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </Link>
      </div>

      {userBookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Car className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-4">Start by booking your first parking spot</p>
            <Link href="/bookings/new">
              <Button>Book a Spot</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {userBookings.map((booking) => {
            const spot = getSpotDetails(booking.spotId)
            const timeSlot = getTimeSlot(booking.timeSlotId)
            return (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{spot?.spotNumber}</CardTitle>
                        <CardDescription>{spot?.location}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Time Slot</p>
                        <p className="text-sm text-muted-foreground">
                          {timeSlot?.startTime} - {timeSlot?.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Vehicle Type</p>
                        <p className="text-sm text-muted-foreground">{spot?.type}</p>
                      </div>
                    </div>
                  </div>
                  {booking.status === "active" && (
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="destructive" size="sm" onClick={() => setCancellingBooking(booking)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Booking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <AlertDialog open={!!cancellingBooking} onOpenChange={() => setCancellingBooking(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>Cancel Booking</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
