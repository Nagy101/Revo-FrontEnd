import type { Metadata } from "next"
import { AdminShell } from "@/features/admin/components/layout/admin-shell"

export const metadata: Metadata = {
  title: "Admin Dashboard | REVO",
  description: "REVO Media Production Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminShell>{children}</AdminShell>
}
