import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { portfolioService } from "@/features/portfolio/services/portfolio.service"
import { PortfolioDetailContent } from "@/features/portfolio/components/portfolio-detail-content"
import dynamic from "next/dynamic"

const CTASection = dynamic(() => import("@/components/sections/cta-section").then(m => m.CTASection), { ssr: true })
const AmbientLight = dynamic(() => import("@/components/effects/ambient-light"))

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const response = await portfolioService.getById(slug)
    const portfolio = response?.data
    
    if (!portfolio) {
      return {
        title: "Project Not Found",
      }
    }

    return {
      title: `${portfolio.captionEn} | REVO Portfolio`,
      description: portfolio.captionAr,
      openGraph: {
        title: portfolio.captionEn,
        description: portfolio.captionAr,
        images: portfolio.mediaItems?.[0]?.mediaUrl ? [portfolio.mediaItems[0].mediaUrl] : [],
      },
    }
  } catch (error) {
    return {
      title: "Portfolio",
    }
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params
  
  // We can pre-fetch here if we want, but letting the client hook handle it ensures
  // consistency with the current TanStack query setup while this file handles SEO.
  
  return (
    <div className="relative overflow-hidden min-h-screen">
      <AmbientLight />
      <PortfolioDetailContent slug={slug} />
      <CTASection />
    </div>
  )
}
