import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { portfolioService } from "@/features/portfolio/services/portfolio.service"
import { PortfolioDetailContent } from "@/features/portfolio/components/portfolio-detail-content"
import { CTASection } from "@/components/sections/cta-section"
import dynamic from "next/dynamic"

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
    const portfolio = await portfolioService.getPortfolioBySlugOrId(slug)
    
    if (!portfolio) {
      return {
        title: "Project Not Found",
      }
    }

    return {
      title: `${portfolio.titleEn} | REVO Portfolio`,
      description: portfolio.descriptionEn,
      openGraph: {
        title: portfolio.titleEn,
        description: portfolio.descriptionEn,
        images: portfolio.mediaType === "image" ? [portfolio.mediaUrl] : [],
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
