"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar, Car, Clock, MapPin, ArrowRight, CheckCircle2 } from "lucide-react"
import { mockParkingSpots, mockTimeSlots, mockBookings } from "@/lib/mock-data"
import type { ParkingSpot, TimeSlot, Booking } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function NewBookingForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [vehicleType, setVehicleType] = useState<"2-wheeler" | "4-wheeler">("4-wheeler")

  const availableSpots = mockParkingSpots.filter((spot) => spot.status === "available" && spot.type === vehicleType)

  const availableTimeSlots = selectedSpot
    ? mockTimeSlots.filter((slot) => slot.spotId === selectedSpot.id && slot.isAvailable)
    : []

  const handleSpotSelect = (spot: ParkingSpot) => {
    setSelectedSpot(spot)
    setStep(2)
  }

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot)
    setStep(3)
  }

  const handleConfirmBooking = () => {
    if (!selectedSpot || !selectedTimeSlot || !user) return

    const newBooking: Booking = {
      id: String(mockBookings.length + 1),
      userId: user.id,
      spotId: selectedSpot.id,
      timeSlotId: selectedTimeSlot.id,
      date: new Date(selectedDate),
      status: "active",
      createdAt: new Date(),
    }

    mockBookings.push(newBooking)

    toast({
      title: "Success!",
      description: "Your parking spot has been booked successfully",
    })

    router.push("/my-bookings")
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book a Parking Spot</h1>
        <p className="text-muted-foreground">Select a spot, time slot, and confirm your booking</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
          </div>
          <span className={`text-sm font-medium ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
            Select Spot
          </span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {step > 2 ? <CheckCircle2 className="h-5 w-5" /> : "2"}
          </div>
          <span className={`text-sm font-medium ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
            Choose Time
          </span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            3
          </div>
          <span className={`text-sm font-medium ${step >= 3 ? "text-foreground" : "text-muted-foreground"}`}>
            Confirm
          </span>
        </div>
      </div>

      {/* Step 1: Select Parking Spot */}
      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Date and Vehicle Type</CardTitle>
              <CardDescription>Choose when you need parking and your vehicle type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Booking Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <RadioGroup value={vehicleType} onValueChange={(v) => setVehicleType(v as typeof vehicleType)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2-wheeler" id="2-wheeler" />
                      <Label htmlFor="2-wheeler" className="font-normal cursor-pointer">
                        2-Wheeler (Bike/Scooter)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4-wheeler" id="4-wheeler" />
                      <Label htmlFor="4-wheeler" className="font-normal cursor-pointer">
                        4-Wheeler (Car)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Parking Spots</CardTitle>
              <CardDescription>
                {availableSpots.length} {vehicleType} spots available
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableSpots.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No available spots for {vehicleType}</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {availableSpots.map((spot) => (
                    <Card
                      key={spot.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleSpotSelect(spot)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{spot.spotNumber}</CardTitle>
                          <Badge variant="outline">{spot.type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{spot.location}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{spot.description}</p>
                        <Button className="w-full mt-4" size="sm">
                          Select Spot
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Select Time Slot */}
      {step === 2 && selectedSpot && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Selected Parking Spot</CardTitle>
              <CardDescription>
                {selectedSpot.spotNumber} - {selectedSpot.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => setStep(1)}>
                Change Spot
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Time Slot</CardTitle>
              <CardDescription>Choose your preferred parking time</CardDescription>
            </CardHeader>
            <CardContent>
              {availableTimeSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No available time slots for this spot</p>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setStep(1)}>
                    Choose Different Spot
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {availableTimeSlots.map((slot) => (
                    <Card
                      key={slot.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleTimeSlotSelect(slot)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">
                            {slot.startTime} - {slot.endTime}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" size="sm">
                          Select Time
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Confirm Booking */}
      {step === 3 && selectedSpot && selectedTimeSlot && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Your Booking</CardTitle>
            <CardDescription>Review your booking details before confirming</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Parking Spot</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Car className="h-5 w-5 text-primary" />
                    <p className="font-semibold">{selectedSpot.spotNumber}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{selectedSpot.location}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vehicle Type</Label>
                  <p className="font-semibold mt-1">{selectedSpot.type}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-5 w-5 text-primary" />
                    <p className="font-semibold">{new Date(selectedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Time Slot</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-5 w-5 text-primary" />
                    <p className="font-semibold">
                      {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Booking Summary</p>
              <p className="font-semibold">
                {selectedSpot.spotNumber} on {new Date(selectedDate).toLocaleDateString()} from{" "}
                {selectedTimeSlot.startTime} to {selectedTimeSlot.endTime}
              </p>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleConfirmBooking} className="flex-1">
                Confirm Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
