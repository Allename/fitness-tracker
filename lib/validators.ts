import { z } from "zod"

export const workoutFormSchema = z.object({
  type: z.string({
    required_error: "Please select a workout type",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  duration: z.string().min(1, "Please enter a duration"),
  exercises: z
    .array(
      z.object({
        name: z.string().min(1, "Exercise name is required"),
        sets: z.string().optional(),
        reps: z.string().optional(),
        weight: z.string().optional(),
      }),
    )
    .min(1, "Add at least one exercise"),
  notes: z.string().optional(),
})

export const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160).optional(),
  age: z.string().refine((val) => !val || !isNaN(Number.parseInt(val)), {
    message: "Please enter a valid age.",
  }),
  height: z.string().refine((val) => !val || !isNaN(Number.parseFloat(val)), {
    message: "Please enter a valid height.",
  }),
  weight: z.string().refine((val) => !val || !isNaN(Number.parseFloat(val)), {
    message: "Please enter a valid weight.",
  }),
  fitnessLevel: z.string({
    required_error: "Please select a fitness level.",
  }),
})

export const goalsFormSchema = z.object({
  primaryGoal: z.string({
    required_error: "Please select a primary goal.",
  }),
  targetWeight: z.string().refine((val) => !val || !isNaN(Number.parseFloat(val)), {
    message: "Please enter a valid target weight.",
  }),
  weeklyWorkouts: z.string().refine((val) => !val || !isNaN(Number.parseInt(val)), {
    message: "Please enter a valid number of workouts.",
  }),
  preferences: z.array(z.string()).optional(),
})

export const challengeFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  startDate: z.date({
    required_error: "Please select a start date.",
  }),
  endDate: z.date({
    required_error: "Please select an end date.",
  }),
  type: z.string({
    required_error: "Please select a challenge type.",
  }),
  goal: z.string().min(1, "Please enter a goal"),
  isPublic: z.boolean().default(true),
})

