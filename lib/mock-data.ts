import type { User, ParkingSpot, TimeSlot, Booking } from "./types"

// Mock users - password for all is "password123"
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@college.edu",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "student@college.edu",
    name: "John Student",
    role: "student",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    email: "staff@college.edu",
    name: "Jane Staff",
    role: "staff",
    createdAt: new Date("2024-01-10"),
  },
]

export const mockParkingSpots: ParkingSpot[] = [
  {
    id: "1",
    spotNumber: "A-101",
    location: "Building A - Ground Floor",
    type: "4-wheeler",
    status: "available",
    description: "Near main entrance",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    spotNumber: "A-102",
    location: "Building A - Ground Floor",
    type: "4-wheeler",
    status: "occupied",
    description: "Covered parking",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    spotNumber: "B-201",
    location: "Building B - First Floor",
    type: "2-wheeler",
    status: "available",
    description: "Two-wheeler section",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    spotNumber: "B-202",
    location: "Building B - First Floor",
    type: "2-wheeler",
    status: "available",
    description: "Two-wheeler section",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    spotNumber: "C-301",
    location: "Building C - Basement",
    type: "4-wheeler",
    status: "maintenance",
    description: "Under maintenance",
    createdAt: new Date("2024-01-01"),
  },
]

export const mockTimeSlots: TimeSlot[] = [
  {
    id: "1",
    spotId: "1",
    startTime: "08:00",
    endTime: "12:00",
    isAvailable: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    spotId: "1",
    startTime: "12:00",
    endTime: "16:00",
    isAvailable: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    spotId: "1",
    startTime: "16:00",
    endTime: "20:00",
    isAvailable: false,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    spotId: "2",
    startTime: "08:00",
    endTime: "12:00",
    isAvailable: false,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    spotId: "3",
    startTime: "08:00",
    endTime: "12:00",
    isAvailable: true,
    createdAt: new Date("2024-01-01"),
  },
]

export const mockBookings: Booking[] = [
  {
    id: "1",
    userId: "2",
    spotId: "2",
    timeSlotId: "4",
    date: new Date(),
    status: "active",
    createdAt: new Date(),
  },
  {
    id: "2",
    userId: "3",
    spotId: "1",
    timeSlotId: "3",
    date: new Date(),
    status: "active",
    createdAt: new Date(),
  },
]
