"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ParkingSpot } from "@/lib/types"

interface ParkingSpotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spot: ParkingSpot | null
  onSave: (spot: Omit<ParkingSpot, "id" | "createdAt">) => void
}

export function ParkingSpotDialog({ open, onOpenChange, spot, onSave }: ParkingSpotDialogProps) {
  const [formData, setFormData] = useState({
    spotNumber: "",
    location: "",
    type: "4-wheeler" as "2-wheeler" | "4-wheeler",
    status: "available" as "available" | "occupied" | "maintenance",
    description: "",
  })

  useEffect(() => {
    if (spot) {
      setFormData({
        spotNumber: spot.spotNumber,
        location: spot.location,
        type: spot.type,
        status: spot.status,
        description: spot.description,
      })
    } else {
      setFormData({
        spotNumber: "",
        location: "",
        type: "4-wheeler",
        status: "available",
        description: "",
      })
    }
  }, [spot, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{spot ? "Edit Parking Spot" : "Create Parking Spot"}</DialogTitle>
            <DialogDescription>
              {spot ? "Update the parking spot details below." : "Add a new parking spot to the system."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="spotNumber">Spot Number</Label>
              <Input
                id="spotNumber"
                placeholder="A-101"
                value={formData.spotNumber}
                onChange={(e) => setFormData({ ...formData, spotNumber: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Building A - Ground Floor"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "2-wheeler" | "4-wheeler") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-wheeler">2-wheeler</SelectItem>
                  <SelectItem value="4-wheeler">4-wheeler</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "available" | "occupied" | "maintenance") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Near main entrance, covered parking..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{spot ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
