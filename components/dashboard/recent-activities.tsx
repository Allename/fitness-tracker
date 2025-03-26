import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    type: "Strength Training",
    duration: "45 min",
    date: "Today, 9:30 AM",
    icon: "💪",
  },
  {
    id: 2,
    type: "Running",
    duration: "30 min",
    date: "Yesterday, 6:15 PM",
    icon: "🏃",
  },
  {
    id: 3,
    type: "Yoga",
    duration: "60 min",
    date: "Yesterday, 8:00 AM",
    icon: "🧘",
  },
  {
    id: 4,
    type: "Cycling",
    duration: "45 min",
    date: "2 days ago, 5:30 PM",
    icon: "🚴",
  },
  {
    id: 5,
    type: "Swimming",
    duration: "40 min",
    date: "3 days ago, 7:00 AM",
    icon: "🏊",
  },
]

export function RecentActivities() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarFallback>{activity.icon}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <p className="text-sm font-medium leading-none">{activity.type}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
            </div>
            <Badge variant="outline" className="flex-shrink-0">
              {activity.duration}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

