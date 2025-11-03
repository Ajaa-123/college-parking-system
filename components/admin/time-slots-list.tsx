"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Clock } from "lucide-react"
import { mockTimeSlots, mockParkingSpots } from "@/lib/mock-data"
import type { TimeSlot } from "@/lib/types"
import { TimeSlotDialog } from "./time-slot-dialog"
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

export function TimeSlotsList() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(mockTimeSlots)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null)
  const [deletingSlot, setDeletingSlot] = useState<TimeSlot | null>(null)
  const { toast } = useToast()

  const handleCreate = (slot: Omit<TimeSlot, "id" | "createdAt">) => {
    const newSlot: TimeSlot = {
      ...slot,
      id: String(timeSlots.length + 1),
      createdAt: new Date(),
    }
    setTimeSlots([...timeSlots, newSlot])
    toast({
      title: "Success",
      description: "Time slot created successfully",
    })
  }

  const handleUpdate = (updatedSlot: TimeSlot) => {
    setTimeSlots(timeSlots.map((s) => (s.id === updatedSlot.id ? updatedSlot : s)))
    toast({
      title: "Success",
      description: "Time slot updated successfully",
    })
  }

  const handleDelete = () => {
    if (deletingSlot) {
      setTimeSlots(timeSlots.filter((s) => s.id !== deletingSlot.id))
      toast({
        title: "Success",
        description: "Time slot deleted successfully",
      })
      setDeletingSlot(null)
    }
  }

  const openEditDialog = (slot: TimeSlot) => {
    setEditingSlot(slot)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingSlot(null)
  }

  const getSpotName = (spotId: string) => {
    const spot = mockParkingSpots.find((s) => s.id === spotId)
    return spot ? spot.spotNumber : "Unknown"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Slots Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage time slots for parking spots</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Time Slot
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Time Slots</CardTitle>
          <CardDescription>Total: {timeSlots.length} time slots</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parking Spot</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map((slot) => {
                const duration =
                  Number.parseInt(slot.endTime.split(":")[0]) - Number.parseInt(slot.startTime.split(":")[0])
                return (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium">{getSpotName(slot.spotId)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {slot.startTime}
                      </div>
                    </TableCell>
                    <TableCell>{slot.endTime}</TableCell>
                    <TableCell>{duration} hours</TableCell>
                    <TableCell>
                      {slot.isAvailable ? (
                        <Badge variant="default">Available</Badge>
                      ) : (
                        <Badge variant="secondary">Booked</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(slot)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeletingSlot(slot)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TimeSlotDialog
        open={isDialogOpen}
        onOpenChange={closeDialog}
        slot={editingSlot}
        onSave={(slot) => {
          if (editingSlot) {
            handleUpdate({ ...slot, id: editingSlot.id, createdAt: editingSlot.createdAt })
          } else {
            handleCreate(slot)
          }
          closeDialog()
        }}
      />

      <AlertDialog open={!!deletingSlot} onOpenChange={() => setDeletingSlot(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this time slot. This action cannot be undone.
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
