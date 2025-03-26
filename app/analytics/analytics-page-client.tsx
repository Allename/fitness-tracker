"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Activity, Calendar, TrendingUp, Clock, Download, FileText } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function AnalyticsPageClient() {
  const { toast } = useToast()
  const [showCustomReportDialog, setShowCustomReportDialog] = useState(false)
  const [reportType, setReportType] = useState("comprehensive")
  const [dateRange, setDateRange] = useState("last30")
  const [reportFormat, setReportFormat] = useState("pdf")
  const [sections, setSections] = useState({
    workoutData: true,
    progressMetrics: true,
    goalTracking: true,
    chartsGraphs: true,
  })

  const handleExportData = () => {
    // Create a CSV string with some sample data
    const csvContent = `Date,Workout Type,Duration,Exercises
2025-03-20,Strength Training,45 min,"Bench Press, Squats, Deadlifts"
2025-03-18,Running,30 min,"5K Run"
2025-03-15,Yoga,60 min,"Sun Salutation, Warrior Poses"
2025-03-12,Cycling,45 min,"Outdoor Cycling"
2025-03-10,Swimming,40 min,"Freestyle, Breaststroke"`

    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob)

    // Create a link element
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "fitness_data_export.csv")

    // Append the link to the body
    document.body.appendChild(link)

    // Click the link to trigger the download
    link.click()

    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Data exported successfully",
      description: "Your fitness data has been exported to CSV format.",
    })
  }

  const handleCustomReport = () => {
    setShowCustomReportDialog(true)
  }

  const handleGenerateReport = () => {
    setShowCustomReportDialog(false)

    // Create sample PDF-like content (actually HTML that looks like a report)
    const reportContent = `
      <html>
      <head>
        <title>FitTrack - Custom ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; }
          .section { margin-bottom: 20px; }
          .chart { height: 200px; background-color: #f0f0f0; margin: 10px 0; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>FitTrack - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        
        ${
          sections.workoutData
            ? `
        <div class="section">
          <h2>Workout Data</h2>
          <table>
            <tr>
              <th>Date</th>
              <th>Workout Type</th>
              <th>Duration</th>
              <th>Exercises</th>
            </tr>
            <tr>
              <td>2025-03-20</td>
              <td>Strength Training</td>
              <td>45 min</td>
              <td>Bench Press, Squats, Deadlifts</td>
            </tr>
            <tr>
              <td>2025-03-18</td>
              <td>Running</td>
              <td>30 min</td>
              <td>5K Run</td>
            </tr>
            <tr>
              <td>2025-03-15</td>
              <td>Yoga</td>
              <td>60 min</td>
              <td>Sun Salutation, Warrior Poses</td>
            </tr>
          </table>
        </div>
        `
            : ""
        }
        
        ${
          sections.progressMetrics
            ? `
        <div class="section">
          <h2>Progress Metrics</h2>
          <p>Overall Progress: +15%</p>
          <p>Strength Progress: +22%</p>
          <p>Cardio Endurance: +18%</p>
          <p>Body Composition: +10%</p>
        </div>
        `
            : ""
        }
        
        ${
          sections.goalTracking
            ? `
        <div class="section">
          <h2>Goal Tracking</h2>
          <p>Weight Goal: 75% Complete (Starting: 80kg, Current: 73kg, Goal: 70kg)</p>
          <p>Strength Goal: 60% Complete (Starting: 60kg, Current: 90kg, Goal: 110kg)</p>
          <p>Running Goal: 85% Complete (Starting: 3km, Current: 8.5km, Goal: 10km)</p>
        </div>
        `
            : ""
        }
        
        ${
          sections.chartsGraphs
            ? `
        <div class="section">
          <h2>Charts & Graphs</h2>
          <div class="chart">[Workout Frequency Chart]</div>
          <div class="chart">[Workout Distribution Chart]</div>
          <div class="chart">[Progress Metrics Chart]</div>
        </div>
        `
            : ""
        }
      </body>
      </html>
    `

    // Create a Blob with the HTML content
    const blob = new Blob([reportContent], { type: "text/html" })

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob)

    toast({
      title: "Custom report generated",
      description: "Your custom report has been generated and is ready to download.",
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Create a link element
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `fittrack_${reportType}_report.${reportFormat}`)

            // Append the link to the body
            document.body.appendChild(link)

            // Click the link to trigger the download
            link.click()

            // Clean up
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            toast({
              title: "Report downloaded",
              description: "Your report has been downloaded successfully.",
            })
          }}
        >
          Download
        </Button>
      ),
    })
  }

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div className="grid gap-1">
            <h1 className="font-bold text-2xl md:text-3xl">Analytics</h1>
            <p className="text-muted-foreground">Detailed insights into your fitness progress</p>
          </div>
          <div className="ml-auto flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button onClick={handleCustomReport}>
              <FileText className="mr-2 h-4 w-4" />
              Custom Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            <TabsTrigger
              value="overview"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="workouts"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Workouts
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Progress
            </TabsTrigger>
            <TabsTrigger
              value="trends"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">124</div>
                  <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Days</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">86</div>
                  <p className="text-xs text-muted-foreground mt-1">70% consistency rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68h 45m</div>
                  <p className="text-xs text-muted-foreground mt-1">Avg. 42 min per workout</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+15%</div>
                  <p className="text-xs text-muted-foreground mt-1">Based on your goals</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Workout Frequency</CardTitle>
                  <CardDescription>Your workout patterns over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="h-full w-full flex flex-col">
                    <div className="text-sm font-medium mb-4 flex justify-between">
                      <span>Workouts per week</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Last 3 months</Badge>
                      </div>
                    </div>
                    <div className="flex-1 flex items-end gap-2">
                      {[3, 4, 2, 5, 3, 4, 6, 2, 3, 5, 4, 3].map((value, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-primary rounded-t-sm" style={{ height: `${value * 15}%` }}></div>
                          <span className="text-xs text-muted-foreground">{i + 1}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                      <span>January</span>
                      <span>February</span>
                      <span>March</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Workout Distribution</CardTitle>
                  <CardDescription>Breakdown by workout type</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="h-full w-full flex flex-col">
                    <div className="flex-1 flex items-center justify-center">
                      <div className="relative w-40 h-40">
                        {/* Pie chart segments */}
                        <div
                          className="absolute inset-0 rounded-full border-8 border-primary"
                          style={{ clipPath: "polygon(50% 50%, 0 0, 0 50%, 0 100%, 50% 100%)" }}
                        ></div>
                        <div
                          className="absolute inset-0 rounded-full border-8 border-primary/70"
                          style={{ clipPath: "polygon(50% 50%, 50% 0, 100% 0, 100% 50%)" }}
                        ></div>
                        <div
                          className="absolute inset-0 rounded-full border-8 border-primary/40"
                          style={{ clipPath: "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)" }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-28 h-28 rounded-full bg-background flex items-center justify-center">
                            <span className="text-sm font-medium">124 workouts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
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
                          <span className="text-sm">Other</span>
                        </div>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
                <CardDescription>Your fitness metrics over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <div className="h-full w-full flex flex-col">
                  <div className="text-sm font-medium mb-4 flex justify-between">
                    <span>Progress by metric</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Last 6 months</Badge>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Workout Duration</span>
                        <span className="text-sm font-medium">+15%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Strength Progress</span>
                        <span className="text-sm font-medium">+22%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cardio Endurance</span>
                        <span className="text-sm font-medium">+18%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Body Composition</span>
                        <span className="text-sm font-medium">+10%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Overall Fitness</span>
                        <span className="text-sm font-medium">+17%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/workouts">View Workout History</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workout Analytics</CardTitle>
                <CardDescription>Detailed analysis of your workout patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-4">Workout Intensity by Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <div className="text-sm font-medium mb-2">Strength Training</div>
                        <div className="h-[200px] flex items-end gap-2">
                          {[65, 70, 75, 80, 85, 90, 85, 90, 95].map((value, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div className="w-full bg-primary rounded-t-sm" style={{ height: `${value}%` }}></div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground text-center">
                          Last 9 workouts (most recent on right)
                        </div>
                      </div>
                      <div className="border rounded-md p-4">
                        <div className="text-sm font-medium mb-2">Cardio</div>
                        <div className="h-[200px] flex items-end gap-2">
                          {[60, 65, 70, 75, 80, 85, 90, 85, 90].map((value, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div className="w-full bg-primary/70 rounded-t-sm" style={{ height: `${value}%` }}></div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground text-center">
                          Last 9 workouts (most recent on right)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-3">
                      <div className="text-xs text-muted-foreground">Avg. Duration</div>
                      <div className="text-lg font-medium mt-1">45 min</div>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="text-xs text-muted-foreground">Avg. Intensity</div>
                      <div className="text-lg font-medium mt-1">Medium-High</div>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="text-xs text-muted-foreground">Most Active Day</div>
                      <div className="text-lg font-medium mt-1">Monday</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/workouts">View Workout History</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>Track your progress towards your fitness goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-4">Goal Progress</h3>
                    <div className="space-y-6">
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">Weight Goal</div>
                          <Badge>75% Complete</Badge>
                        </div>
                        <Progress value={75} className="h-2 mb-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Starting: 80kg</span>
                          <span>Current: 73kg</span>
                          <span>Goal: 70kg</span>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">Strength Goal</div>
                          <Badge>60% Complete</Badge>
                        </div>
                        <Progress value={60} className="h-2 mb-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Starting: 60kg</span>
                          <span>Current: 90kg</span>
                          <span>Goal: 110kg</span>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">Running Goal</div>
                          <Badge>85% Complete</Badge>
                        </div>
                        <Progress value={85} className="h-2 mb-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Starting: 3km</span>
                          <span>Current: 8.5km</span>
                          <span>Goal: 10km</span>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">Workout Frequency</div>
                          <Badge>90% Complete</Badge>
                        </div>
                        <Progress value={90} className="h-2 mb-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Starting: 2/week</span>
                          <span>Current: 4.5/week</span>
                          <span>Goal: 5/week</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/profile?tab=goals">View Fitness Goals</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fitness Trends</CardTitle>
                <CardDescription>Long-term trends in your fitness journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-4">6-Month Trends</h3>
                    <div className="space-y-6">
                      <div className="border rounded-md p-4">
                        <div className="text-sm font-medium mb-2">Workout Consistency</div>
                        <div className="h-[100px] flex items-end gap-1">
                          {[60, 65, 70, 75, 85, 90].map((value, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div className="w-full bg-primary/80 rounded-t-sm" style={{ height: `${value}%` }}></div>
                              <span className="text-xs text-muted-foreground mt-1">
                                {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][i]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4">
                          <div className="text-sm font-medium mb-2">Strength Progression</div>
                          <div className="h-[100px] relative">
                            <div className="absolute inset-0 flex items-end">
                              <div className="w-full h-[30%] border-t border-muted-foreground/30"></div>
                            </div>
                            <div className="absolute inset-0 flex items-end">
                              <div className="w-full h-[60%] border-t border-muted-foreground/30"></div>
                            </div>
                            <div className="absolute inset-0 flex items-end">
                              <div className="w-full h-[90%] border-t border-muted-foreground/30"></div>
                            </div>
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <polyline
                                points="0,70 20,65 40,55 60,45 80,35 100,25"
                                fill="none"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>Oct</span>
                            <span>Mar</span>
                          </div>
                        </div>

                        <div className="border rounded-md p-4">
                          <div className="text-sm font-medium mb-2">Cardio Progression</div>
                          <div className="h-[100px] relative">
                            <div className="absolute inset-0 flex items-end">
                              <div className="w-full h-[30%] border-t border-muted-foreground/30"></div>
                            </div>
                            <div className="absolute inset-0 flex items-end">
                              <div className="w-full h-[60%] border-t border-muted-foreground/30"></div>
                            </div>
                            <div className="absolute inset-0 flex items-end">
                              <div className="w-full h-[90%] border-t border-muted-foreground/30"></div>
                            </div>
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <polyline
                                points="0,75 20,70 40,60 60,50 80,35 100,30"
                                fill="none"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>Oct</span>
                            <span>Mar</span>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <div className="text-sm font-medium mb-2">Key Insights</div>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-primary/20 flex-shrink-0 mt-0.5"></div>
                            <span>Your workout consistency has improved by 30% over the last 6 months</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-primary/20 flex-shrink-0 mt-0.5"></div>
                            <span>Strength training shows the most significant improvement at 45%</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-4 w-4 rounded-full bg-primary/20 flex-shrink-0 mt-0.5"></div>
                            <span>Your cardio endurance has steadily increased each month</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/workouts">View Workout History</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showCustomReportDialog} onOpenChange={setShowCustomReportDialog}>
        <DialogContent className="max-w-md sm:max-w-lg w-[90%] mx-auto rounded-lg">
          <DialogHeader>
            <DialogTitle>Generate Custom Report</DialogTitle>
            <DialogDescription>Select the data you want to include in your custom report.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                  <SelectItem value="workout">Workout Summary</SelectItem>
                  <SelectItem value="progress">Progress Report</SelectItem>
                  <SelectItem value="goals">Goals Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="date-range">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="last90">Last 90 Days</SelectItem>
                  <SelectItem value="last180">Last 6 Months</SelectItem>
                  <SelectItem value="last365">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Include Sections</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="workout-data"
                    checked={sections.workoutData}
                    onCheckedChange={() => toggleSection("workoutData")}
                  />
                  <Label htmlFor="workout-data" className="text-sm font-normal">
                    Workout Data
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="progress-metrics"
                    checked={sections.progressMetrics}
                    onCheckedChange={() => toggleSection("progressMetrics")}
                  />
                  <Label htmlFor="progress-metrics" className="text-sm font-normal">
                    Progress Metrics
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="goal-tracking"
                    checked={sections.goalTracking}
                    onCheckedChange={() => toggleSection("goalTracking")}
                  />
                  <Label htmlFor="goal-tracking" className="text-sm font-normal">
                    Goal Tracking
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="charts-graphs"
                    checked={sections.chartsGraphs}
                    onCheckedChange={() => toggleSection("chartsGraphs")}
                  />
                  <Label htmlFor="charts-graphs" className="text-sm font-normal">
                    Charts & Graphs
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <RadioGroup value={reportFormat} onValueChange={setReportFormat}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="pdf-format" />
                    <Label htmlFor="pdf-format" className="text-sm font-normal">
                      PDF
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="csv" id="csv-format" />
                    <Label htmlFor="csv-format" className="text-sm font-normal">
                      CSV
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excel" id="excel-format" />
                    <Label htmlFor="excel-format" className="text-sm font-normal">
                      Excel
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomReportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport}>Generate Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

