import { Badge } from "@/components/ui/badge"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Dumbbell, LineChart, Trophy, Users } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { UpcomingChallenges } from "@/components/dashboard/upcoming-challenges"
import { WeeklyProgress } from "@/components/dashboard/weekly-progress"

export const metadata: Metadata = {
  title: "Dashboard | FitTrack",
  description: "Track your fitness progress and join challenges",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Goal Progress</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <Progress value={68} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">5 of 7 workouts completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-2">2 in progress, 1 about to start</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workout Streak</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 days</div>
              <p className="text-xs text-muted-foreground mt-2">Your longest streak: 21 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Rank</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#42</div>
              <p className="text-xs text-muted-foreground mt-2">Top 15% of all users</p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <WeeklyProgress />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your last 5 workout sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentActivities />
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/workouts">View All Workouts</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Upcoming Challenges</CardTitle>
                  <CardDescription>Challenges starting soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <UpcomingChallenges />
                </CardContent>
              </Card>
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Monthly Stats</CardTitle>
                  <CardDescription>Your fitness activity for the past month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-muted-foreground">Total Workouts</p>
                          <Badge variant="outline">+15%</Badge>
                        </div>
                        <p className="text-2xl font-bold">24</p>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[75%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-muted-foreground">Active Days</p>
                          <Badge variant="outline">+8%</Badge>
                        </div>
                        <p className="text-2xl font-bold">18</p>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[60%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Workout Distribution</p>
                      <div className="flex h-[60px] items-end gap-1">
                        <div className="h-[30%] w-full bg-primary/20 rounded-sm"></div>
                        <div className="h-[60%] w-full bg-primary/40 rounded-sm"></div>
                        <div className="h-[90%] w-full bg-primary/60 rounded-sm"></div>
                        <div className="h-[75%] w-full bg-primary/80 rounded-sm"></div>
                        <div className="h-[40%] w-full bg-primary/60 rounded-sm"></div>
                        <div className="h-[60%] w-full bg-primary/40 rounded-sm"></div>
                        <div className="h-[50%] w-full bg-primary/20 rounded-sm"></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Week 4</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Top Workout Types</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                            <span className="text-sm">Strength Training</span>
                          </div>
                          <span className="text-sm font-medium">42%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary/70"></div>
                            <span className="text-sm">Running</span>
                          </div>
                          <span className="text-sm font-medium">28%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary/40"></div>
                            <span className="text-sm">Yoga</span>
                          </div>
                          <span className="text-sm font-medium">18%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary/20"></div>
                            <span className="text-sm">Other</span>
                          </div>
                          <span className="text-sm font-medium">12%</span>
                        </div>
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
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Detailed view of your fitness progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <LineChart className="h-8 w-8 text-muted-foreground" />
                    <h3 className="font-semibold">Analytics Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed analytics will appear as you log more workouts
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/workouts?tab=stats">View Detailed Analytics</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="challenges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Challenges</CardTitle>
                <CardDescription>Challenges you're currently participating in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">30-Day Consistency Challenge</h3>
                      <Badge variant="outline">Day 12/30</Badge>
                    </div>
                    <Progress value={40} className="h-2" />
                    <p className="text-sm text-muted-foreground">Complete a workout every day for 30 days</p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">10K Steps Challenge</h3>
                      <Badge variant="outline">Day 5/14</Badge>
                    </div>
                    <Progress value={35} className="h-2" />
                    <p className="text-sm text-muted-foreground">Walk 10,000 steps every day for 14 days</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/challenges">View All Challenges</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

