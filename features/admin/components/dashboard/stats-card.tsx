"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  index?: number
}

export function StatsCard({ title, value, change, changeType = "neutral", icon: Icon, index = 0 }: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-400"
      case "negative":
        return "text-red-400"
      default:
        return "text-white/60"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card className="bg-black/50 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/60">{title}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
              {change && <p className={`text-xs ${getChangeColor()}`}>{change}</p>}
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-red-600/20 to-red-700/20 flex items-center justify-center">
              <Icon className="h-6 w-6 text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
