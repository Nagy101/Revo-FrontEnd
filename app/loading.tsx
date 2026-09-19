export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-red-600 rounded-full animate-spin" />
        <p className="text-white/60 text-sm animate-pulse tracking-widest uppercase">Loading</p>
      </div>
    </div>
  )
}
