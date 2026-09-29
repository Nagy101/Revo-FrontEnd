import { ServicesManager } from "@/features/admin/components/services/services-manager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services Management | Revo Admin",
  description: "Manage your services",
};

export default function AdminServicesPage() {
  return <ServicesManager />;
}
