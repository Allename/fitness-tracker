import type { Metadata } from "next"
import AnalyticsPageClient from "./analytics-page-client"

export const metadata: Metadata = {
  title: "Analytics | FitTrack",
  description: "Detailed analytics of your fitness journey",
}

export default function AnalyticsPage() {
  return <AnalyticsPageClient />
}

