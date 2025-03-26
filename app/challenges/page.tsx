import type { Metadata } from "next"
import ChallengePageClient from "./challenges-page"

export const metadata: Metadata = {
  title: "Challenges | FitTrack",
  description: "Join fitness challenges and compete with others",
}

export default function ChallengePage() {
  return <ChallengePageClient />
}

