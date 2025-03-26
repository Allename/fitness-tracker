"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const goalsFormSchema = z.object({
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

type GoalsFormValues = z.infer<typeof goalsFormSchema>

const defaultValues: Partial<GoalsFormValues> = {
  primaryGoal: "strength",
  targetWeight: "70",
  weeklyWorkouts: "4",
  preferences: ["strength", "hiit"],
}

export function GoalsForm() {
  const { toast } = useToast()
  const form = useForm<GoalsFormValues>({
    resolver: zodResolver(goalsFormSchema),
    defaultValues,
  })

  function onSubmit(data: GoalsFormValues) {
    toast({
      title: "Goals updated successfully",
      description: "Your fitness goals have been updated.",
      action: (
        <Button variant="outline" size="sm" onClick={() => console.log("Undo")}>
          Undo
        </Button>
      ),
    })
    console.log(data)
  }

  function onReset() {
    form.reset()
    toast({
      title: "Goals reset",
      description: "Your fitness goals have been reset to default values.",
      action: (
        <Button variant="outline" size="sm" onClick={() => console.log("Undo")}>
          Undo
        </Button>
      ),
    })
  }

  const workoutPreferences = [
    {
      id: "strength",
      label: "Strength Training",
    },
    {
      id: "cardio",
      label: "Cardio",
    },
    {
      id: "hiit",
      label: "HIIT",
    },
    {
      id: "yoga",
      label: "Yoga",
    },
    {
      id: "running",
      label: "Running",
    },
    {
      id: "cycling",
      label: "Cycling",
    },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="primaryGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Goal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary fitness goal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="general-fitness">General Fitness</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>This will help us tailor your experience and recommendations.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="targetWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Weight (kg)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Your goal weight to achieve.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weeklyWorkouts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weekly Workouts</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>How many workouts you aim to complete each week.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="preferences"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Workout Preferences</FormLabel>
                <FormDescription>Select the types of workouts you enjoy.</FormDescription>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {workoutPreferences.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="preferences"
                    render={({ field }) => {
                      return (
                        <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), item.id])
                                  : field.onChange(field.value?.filter((value) => value !== item.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item.label}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit">Update Goals</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="outline">
                Reset Goals
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will reset all your fitness goals to their default values. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onReset}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </Form>
  )
}

