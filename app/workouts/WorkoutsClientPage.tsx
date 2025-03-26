"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CalendarIcon, Plus, Search, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Define the workout form schema using Zod
const workoutFormSchema = z.object({
  type: z.string({
    required_error: "Please select a workout type",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  duration: z.string().refine((val) => /^\d+$/.test(val), {
    message: "Duration must contain only numbers",
  }),
  exercises: z
    .array(
      z.object({
        name: z.string().min(1, "Exercise name is required"),
        sets: z.string().refine((val) => !val || /^\d+$/.test(val), {
          message: "Sets must contain only numbers",
        }),
        reps: z.string().refine((val) => !val || /^\d+$/.test(val), {
          message: "Reps must contain only numbers",
        }),
        weight: z.string().refine((val) => !val || /^\d+$/.test(val), {
          message: "Weight must contain only numbers",
        }),
      }),
    )
    .min(1, "Add at least one exercise"),
  notes: z.string().optional(),
})

type WorkoutFormValues = z.infer<typeof workoutFormSchema>

export default function WorkoutsClientPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("history")
  const [showWorkoutForm, setShowWorkoutForm] = useState(false)
  const [viewingWorkout, setViewingWorkout] = useState<{ title: string; date: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [workouts, setWorkouts] = useState<WorkoutCardProps[]>([
    {
      title: "Strength Training",
      date: "Today, 9:30 AM",
      duration: "45 min",
      exercises: ["Bench Press", "Squats", "Deadlifts", "Pull-ups"],
    },
    {
      title: "Running",
      date: "Yesterday, 6:15 PM",
      duration: "30 min",
      exercises: ["5K Run"],
      metrics: [
        { name: "Distance", value: "5 km" },
        { name: "Pace", value: "6:00 min/km" },
      ],
    },
    {
      title: "Yoga",
      date: "Yesterday, 8:00 AM",
      duration: "60 min",
      exercises: ["Sun Salutation", "Warrior Poses", "Balance Poses"],
    },
    {
      title: "Cycling",
      date: "2 days ago, 5:30 PM",
      duration: "45 min",
      exercises: ["Outdoor Cycling"],
      metrics: [
        { name: "Distance", value: "15 km" },
        { name: "Avg. Speed", value: "20 km/h" },
      ],
    },
    {
      title: "Swimming",
      date: "3 days ago, 7:00 AM",
      duration: "40 min",
      exercises: ["Freestyle", "Breaststroke"],
      metrics: [
        { name: "Distance", value: "1000 m" },
        { name: "Laps", value: "20" },
      ],
    },
  ])
  const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutCardProps[]>([])
  const [monthlyStats, setMonthlyStats] = useState({
    totalWorkouts: 24,
    thisMonth: 12,
    avgDuration: "42 min",
    mostCommon: "Strength",
  })

  // Filter workouts based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredWorkouts(workouts)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = workouts.filter(
        (workout) =>
          workout.title.toLowerCase().includes(query) ||
          workout.exercises.some((exercise) => exercise.toLowerCase().includes(query)),
      )
      setFilteredWorkouts(filtered)
    }
  }, [searchQuery, workouts])

  // Initialize filtered workouts with all workouts
  useEffect(() => {
    setFilteredWorkouts(workouts)
  }, [workouts])

  // Find the handleAddWorkout function and update it to capitalize the first letter of the workout type
  const handleAddWorkout = (workout: any, isTemplate = false) => {
    // Capitalize the first letter of the workout type
    const capitalizedType = workout.type.charAt(0).toUpperCase() + workout.type.slice(1)

    const newWorkout = {
      title: capitalizedType,
      date: "Just now",
      duration: `${workout.duration} min`,
      exercises: workout.exercises.map((ex: any) => ex.name),
    }

    const updatedWorkouts = [newWorkout, ...workouts]
    setWorkouts(updatedWorkouts)

    // Update monthly stats
    setMonthlyStats({
      totalWorkouts: monthlyStats.totalWorkouts + 1,
      thisMonth: monthlyStats.thisMonth + 1,
      avgDuration: `${Math.round((Number.parseInt(monthlyStats.avgDuration) * monthlyStats.thisMonth + Number.parseInt(workout.duration)) / (monthlyStats.thisMonth + 1))} min`,
      mostCommon: getMostCommonWorkoutType(updatedWorkouts),
    })

    setShowWorkoutForm(false)

    // Switch to history tab if using a template
    if (isTemplate) {
      setActiveTab("history")
    }

    // Show success toast notification with appropriate message
    toast({
      title: isTemplate ? "Template workout logged" : "Workout logged successfully",
      description: isTemplate
        ? `A ${capitalizedType} workout has been added to your history using this template.`
        : `Your ${capitalizedType} workout has been added to your history.`,
    })
  }

  const getMostCommonWorkoutType = (workoutList: WorkoutCardProps[]) => {
    const typeCounts: Record<string, number> = {}
    workoutList.forEach((workout) => {
      typeCounts[workout.title] = (typeCounts[workout.title] || 0) + 1
    })

    let mostCommon = ""
    let highestCount = 0

    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > highestCount) {
        mostCommon = type
        highestCount = count
      }
    })

    return mostCommon
  }

  const handleUseTemplate = (template: any) => {
    setShowWorkoutForm(true)
    // We'll pass the template data to the form
    // This will be handled by the SimpleWorkoutForm component
  }

  // Generate calendar data for visualization
  const generateCalendarData = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    // Create an array of dates for the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const calendarDays = []

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)
      // Randomly assign workouts to some days for demonstration
      const hasWorkout = Math.random() > 0.6
      calendarDays.push({
        date,
        hasWorkout,
        intensity: hasWorkout ? Math.floor(Math.random() * 3) + 1 : 0, // 0: none, 1: light, 2: medium, 3: intense
      })
    }

    return calendarDays
  }

  const calendarData = generateCalendarData()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div className="grid gap-1">
            <h1 className="font-bold text-2xl md:text-3xl">Workouts</h1>
            <p className="text-muted-foreground">Log and track your workout sessions</p>
          </div>
          <div className="ml-auto flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search workouts..."
                className="w-full pl-8 md:w-[200px] lg:w-[320px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowWorkoutForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Log Workout
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto pb-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 overflow-x-auto">
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="space-y-4">
              {filteredWorkouts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredWorkouts.map((workout, index) => (
                    <WorkoutCard
                      key={index}
                      {...workout}
                      onViewDetails={() => setViewingWorkout({ title: workout.title, date: workout.date })}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-muted-foreground mb-2">No workouts found matching your search.</p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Full Body Workout</CardTitle>
                    <CardDescription>Comprehensive full body routine</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="outline" className="mr-1">
                        Strength
                      </Badge>
                      <Badge variant="outline">45-60 min</Badge>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Exercises:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Bench Press: 3 sets x 10 reps</li>
                          <li>Squats: 3 sets x 12 reps</li>
                          <li>Deadlifts: 3 sets x 8 reps</li>
                          <li>Pull-ups: 3 sets x 8 reps</li>
                          <li>Shoulder Press: 3 sets x 10 reps</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        const template = {
                          type: "strength",
                          date: new Date(),
                          duration: "45",
                          exercises: [
                            { name: "Bench Press", sets: "3", reps: "10", weight: "70" },
                            { name: "Squats", sets: "3", reps: "12", weight: "90" },
                            { name: "Deadlifts", sets: "3", reps: "8", weight: "100" },
                            { name: "Pull-ups", sets: "3", reps: "8", weight: "0" },
                            { name: "Shoulder Press", sets: "3", reps: "10", weight: "40" },
                          ],
                          notes: "Full body workout template",
                        }
                        handleAddWorkout(template, true)
                      }}
                    >
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>HIIT Cardio</CardTitle>
                    <CardDescription>High-intensity interval training</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="outline" className="mr-1">
                        Cardio
                      </Badge>
                      <Badge variant="outline">30 min</Badge>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Exercises:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Jumping Jacks: 45 sec</li>
                          <li>Mountain Climbers: 45 sec</li>
                          <li>Burpees: 45 sec</li>
                          <li>High Knees: 45 sec</li>
                          <li>Rest: 15 sec between exercises</li>
                          <li>Repeat 4 times</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        const template = {
                          type: "hiit",
                          date: new Date(),
                          duration: "30",
                          exercises: [
                            { name: "Jumping Jacks", sets: "4", reps: "45 sec", weight: "" },
                            { name: "Mountain Climbers", sets: "4", reps: "45 sec", weight: "" },
                            { name: "Burpees", sets: "4", reps: "45 sec", weight: "" },
                            { name: "High Knees", sets: "4", reps: "45 sec", weight: "" },
                          ],
                          notes: "HIIT cardio workout with 15 sec rest between exercises",
                        }
                        handleAddWorkout(template, true)
                      }}
                    >
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Upper Body Focus</CardTitle>
                    <CardDescription>Chest, back, shoulders, and arms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="outline" className="mr-1">
                        Strength
                      </Badge>
                      <Badge variant="outline">40 min</Badge>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Exercises:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Push-ups: 3 sets x 15 reps</li>
                          <li>Dumbbell Rows: 3 sets x 12 reps</li>
                          <li>Shoulder Press: 3 sets x 10 reps</li>
                          <li>Bicep Curls: 3 sets x 12 reps</li>
                          <li>Tricep Dips: 3 sets x 12 reps</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        const template = {
                          type: "strength",
                          date: new Date(),
                          duration: "40",
                          exercises: [
                            { name: "Push-ups", sets: "3", reps: "15", weight: "" },
                            { name: "Dumbbell Rows", sets: "3", reps: "12", weight: "20" },
                            { name: "Shoulder Press", sets: "3", reps: "10", weight: "15" },
                            { name: "Bicep Curls", sets: "3", reps: "12", weight: "12" },
                            { name: "Tricep Dips", sets: "3", reps: "12", weight: "" },
                          ],
                          notes: "Upper body focus workout",
                        }
                        handleAddWorkout(template, true)
                      }}
                    >
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Workout Statistics</CardTitle>
                  <CardDescription>Your workout trends and statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Workouts</p>
                      <p className="text-3xl font-bold">{monthlyStats.totalWorkouts}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">This Month</p>
                      <p className="text-3xl font-bold">{monthlyStats.thisMonth}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Avg. Duration</p>
                      <p className="text-3xl font-bold">{monthlyStats.avgDuration}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Most Common</p>
                      <p className="text-3xl font-bold">{monthlyStats.mostCommon}</p>
                    </div>
                  </div>

                  {/* Workout Calendar Visualization */}
                  <div className="mt-8 border rounded-md p-4">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                      Workout Calendar
                    </h3>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-xs font-medium text-muted-foreground">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {/* Fill in empty cells for days before the 1st of the month */}
                      {Array.from({
                        length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay(),
                      }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-10 rounded-md"></div>
                      ))}

                      {/* Calendar days */}
                      {calendarData.map((day, i) => (
                        <div
                          key={i}
                          className={`h-10 rounded-md flex items-center justify-center text-sm relative ${
                            day.hasWorkout
                              ? day.intensity === 1
                                ? "bg-primary/10"
                                : day.intensity === 2
                                  ? "bg-primary/20"
                                  : "bg-primary/30"
                              : "hover:bg-muted/50"
                          } ${
                            day.date.getDate() === new Date().getDate() &&
                            day.date.getMonth() === new Date().getMonth() &&
                            day.date.getFullYear() === new Date().getFullYear()
                              ? "border-2 border-primary"
                              : ""
                          }`}
                        >
                          {day.date.getDate()}
                          {day.hasWorkout && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"></div>}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary/10 mr-1"></div>
                        <span>Light</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary/20 mr-1"></div>
                        <span>Medium</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary/30 mr-1"></div>
                        <span>Intense</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/analytics">View Detailed Analytics</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Dialog open={showWorkoutForm} onOpenChange={setShowWorkoutForm}>
        <DialogContent className="max-w-md sm:max-w-lg w-[90%] mx-auto rounded-lg">
          <DialogHeader>
            <DialogTitle>Log Workout</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            <SimpleWorkoutForm onSuccess={handleAddWorkout} />
          </div>
        </DialogContent>
      </Dialog>

      {viewingWorkout && (
        <Dialog open={!!viewingWorkout} onOpenChange={() => setViewingWorkout(null)}>
          <DialogContent className="max-w-md sm:max-w-lg w-[90%] mx-auto rounded-lg">
            <DialogHeader>
              <DialogTitle>{viewingWorkout.title}</DialogTitle>
              <DialogDescription>{viewingWorkout.date}</DialogDescription>
            </DialogHeader>
            <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-1">
              <div className="py-3">
                <div className="mt-2 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Exercise Details:</h4>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-md">
                        <div className="font-medium">Bench Press</div>
                        <div className="text-sm text-muted-foreground">3 sets x 10 reps x 70kg</div>
                      </div>
                      <div className="p-3 border rounded-md">
                        <div className="font-medium">Squats</div>
                        <div className="text-sm text-muted-foreground">3 sets x 12 reps x 90kg</div>
                      </div>
                      <div className="p-3 border rounded-md">
                        <div className="font-medium">Deadlifts</div>
                        <div className="text-sm text-muted-foreground">3 sets x 8 reps x 100kg</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Notes:</h4>
                    <p className="text-sm text-muted-foreground">
                      Felt strong today. Increased weight on bench press by 5kg.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setViewingWorkout(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface WorkoutCardProps {
  title: string
  date: string
  duration: string
  exercises: string[]
  metrics?: { name: string; value: string }[]
  onViewDetails?: () => void
}

function WorkoutCard({ title, date, duration, exercises, metrics, onViewDetails }: WorkoutCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge variant="outline">{duration}</Badge>
        </div>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm font-medium">Exercises:</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            {exercises.map((exercise, index) => (
              <li key={index}>{exercise}</li>
            ))}
          </ul>
        </div>
        {metrics && metrics.length > 0 && (
          <div className="pt-2">
            <p className="text-sm font-medium">Metrics:</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{metric.name}:</span>
                  <span className="text-sm font-medium">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="w-full" onClick={onViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

// Simple workout form with Zod validation
function SimpleWorkoutForm({ onSuccess }: { onSuccess?: (data: any) => void }) {
  const { toast } = useToast()
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    type: "",
    date: new Date().toISOString().split("T")[0],
    duration: "",
    exercises: [{ name: "", sets: "", reps: "", weight: "" }],
    notes: "",
  })

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: "", sets: "", reps: "", weight: "" }],
    })
  }

  const removeExercise = (index: number) => {
    if (formData.exercises.length > 1) {
      setFormData({
        ...formData,
        exercises: formData.exercises.filter((_, i) => i !== index),
      })
    }
  }

  const updateExercise = (index: number, field: string, value: string) => {
    // For numeric fields, only allow numbers
    if ((field === "sets" || field === "reps" || field === "weight") && value !== "") {
      if (!/^\d+$/.test(value)) {
        return
      }
    }

    const updatedExercises = [...formData.exercises]
    updatedExercises[index] = { ...updatedExercises[index], [field]: value }
    setFormData({
      ...formData,
      exercises: updatedExercises,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // For duration field, only allow numbers
    if (name === "duration" && value !== "") {
      if (!/^\d+$/.test(value)) {
        return
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    try {
      // Convert string date to Date object for Zod validation
      const dataToValidate = {
        ...formData,
        date: new Date(formData.date),
      }

      workoutFormSchema.parse(dataToValidate)
      return true
    } catch (error: any) {
      if (error.errors) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          const path = err.path.join(".")
          newErrors[path] = err.message
        })
        setFormErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      if (onSuccess) {
        onSuccess(formData)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Workout Type</label>
          <select
            name="type"
            className={`w-full rounded-md border ${formErrors.type ? "border-destructive" : "border-input"} bg-background px-3 py-2`}
            value={formData.type}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select a workout type
            </option>
            <option value="strength">Strength Training</option>
            <option value="cardio">Cardio</option>
            <option value="hiit">HIIT</option>
            <option value="yoga">Yoga</option>
            <option value="running">Running</option>
            <option value="cycling">Cycling</option>
            <option value="swimming">Swimming</option>
            <option value="other">Other</option>
          </select>
          {formErrors.type && <p className="text-sm text-destructive">{formErrors.type}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            className={`w-full rounded-md border ${formErrors.date ? "border-destructive" : "border-input"} bg-background px-3 py-2`}
            value={formData.date}
            onChange={handleChange}
          />
          {formErrors.date && <p className="text-sm text-destructive">{formErrors.date}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Duration (minutes)</label>
        <input
          type="text"
          name="duration"
          className={`w-full rounded-md border ${formErrors.duration ? "border-destructive" : "border-input"} bg-background px-3 py-2`}
          placeholder="e.g. 45"
          value={formData.duration}
          onChange={handleChange}
        />
        {formErrors.duration && <p className="text-sm text-destructive">{formErrors.duration}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-base font-medium">Exercises</label>
          <Button type="button" variant="outline" size="sm" onClick={addExercise}>
            <Plus className="mr-2 h-4 w-4" />
            Add Exercise
          </Button>
        </div>

        {formData.exercises.map((exercise, index) => (
          <div key={index} className="grid gap-4 mb-4 p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Exercise {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExercise(index)}
                disabled={formData.exercises.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                className={`w-full rounded-md border ${formErrors[`exercises.${index}.name`] ? "border-destructive" : "border-input"} bg-background px-3 py-2`}
                placeholder="e.g. Bench Press"
                value={exercise.name}
                onChange={(e) => updateExercise(index, "name", e.target.value)}
              />
              {formErrors[`exercises.${index}.name`] && (
                <p className="text-sm text-destructive">{formErrors[`exercises.${index}.name`]}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sets</label>
                <input
                  type="text"
                  className={`w-full rounded-md border ${formErrors[`exercises.${index}.sets`] ? "border-destructive" : "border-input"} bg-background px-3 py-2`}
                  placeholder="e.g. 3"
                  value={exercise.sets}
                  onChange={(e) => updateExercise(index, "sets", e.target.value)}
                />
                {formErrors[`exercises.${index}.sets`] && (
                  <p className="text-sm text-destructive">{formErrors[`exercises.${index}.sets`]}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reps</label>
                <input
                  type="text"
                  className={`w-full rounded-md border ${formErrors[`exercises.${index}.reps`] ? "border-destructive" : "border-input"} bg-background px-3 py-2`}
                  placeholder="e.g. 10"
                  value={exercise.reps}
                  onChange={(e) => updateExercise(index, "reps", e.target.value)}
                />
                {formErrors[`exercises.${index}.reps`] && (
                  <p className="text-sm text-destructive">{formErrors[`exercises.${index}.reps`]}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Weight</label>
                <input
                  type="text"
                  className={`w-full rounded-md border ${formErrors[`exercises.${index}.weight`] ? "border-destructive" : "border-input"} bg-background px-3 py-2`}
                  placeholder="e.g. 50"
                  value={exercise.weight}
                  onChange={(e) => updateExercise(index, "weight", e.target.value)}
                />
                {formErrors[`exercises.${index}.weight`] && (
                  <p className="text-sm text-destructive">{formErrors[`exercises.${index}.weight`]}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {formErrors.exercises && <p className="text-sm text-destructive">{formErrors.exercises}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Textarea
          name="notes"
          className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
          placeholder="Add any additional notes about your workout"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <Button type="submit">Log Workout</Button>
    </form>
  )
}

