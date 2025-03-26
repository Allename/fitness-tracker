import type { Metadata } from "next"
import WorkoutsClientPage from "./WorkoutsClientPage"

export const metadata: Metadata = {
  title: "Workouts | FitTrack",
  description: "Log and track your workouts",
}

export default function WorkoutsPage() {
  return <WorkoutsClientPage />
}

