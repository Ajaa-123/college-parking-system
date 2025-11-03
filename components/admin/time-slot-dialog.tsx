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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { TimeSlot } from "@/lib/types"
import { mockParkingSpots } from "@/lib/mock-data"

interface TimeSlotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slot: TimeSlot | null
  onSave: (slot: Omit<TimeSlot, "id" | "createdAt">) => void
}

export function TimeSlotDialog({ open, onOpenChange, slot, onSave }: TimeSlotDialogProps) {
  const [formData, setFormData] = useState({
    spotId: "",
    startTime: "",
    endTime: "",
    isAvailable: true,
  })

  useEffect(() => {
    if (slot) {
      setFormData({
        spotId: slot.spotId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable,
      })
    } else {
      setFormData({
        spotId: mockParkingSpots[0]?.id || "",
        startTime: "",
        endTime: "",
        isAvailable: true,
      })
    }
  }, [slot, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{slot ? "Edit Time Slot" : "Create Time Slot"}</DialogTitle>
            <DialogDescription>
              {slot ? "Update the time slot details below." : "Add a new time slot to a parking spot."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="spotId">Parking Spot</Label>
              <Select value={formData.spotId} onValueChange={(value) => setFormData({ ...formData, spotId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a parking spot" />
                </SelectTrigger>
                <SelectContent>
                  {mockParkingSpots.map((spot) => (
                    <SelectItem key={spot.id} value={spot.id}>
                      {spot.spotNumber} - {spot.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isAvailable">Available for Booking</Label>
              <Switch
                id="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{slot ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
