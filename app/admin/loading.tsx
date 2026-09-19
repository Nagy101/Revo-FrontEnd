"use client"

import { motion } from "framer-motion"

export default function AdminLoading() {
  return (
    <div className="flex-1 p-6">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-white/10 rounded-lg w-64 animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-96 animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-black/50 backdrop-blur-xl border-white/10 rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-24 animate-pulse" />
                  <div className="h-8 bg-white/10 rounded w-16 animate-pulse" />
                  <div className="h-3 bg-white/5 rounded w-20 animate-pulse" />
                </div>
                <div className="h-12 w-12 bg-white/10 rounded-lg animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-black/50 backdrop-blur-xl border-white/10 rounded-lg overflow-hidden"
            >
              <div className="aspect-video bg-white/10 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-white/10 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
                <div className="flex space-x-2 pt-2">
                  <div className="h-6 bg-white/10 rounded-full w-16 animate-pulse" />
                  <div className="h-6 bg-white/10 rounded-full w-20 animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
