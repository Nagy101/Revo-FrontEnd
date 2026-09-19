export default function AnalyticsLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-white/10 rounded-lg w-48 animate-pulse" />
        <div className="h-4 bg-white/10 rounded-lg w-96 animate-pulse" />
      </div>

      {/* Metrics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-black/50 backdrop-blur-xl border-white/10 rounded-lg p-6">
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded w-24 animate-pulse" />
              <div className="h-8 bg-white/10 rounded w-16 animate-pulse" />
              <div className="h-3 bg-white/10 rounded w-32 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-black/50 backdrop-blur-xl border-white/10 rounded-lg p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-6 bg-white/10 rounded w-32 animate-pulse" />
                <div className="h-4 bg-white/10 rounded w-48 animate-pulse" />
              </div>
              <div className="h-48 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
