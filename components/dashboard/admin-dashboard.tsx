"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Calendar, Users, TrendingUp, Clock, MapPin } from "lucide-react"
import { mockBookings, mockParkingSpots, mockUsers } from "@/lib/mock-data"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AdminDashboard() {
  const totalSpots = mockParkingSpots.length
  const availableSpots = mockParkingSpots.filter((s) => s.status === "available").length
  const totalBookings = mockBookings.length
  const activeBookings = mockBookings.filter((b) => b.status === "active").length
  const totalUsers = mockUsers.filter((u) => u.role !== "admin").length

  // Mock analytics data
  const bookingsBySpot = [
    { spot: "A-101", bookings: 12 },
    { spot: "A-102", bookings: 18 },
    { spot: "B-201", bookings: 8 },
    { spot: "B-202", bookings: 6 },
    { spot: "C-301", bookings: 3 },
  ]

  const bookingsByHour = [
    { hour: "8AM", bookings: 15 },
    { hour: "10AM", bookings: 22 },
    { hour: "12PM", bookings: 28 },
    { hour: "2PM", bookings: 18 },
    { hour: "4PM", bookings: 12 },
    { hour: "6PM", bookings: 8 },
  ]

  const todaySchedule = mockBookings.slice(0, 3).map((booking) => {
    const spot = mockParkingSpots.find((s) => s.id === booking.spotId)
    const user = mockUsers.find((u) => u.id === booking.userId)
    return { booking, spot, user }
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage parking spots, bookings, and view analytics</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parking Spots</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpots}</div>
            <p className="text-xs text-muted-foreground">{availableSpots} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBookings}</div>
            <p className="text-xs text-muted-foreground">{totalBookings} total bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Students & Staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(((totalSpots - availableSpots) / totalSpots) * 100)}%</div>
            <p className="text-xs text-muted-foreground">Current utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage parking system resources</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href="/admin/parking-spots">
            <Button>
              <MapPin className="mr-2 h-4 w-4" />
              Manage Parking Spots
            </Button>
          </Link>
          <Link href="/admin/time-slots">
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Manage Time Slots
            </Button>
          </Link>
          <Link href="/admin/bookings">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              View All Bookings
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Tabs defaultValue="spots" className="space-y-4">
        <TabsList>
          <TabsTrigger value="spots">Most Booked Spots</TabsTrigger>
          <TabsTrigger value="hours">Peak Hours</TabsTrigger>
          <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="spots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Booked Parking Spots</CardTitle>
              <CardDescription>Total bookings by parking spot</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  bookings: {
                    label: "Bookings",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsBySpot}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="spot" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peak Booking Hours</CardTitle>
              <CardDescription>Bookings throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  bookings: {
                    label: "Bookings",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookingsByHour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="bookings" stroke="var(--color-bookings)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Current active bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySchedule.map(({ booking, spot, user }) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Car className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{spot?.spotNumber}</p>
                        <p className="text-sm text-muted-foreground">{spot?.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.role}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
