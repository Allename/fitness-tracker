"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { CalendarIcon, Clock, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const workoutFormSchema = z.object({
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

type WorkoutFormValues = z.infer<typeof workoutFormSchema>

const defaultValues: Partial<WorkoutFormValues> = {
  date: new Date(),
  exercises: [{ name: "", sets: "", reps: "", weight: "" }],
  notes: "",
}

interface WorkoutFormProps {
  onSuccess?: () => void
}

export function WorkoutForm({ onSuccess }: WorkoutFormProps) {
  const { toast } = useToast()
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues,
  })

  function onSubmit(data: WorkoutFormValues) {
    toast({
      title: "Workout logged successfully",
      description: `${data.type} workout on ${format(data.date, "PPP")}`,
      action: (
        <Button variant="outline" size="sm" onClick={() => console.log("Undo")}>
          Undo
        </Button>
      ),
    })
    console.log(data)
    if (onSuccess) {
      onSuccess()
    }
  }

  const addExercise = () => {
    const currentExercises = form.getValues("exercises") || []
    form.setValue("exercises", [...currentExercises, { name: "", sets: "", reps: "", weight: "" }])
  }

  const removeExercise = (index: number) => {
    const currentExercises = form.getValues("exercises") || []
    if (currentExercises.length > 1) {
      form.setValue(
        "exercises",
        currentExercises.filter((_, i) => i !== index),
      )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workout Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a workout type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="strength">Strength Training</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="hiit">HIIT</SelectItem>
                    <SelectItem value="yoga">Yoga</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="cycling">Cycling</SelectItem>
                    <SelectItem value="swimming">Swimming</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <div className="flex items-center">
                <FormControl>
                  <Input {...field} placeholder="e.g. 45 min" />
                </FormControl>
                <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <div className="flex items-center justify-between mb-4">
            <FormLabel className="text-base">Exercises</FormLabel>
            <Button type="button" variant="outline" size="sm" onClick={addExercise}>
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </div>
          {form.watch("exercises")?.map((_, index) => (
            <div key={index} className="grid gap-4 mb-4 p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Exercise {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExercise(index)}
                  disabled={form.watch("exercises")?.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <FormField
                control={form.control}
                name={`exercises.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Bench Press" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name={`exercises.${index}.sets`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sets</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`exercises.${index}.reps`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reps</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`exercises.${index}.weight`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 50kg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          {form.formState.errors.exercises?.message && (
            <p className="text-sm font-medium text-destructive">{form.formState.errors.exercises?.message}</p>
          )}
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes about your workout"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Log Workout</Button>
      </form>
    </Form>
  )
}

