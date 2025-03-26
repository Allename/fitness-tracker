"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserNav } from "@/components/dashboard/user-nav"
import { CalendarDays, Home, Menu, Trophy, User, Dumbbell } from "lucide-react"

export function DashboardHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className={`flex items-center gap-2 ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/challenges"
              className={`flex items-center gap-2 ${pathname === "/challenges" ? "text-primary" : "text-muted-foreground"}`}
            >
              <Trophy className="h-5 w-5" />
              <span>Challenges</span>
            </Link>
            <Link
              href="/workouts"
              className={`flex items-center gap-2 ${pathname === "/workouts" ? "text-primary" : "text-muted-foreground"}`}
            >
              <CalendarDays className="h-5 w-5" />
              <span>Workouts</span>
            </Link>
            <Link
              href="/profile"
              className={`flex items-center gap-2 ${pathname === "/profile" ? "text-primary" : "text-muted-foreground"}`}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Dumbbell className="h-6 w-6" />
        <span>FitTrack</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 md:gap-6">
        <Link
          href="/"
          className={`hidden md:flex items-center gap-2 text-sm font-medium ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/challenges"
          className={`hidden md:flex items-center gap-2 text-sm font-medium ${pathname === "/challenges" ? "text-primary" : "text-muted-foreground"}`}
        >
          <Trophy className="h-4 w-4" />
          <span>Challenges</span>
        </Link>
        <Link
          href="/workouts"
          className={`hidden md:flex items-center gap-2 text-sm font-medium ${pathname === "/workouts" ? "text-primary" : "text-muted-foreground"}`}
        >
          <CalendarDays className="h-4 w-4" />
          <span>Workouts</span>
        </Link>
        <UserNav />
      </nav>
    </header>
  )
}

