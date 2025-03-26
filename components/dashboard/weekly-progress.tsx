"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Mon",
    total: 45,
  },
  {
    name: "Tue",
    total: 60,
  },
  {
    name: "Wed",
    total: 30,
  },
  {
    name: "Thu",
    total: 75,
  },
  {
    name: "Fri",
    total: 50,
  },
  {
    name: "Sat",
    total: 90,
  },
  {
    name: "Sun",
    total: 0,
  },
]

export function WeeklyProgress() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}m`}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

