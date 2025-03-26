"use client"

import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import Link from "next/link"

const challenges = [
  {
    id: 1,
    name: "Summer Shred Challenge",
    startDate: "Starts in 2 days",
    participants: 245,
  },
  {
    id: 2,
    name: "Marathon Prep Challenge",
    startDate: "Starts in 5 days",
    participants: 178,
  },
  {
    id: 3,
    name: "Yoga for Beginners",
    startDate: "Starts in 1 week",
    participants: 312,
  },
]

export function UpcomingChallenges() {
  const { toast } = useToast()
  const [joinedChallenges, setJoinedChallenges] = useState<number[]>([])

  const handleJoinChallenge = (challengeId: number, challengeName: string) => {
    if (joinedChallenges.includes(challengeId)) {
      // If already joined, leave the challenge
      setJoinedChallenges(joinedChallenges.filter((id) => id !== challengeId))
      toast({
        title: "Challenge left",
        description: `You've left the ${challengeName}`,
      })
    } else {
      // Join the challenge
      setJoinedChallenges([...joinedChallenges, challengeId])
      toast({
        title: "Challenge joined",
        description: `You've joined the ${challengeName}`,
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // This is the fix - directly update the state here
              setJoinedChallenges(joinedChallenges.filter((id) => id !== challengeId))
              toast({
                title: "Action undone",
                description: `You've left the ${challengeName}`,
              })
            }}
          >
            Undo
          </Button>
        ),
      })
    }
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <div key={challenge.id} className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted flex-shrink-0">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <p className="text-sm font-medium leading-none">{challenge.name}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <span>{challenge.startDate}</span>
                <span className="mx-1">•</span>
                <span>{challenge.participants} participants</span>
              </div>
            </div>
            <Button
              variant={joinedChallenges.includes(challenge.id) ? "default" : "outline"}
              size="sm"
              className="flex-shrink-0"
              onClick={() => handleJoinChallenge(challenge.id, challenge.name)}
            >
              {joinedChallenges.includes(challenge.id) ? "Joined" : "Join"}
            </Button>
          </div>
        </div>
      ))}
      <Button asChild variant="outline" className="w-full mt-4">
        <Link href="/challenges">View All Challenges</Link>
      </Button>
    </div>
  )
}

