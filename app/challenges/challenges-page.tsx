"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Search, Trophy, Users, Award, Star, Medal, Calendar, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ChallengeForm } from "@/components/challenges/challenge-form"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ChallengePageClient() {
  const [showChallengeForm, setShowChallengeForm] = useState(false)
  const [viewingChallenge, setViewingChallenge] = useState<string | null>(null)
  const [viewingCompletedChallenge, setViewingCompletedChallenge] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [joinedChallenges, setJoinedChallenges] = useState<number[]>([])
  const [allChallenges, setAllChallenges] = useState<ChallengeCardProps[]>([
    {
      id: 1,
      title: "30-Day Consistency Challenge",
      description: "Complete a workout every day for 30 days",
      status: "active",
      progress: 40,
      participants: 342,
      daysLeft: 18,
    },
    {
      id: 2,
      title: "10K Steps Challenge",
      description: "Walk 10,000 steps every day for 14 days",
      status: "active",
      progress: 35,
      participants: 256,
      daysLeft: 9,
    },
    {
      id: 3,
      title: "Summer Shred Challenge",
      description: "Lose 5% body fat in 8 weeks with guided workouts",
      status: "upcoming",
      participants: 245,
      daysToStart: 2,
    },
    {
      id: 4,
      title: "Marathon Prep Challenge",
      description: "12-week training program for your first marathon",
      status: "upcoming",
      participants: 178,
      daysToStart: 5,
    },
    {
      id: 5,
      title: "Yoga for Beginners",
      description: "30 days of guided yoga sessions for beginners",
      status: "upcoming",
      participants: 312,
      daysToStart: 7,
    },
    {
      id: 6,
      title: "Spring Fitness Challenge",
      description: "4-week challenge to kickstart your fitness journey",
      status: "completed",
      progress: 100,
      participants: 423,
      rank: 12,
    },
  ])
  const [filteredChallenges, setFilteredChallenges] = useState<ChallengeCardProps[]>([])

  // Filter challenges based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChallenges(allChallenges)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = allChallenges.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(query) || challenge.description.toLowerCase().includes(query),
      )
      setFilteredChallenges(filtered)
    }
  }, [searchQuery, allChallenges])

  // Initialize filtered challenges with all challenges
  useEffect(() => {
    setFilteredChallenges(allChallenges)
  }, [])

  const { toast } = useToast()
  const handleCreateChallenge = (newChallenge: any) => {
    const challenge = {
      id: allChallenges.length + 1,
      title: newChallenge.title,
      description: newChallenge.description,
      status: "upcoming",
      participants: 1,
      daysToStart: 1,
    }

    setAllChallenges([challenge, ...allChallenges])
    setShowChallengeForm(false)

    // Show success toast
    toast({
      title: "Challenge created successfully",
      description: `Your challenge "${newChallenge.title}" has been created.`,
    })
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div className="grid gap-1">
            <h1 className="font-bold text-2xl md:text-3xl">Challenges</h1>
            <p className="text-muted-foreground">Join challenges to stay motivated and track your progress</p>
          </div>
          <div className="ml-auto flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search challenges..."
                className="w-full pl-8 md:w-[200px] lg:w-[320px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowChallengeForm(true)}>Create Challenge</Button>
          </div>
        </div>
        <div className="overflow-x-auto pb-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 overflow-x-auto">
              <TabsTrigger value="all">All Challenges</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    {...challenge}
                    isJoined={joinedChallenges.includes(challenge.id)}
                    onViewDetails={() => setViewingChallenge(challenge.title)}
                    onJoin={() => {
                      if (joinedChallenges.includes(challenge.id)) {
                        setJoinedChallenges(joinedChallenges.filter((id) => id !== challenge.id))
                        toast({
                          title: "Challenge left",
                          description: `You've left the ${challenge.title} challenge`,
                        })
                      } else {
                        const newJoinedChallenges = [...joinedChallenges, challenge.id]
                        setJoinedChallenges(newJoinedChallenges)
                        toast({
                          title: "Challenge joined",
                          description: `You've joined the ${challenge.title} challenge`,
                          action: (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation() // Prevent event bubbling
                                setJoinedChallenges(joinedChallenges) // Revert to previous state
                                toast({
                                  title: "Action undone",
                                  description: `You've left the ${challenge.title} challenge`,
                                })
                              }}
                            >
                              Undo
                            </Button>
                          ),
                        })
                      }
                    }}
                    onViewResults={() => setViewingCompletedChallenge(challenge.title)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="active" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredChallenges
                  .filter((challenge) => challenge.status === "active")
                  .map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      {...challenge}
                      isJoined={joinedChallenges.includes(challenge.id)}
                      onViewDetails={() => setViewingChallenge(challenge.title)}
                      onJoin={() => {
                        if (joinedChallenges.includes(challenge.id)) {
                          setJoinedChallenges(joinedChallenges.filter((id) => id !== challenge.id))
                          toast({
                            title: "Challenge left",
                            description: `You've left the ${challenge.title} challenge`,
                          })
                        } else {
                          const newJoinedChallenges = [...joinedChallenges, challenge.id]
                          setJoinedChallenges(newJoinedChallenges)
                          toast({
                            title: "Challenge joined",
                            description: `You've joined the ${challenge.title} challenge`,
                            action: (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation() // Prevent event bubbling
                                  setJoinedChallenges(joinedChallenges) // Revert to previous state
                                  toast({
                                    title: "Action undone",
                                    description: `You've left the ${challenge.title} challenge`,
                                  })
                                }}
                              >
                                Undo
                              </Button>
                            ),
                          })
                        }
                      }}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="upcoming" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredChallenges
                  .filter((challenge) => challenge.status === "upcoming")
                  .map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      {...challenge}
                      isJoined={joinedChallenges.includes(challenge.id)}
                      onJoin={() => {
                        if (joinedChallenges.includes(challenge.id)) {
                          setJoinedChallenges(joinedChallenges.filter((id) => id !== challenge.id))
                          toast({
                            title: "Challenge left",
                            description: `You've left the ${challenge.title} challenge`,
                          })
                        } else {
                          const newJoinedChallenges = [...joinedChallenges, challenge.id]
                          setJoinedChallenges(newJoinedChallenges)
                          toast({
                            title: "Challenge joined",
                            description: `You've joined the ${challenge.title} challenge`,
                            action: (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation() // Prevent event bubbling
                                  setJoinedChallenges(joinedChallenges) // Revert to previous state
                                  toast({
                                    title: "Action undone",
                                    description: `You've left the ${challenge.title} challenge`,
                                  })
                                }}
                              >
                                Undo
                              </Button>
                            ),
                          })
                        }
                      }}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredChallenges
                  .filter((challenge) => challenge.status === "completed")
                  .map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      {...challenge}
                      onViewResults={() => setViewingCompletedChallenge(challenge.title)}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Dialog open={showChallengeForm} onOpenChange={setShowChallengeForm}>
        <DialogContent className="max-w-md sm:max-w-lg w-[90%] mx-auto rounded-lg">
          <DialogHeader>
            <DialogTitle>Create Challenge</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            <ChallengeForm onSuccess={handleCreateChallenge} />
          </div>
        </DialogContent>
      </Dialog>

      {viewingChallenge && (
        <Dialog open={!!viewingChallenge} onOpenChange={() => setViewingChallenge(null)}>
          <DialogContent className="rounded-lg">
            <DialogHeader>
              <DialogTitle>{viewingChallenge}</DialogTitle>
              <DialogDescription>Detailed information about this challenge.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>
                This is a detailed view of the challenge with more information about rules, participants, and progress
                tracking.
              </p>
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Challenge Rules:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Complete the required activities daily</li>
                  <li>Log your progress in the app</li>
                  <li>Support other participants</li>
                  <li>Stay consistent to earn badges</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setViewingChallenge(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {viewingCompletedChallenge && (
        <Dialog open={!!viewingCompletedChallenge} onOpenChange={() => setViewingCompletedChallenge(null)}>
          <DialogContent className="max-w-md sm:max-w-lg w-[90%] mx-auto rounded-lg">
            <DialogHeader className="pb-2">
              <DialogTitle>{viewingCompletedChallenge} Results</DialogTitle>
              <DialogDescription>Your performance and achievements in this challenge</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[50vh] md:max-h-[60vh]">
              <div className="py-3 space-y-5 pr-2">
                <div className="flex flex-col items-center justify-center text-center p-5 border rounded-lg bg-muted/20">
                  <div className="mb-3">
                    <Trophy className="h-10 w-10 text-primary mb-2" />
                    <h3 className="text-lg font-bold">Congratulations!</h3>
                    <p className="text-sm text-muted-foreground">You've successfully completed this challenge</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                    <div className="flex flex-col items-center">
                      <Badge className="mb-1 px-3">Rank</Badge>
                      <span className="text-xl font-bold">#12</span>
                      <span className="text-xs text-muted-foreground">of 423</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Badge className="mb-1 px-3">Completion</Badge>
                      <span className="text-xl font-bold">100%</span>
                      <span className="text-xs text-muted-foreground">All tasks</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Badge className="mb-1 px-3">Points</Badge>
                      <span className="text-xl font-bold">850</span>
                      <span className="text-xs text-muted-foreground">Total earned</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2.5">Achievements Earned:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="flex items-center gap-2 p-3 border rounded-md">
                      <Award className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Perfect Attendance</p>
                        <p className="text-xs text-muted-foreground">Never missed a day</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 border rounded-md">
                      <Star className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Overachiever</p>
                        <p className="text-xs text-muted-foreground">Exceeded daily goals</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 border rounded-md">
                      <Medal className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Top 5%</p>
                        <p className="text-xs text-muted-foreground">Among all participants</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2.5">Performance Summary:</h4>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Challenge Duration</span>
                      </div>
                      <span className="font-medium">28 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Tasks Completed</span>
                      </div>
                      <span className="font-medium">28/28</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Total Participants</span>
                      </div>
                      <span className="font-medium">423</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2.5">Top Performers:</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Alex Johnson", rank: 1, avatar: "AJ", points: 950 },
                      { name: "Sarah Williams", rank: 2, avatar: "SW", points: 925 },
                      { name: "Michael Chen", rank: 3, avatar: "MC", points: 910 },
                    ].map((user) => (
                      <div key={user.rank} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                            {user.rank}
                          </Badge>
                          <Avatar className="h-7 w-7">
                            <AvatarFallback>{user.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{user.name}</span>
                        </div>
                        <span className="text-sm">{user.points} pts</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-2 border rounded-md bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                          12
                        </Badge>
                        <Avatar className="h-7 w-7">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">You (John Doe)</span>
                      </div>
                      <span className="text-sm">850 pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={() => setViewingCompletedChallenge(null)}>
                Close
              </Button>
              <Button>Share Results</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface ChallengeCardProps {
  id: number
  title: string
  description: string
  status: "active" | "upcoming" | "completed"
  progress?: number
  participants: number
  daysLeft?: number
  daysToStart?: number
  rank?: number
  isJoined?: boolean
  onViewDetails?: () => void
  onJoin?: () => void
  onViewResults?: () => void
}

function ChallengeCard({
  id,
  title,
  description,
  status,
  progress,
  participants,
  daysLeft,
  daysToStart,
  rank,
  isJoined,
  onViewDetails,
  onJoin,
  onViewResults,
}: ChallengeCardProps) {
  const { toast } = useToast()

  const handleJoin = () => {
    if (onJoin) {
      onJoin()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge variant={status === "active" ? "default" : status === "upcoming" ? "outline" : "secondary"}>
            {status === "active" ? "Active" : status === "upcoming" ? "Upcoming" : "Completed"}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "active" && progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{participants} participants</span>
          </div>
          {status === "active" && daysLeft !== undefined && (
            <div className="flex items-center gap-1">
              <span>{daysLeft} days left</span>
            </div>
          )}
          {status === "upcoming" && daysToStart !== undefined && (
            <div className="flex items-center gap-1">
              <span>Starts in {daysToStart} days</span>
            </div>
          )}
          {status === "completed" && rank !== undefined && (
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span>Ranked #{rank}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {status === "active" && (
          <Button variant="outline" className="w-full" onClick={onViewDetails}>
            View Details
          </Button>
        )}
        {status === "upcoming" && (
          <Button className="w-full" variant={isJoined ? "default" : "outline"} onClick={handleJoin}>
            {isJoined ? "Joined" : "Join Challenge"}
          </Button>
        )}
        {status === "completed" && (
          <Button variant="outline" className="w-full" onClick={onViewResults}>
            View Results
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

