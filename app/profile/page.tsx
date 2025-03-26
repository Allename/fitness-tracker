import type React from "react"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileForm } from "@/components/profile/profile-form"
import { GoalsForm } from "@/components/profile/goals-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Medal, Target, Trophy, Dumbbell, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Profile | FitTrack",
  description: "Manage your profile and fitness goals",
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="md:col-span-2 lg:col-span-4">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" alt="User avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle>John Doe</CardTitle>
                  <CardDescription>Member since January 2023</CardDescription>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      <span>12 Challenges Completed</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      <span>21 Day Streak Record</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Medal className="h-3 w-3" />
                      <span>Fitness Enthusiast</span>
                    </Badge>
                  </div>
                </div>
                <Button className="md:ml-auto">Edit Profile</Button>
              </div>
            </CardHeader>
          </Card>
        </div>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fitness Goals</CardTitle>
                <CardDescription>Set and track your fitness goals</CardDescription>
              </CardHeader>
              <CardContent>
                <GoalsForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your fitness journey milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <AchievementCard
                    title="Consistency Champion"
                    description="Completed workouts for 7 consecutive days"
                    date="Earned on March 15, 2023"
                    icon={<CalendarDays className="h-8 w-8" />}
                    unlocked={true}
                  />
                  <AchievementCard
                    title="Challenge Conqueror"
                    description="Successfully completed 5 fitness challenges"
                    date="Earned on April 22, 2023"
                    icon={<Trophy className="h-8 w-8" />}
                    unlocked={true}
                  />
                  <AchievementCard
                    title="Goal Getter"
                    description="Reached your first fitness goal"
                    date="Earned on February 10, 2023"
                    icon={<Target className="h-8 w-8" />}
                    unlocked={true}
                  />
                  <AchievementCard
                    title="Marathon Finisher"
                    description="Completed your first marathon"
                    icon={<Medal className="h-8 w-8" />}
                    unlocked={false}
                  />
                  <AchievementCard
                    title="Strength Master"
                    description="Lifted 100kg in any exercise"
                    icon={<Dumbbell className="h-8 w-8" />}
                    unlocked={false}
                  />
                  <AchievementCard
                    title="Social Butterfly"
                    description="Invited 5 friends to join the platform"
                    icon={<Users className="h-8 w-8" />}
                    unlocked={false}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

interface AchievementCardProps {
  title: string
  description: string
  date?: string
  icon: React.ReactNode
  unlocked: boolean
}

function AchievementCard({ title, description, date, icon, unlocked }: AchievementCardProps) {
  return (
    <div className={`flex flex-col gap-2 rounded-lg border p-4 ${unlocked ? "" : "opacity-50"}`}>
      <div className="flex items-start justify-between">
        <div className={`rounded-full p-2 ${unlocked ? "bg-primary/10" : "bg-muted"}`}>{icon}</div>
        {unlocked ? <Badge>Unlocked</Badge> : <Badge variant="outline">Locked</Badge>}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      {date && unlocked && <p className="text-xs text-muted-foreground mt-2">{date}</p>}
    </div>
  )
}

