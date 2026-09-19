"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AnalyticsData {
  name: string
  value: number
  color: string
}

interface AnalyticsChartProps {
  title: string
  description?: string
  data?: AnalyticsData[]
  type?: "bar" | "progress"
}

export function AnalyticsChart({ title, description, data = [], type = "progress" }: AnalyticsChartProps) {
  // Handle empty or undefined data
  if (!data || data.length === 0) {
    return (
      <Card className="bg-black/50 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
          {description && <CardDescription className="text-white/60">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-white/60">No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(...data.map((item) => item.value))

  if (type === "bar") {
    return (
      <Card className="bg-black/50 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
          {description && <CardDescription className="text-white/60">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">{item.name}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/50 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        {description && <CardDescription className="text-white/60">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/80">{item.name}</span>
                <span className="text-white font-medium">{item.value}%</span>
              </div>
              <Progress value={item.value} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
