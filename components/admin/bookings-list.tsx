"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, Calendar, Filter } from "lucide-react"
import { mockBookings, mockParkingSpots, mockUsers, mockTimeSlots } from "@/lib/mock-data"
import type { Booking } from "@/lib/types"
import { BookingDialog } from "./booking-dialog"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  const handleUpdate = (updatedBooking: Booking) => {
    setBookings(bookings.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)))
    toast({
      title: "Success",
      description: "Booking updated successfully",
    })
  }

  const handleDelete = () => {
    if (deletingBooking) {
      setBookings(bookings.filter((b) => b.id !== deletingBooking.id))
      toast({
        title: "Success",
        description: "Booking deleted successfully",
      })
      setDeletingBooking(null)
    }
  }

  const openEditDialog = (booking: Booking) => {
    setEditingBooking(booking)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingBooking(null)
  }

  const getUserName = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    return user ? user.name : "Unknown"
  }

  const getSpotName = (spotId: string) => {
    const spot = mockParkingSpots.find((s) => s.id === spotId)
    return spot ? spot.spotNumber : "Unknown"
  }

  const getTimeSlot = (timeSlotId: string) => {
    const slot = mockTimeSlots.find((s) => s.id === timeSlotId)
    return slot ? `${slot.startTime} - ${slot.endTime}` : "Unknown"
  }

  const getStatusBadge = (status: Booking["status"]) => {
    const variants = {
      active: "default",
      completed: "secondary",
      cancelled: "destructive",
    } as const

    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const filteredBookings = statusFilter === "all" ? bookings : bookings.filter((b) => b.status === statusFilter)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings Management</h1>
          <p className="text-muted-foreground">View, edit, and manage all parking bookings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                Total: {filteredBookings.length} {statusFilter !== "all" ? statusFilter : ""} bookings
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Parking Spot</TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{getUserName(booking.userId)}</TableCell>
                  <TableCell>{getSpotName(booking.spotId)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {getTimeSlot(booking.timeSlotId)}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(booking)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeletingBooking(booking)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BookingDialog
        open={isDialogOpen}
        onOpenChange={closeDialog}
        booking={editingBooking}
        onSave={(booking) => {
          if (editingBooking) {
            handleUpdate({ ...booking, id: editingBooking.id, createdAt: editingBooking.createdAt })
          }
          closeDialog()
        }}
      />

      <AlertDialog open={!!deletingBooking} onOpenChange={() => setDeletingBooking(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this booking. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
