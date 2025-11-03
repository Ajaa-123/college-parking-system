export type UserRole = "student" | "staff" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
}

export interface ParkingSpot {
  id: string
  spotNumber: string
  location: string
  type: "2-wheeler" | "4-wheeler"
  status: "available" | "occupied" | "maintenance"
  description: string
  createdAt: Date
}

export interface TimeSlot {
  id: string
  spotId: string
  startTime: string
  endTime: string
  isAvailable: boolean
  createdAt: Date
}

export interface Booking {
  id: string
  userId: string
  spotId: string
  timeSlotId: string
  date: Date
  status: "active" | "completed" | "cancelled"
  createdAt: Date
}
