"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, MapPin } from "lucide-react"
import { mockParkingSpots } from "@/lib/mock-data"
import type { ParkingSpot } from "@/lib/types"
import { ParkingSpotDialog } from "./parking-spot-dialog"
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

export function ParkingSpotsList() {
  const [spots, setSpots] = useState<ParkingSpot[]>(mockParkingSpots)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSpot, setEditingSpot] = useState<ParkingSpot | null>(null)
  const [deletingSpot, setDeletingSpot] = useState<ParkingSpot | null>(null)
  const { toast } = useToast()

  const handleCreate = (spot: Omit<ParkingSpot, "id" | "createdAt">) => {
    const newSpot: ParkingSpot = {
      ...spot,
      id: String(spots.length + 1),
      createdAt: new Date(),
    }
    setSpots([...spots, newSpot])
    toast({
      title: "Success",
      description: "Parking spot created successfully",
    })
  }

  const handleUpdate = (updatedSpot: ParkingSpot) => {
    setSpots(spots.map((s) => (s.id === updatedSpot.id ? updatedSpot : s)))
    toast({
      title: "Success",
      description: "Parking spot updated successfully",
    })
  }

  const handleDelete = () => {
    if (deletingSpot) {
      setSpots(spots.filter((s) => s.id !== deletingSpot.id))
      toast({
        title: "Success",
        description: "Parking spot deleted successfully",
      })
      setDeletingSpot(null)
    }
  }

  const openEditDialog = (spot: ParkingSpot) => {
    setEditingSpot(spot)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingSpot(null)
  }

  const getStatusBadge = (status: ParkingSpot["status"]) => {
    const variants = {
      available: "default",
      occupied: "secondary",
      maintenance: "destructive",
    } as const

    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parking Spots Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage parking spots</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Parking Spot
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Parking Spots</CardTitle>
          <CardDescription>Total: {spots.length} spots</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Spot Number</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spots.map((spot) => (
                <TableRow key={spot.id}>
                  <TableCell className="font-medium">{spot.spotNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {spot.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{spot.type}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(spot.status)}</TableCell>
                  <TableCell className="max-w-xs truncate">{spot.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(spot)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeletingSpot(spot)}>
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

      <ParkingSpotDialog
        open={isDialogOpen}
        onOpenChange={closeDialog}
        spot={editingSpot}
        onSave={(spot) => {
          if (editingSpot) {
            handleUpdate({ ...spot, id: editingSpot.id, createdAt: editingSpot.createdAt })
          } else {
            handleCreate(spot)
          }
          closeDialog()
        }}
      />

      <AlertDialog open={!!deletingSpot} onOpenChange={() => setDeletingSpot(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete parking spot {deletingSpot?.spotNumber}. This action cannot be undone.
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
