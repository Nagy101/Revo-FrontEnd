import { ServiceDetailsPage } from "@/features/services/components/service-details-page"

interface PageProps {
  params: {
    id: string
  }
}

export default function Page({ params }: PageProps) {
  return <ServiceDetailsPage id={params.id} />
}
