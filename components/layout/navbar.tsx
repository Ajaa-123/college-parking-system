"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Car, LogOut, User, LayoutDashboard, Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <Car className="h-4 w-4 text-primary-foreground" />
          </div>
          <span>College Parking</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link href="/dashboard">
            <Button variant={isActive("/dashboard") ? "secondary" : "ghost"} size="sm">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          {user?.role === "admin" ? (
            <>
              <Link href="/admin/parking-spots">
                <Button variant={isActive("/admin/parking-spots") ? "secondary" : "ghost"} size="sm">
                  <MapPin className="mr-2 h-4 w-4" />
                  Parking Spots
                </Button>
              </Link>
              <Link href="/admin/time-slots">
                <Button variant={isActive("/admin/time-slots") ? "secondary" : "ghost"} size="sm">
                  <Clock className="mr-2 h-4 w-4" />
                  Time Slots
                </Button>
              </Link>
              <Link href="/admin/bookings">
                <Button variant={isActive("/admin/bookings") ? "secondary" : "ghost"} size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  All Bookings
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/my-bookings">
              <Button variant={isActive("/my-bookings") ? "secondary" : "ghost"} size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                My Bookings
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Welcome,</span>
                <span className="font-medium">{user.name}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{user.role}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
