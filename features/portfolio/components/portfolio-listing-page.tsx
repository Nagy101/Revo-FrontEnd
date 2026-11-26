"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  ArrowUpRight,
  Search,
  Sparkles,
  ArrowDown,
  Flame,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";
import { usePublicPortfolios } from "../hooks/usePortfolios";
import { PortfolioItem, MediaType } from "../types";
import { useAllCategories } from "@/features/categories/hooks/useCategories";
import { Input } from "@/components/ui/input";

const EASE = [0.16, 1, 0.3, 1] as const;

function isValidImageCover(url?: string | null): boolean {
  if (!url || !url.trim() || url === "null") return false;
  const lower = url.toLowerCase();
  if (
    lower.includes("youtube.com/") ||
    lower.includes("youtu.be/") ||
    lower.includes("vimeo.com/") ||
    lower.includes("drive.google.com/") ||
    lower.includes("instagram.com/") ||
    /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(lower) ||
    lower.includes("/video/upload/")
  ) {
    return false;
  }
  return true;
}

function MarqueeStrip() {
  const marqueeItems = [
    "Stadium Concerts",
    "Cinematic Films",
    "Live Event Production",
    "Artist Visuals",
    "Commercial Campaigns",
    "Sound & Color Finishing",
    "REVO Showreel Suite",
  ];

  return (
    <div className="relative py-4 bg-[#080808] border-y border-white/10 overflow-hidden select-none z-10" dir="ltr">
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />
      <motion.div
        animate={{ x: [0, -1400] }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        className="flex items-center gap-8 whitespace-nowrap text-xs md:text-sm font-sora font-extrabold uppercase tracking-[0.3em] text-white/40"
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 shrink-0">
            {marqueeItems.map((item, idx) => (
              <span key={idx} className="flex items-center gap-8">
                <span
                  className={
                    idx === 6
                      ? "text-[#C3143D] font-bold"
                      : idx % 2 === 0
                        ? "text-white"
                        : "text-white/80"
                  }
                >
                  {item}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function PortfolioListingPage() {
  const { data: portfolios = [] } = usePublicPortfolios();
  const { data: categoriesData = [] } = useAllCategories();

  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const rawProjects: PortfolioItem[] = Array.isArray(portfolios) ? portfolios : [];

  // Active categories: sort by orderIndex, trim whitespace, and filter out categories with 0 projects
  const activeCategories = categories
    .map((cat: any) => ({
      ...cat,
      nameEn: (cat.nameEn || "").trim(),
      displayName: (cat.nameEn || cat.nameAr || "").trim(),
      count: rawProjects.filter(
        (p) => p.categoryId && cat.id && p.categoryId.toLowerCase() === cat.id.toLowerCase()
      ).length,
    }))
    .filter((cat: any) => cat.count > 0)
    .sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const projectsRef = useRef<HTMLDivElement>(null);

  // Window scroll Parallax
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 1.08]);

  // Mouse Tracking for Global Ambient Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mousePixelX = useMotionValue(0);
  const mousePixelY = useMotionValue(0);

  const smoothPixelX = useSpring(mousePixelX, { damping: 40, stiffness: 150, mass: 0.5 });
  const smoothPixelY = useSpring(mousePixelY, { damping: 40, stiffness: 150, mass: 0.5 });

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
      mousePixelX.set(e.clientX);
      mousePixelY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, mousePixelX, mousePixelY]);

  const spotlightX = useTransform(smoothPixelX, (x) => x - 800);
  const spotlightY = useTransform(smoothPixelY, (y) => y - 800);

  const handleScrollToProjects = () => {
    if (projectsRef.current) {
      const y =
        projectsRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Filtering logic
  let filteredProjects: PortfolioItem[] = [...rawProjects].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
  );
  if (selectedCategory !== "All") {
    filteredProjects = filteredProjects.filter(
      (p) =>
        p.categoryId &&
        selectedCategory &&
        p.categoryId.toLowerCase() === selectedCategory.toLowerCase()
    );
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredProjects = filteredProjects.filter(
      (p) =>
        p.captionEn?.toLowerCase().includes(q) ||
        p.captionAr?.toLowerCase().includes(q)
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* ─── HERO SECTION ─── */}
      <section className="relative w-full min-h-screen pt-16 sm:pt-20 md:pt-20 pb-6 md:pb-0 flex items-center justify-center overflow-hidden bg-[#050505]">
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0 origin-top will-change-transform"
        >
          <img
            src="/images/revo-hero-bg.jpg"
            alt="REVO Portfolio Background"
            className="w-full h-full object-cover object-bottom opacity-85"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]/60" />
        </motion.div>

        {isMounted && (
          <motion.div
            className="hidden md:block fixed top-0 left-0 w-[1600px] h-[1600px] rounded-full pointer-events-none z-0 will-change-transform"
            style={{
              background:
                "radial-gradient(circle, rgba(195, 20, 61, 0.15) 0%, transparent 60%)",
              x: spotlightX,
              y: spotlightY,
            }}
          />
        )}

        <div
          className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: 'url("/images/noise.png")' }}
        />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-6 flex flex-col items-center justify-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            className="flex items-center gap-3 mb-2.5 md:mb-4"
          >
            <div className="w-8 md:w-14 h-[1px] bg-gradient-to-r from-transparent to-[#C3143D]" />
            <span className="flex items-center gap-2 text-white/90 text-xs md:text-sm font-semibold tracking-[0.3em] uppercase drop-shadow">
              <Sparkles className="w-3.5 h-3.5 text-[#C3143D]" /> REVO SHOWCASE ARCHIVE
            </span>
            <div className="w-8 md:w-14 h-[1px] bg-gradient-to-l from-transparent to-[#C3143D]" />
          </motion.div>

          <div className="flex flex-col items-center text-center">
            <div className="overflow-hidden pb-1">
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-sora font-black uppercase tracking-tight text-white leading-[1.05] drop-shadow-2xl whitespace-nowrap"
              >
                Less Talk.
              </motion.h1>
            </div>

            <div className="flex items-center justify-center gap-3 md:gap-5 overflow-hidden w-full mt-0.5">
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
                className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-white/50 origin-right max-w-[80px]"
              />
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
                className="relative whitespace-nowrap"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-serif italic leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D] pr-2 drop-shadow-2xl">
                  More Showreel.
                </h1>
                <h1 className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-serif italic leading-[1.05] text-[#C3143D] opacity-25 blur-2xl pointer-events-none">
                  More Showreel.
                </h1>
              </motion.div>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
                className="hidden md:block flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#C3143D]/50 to-[#C3143D] origin-left max-w-[80px]"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.7 }}
            className="max-w-2xl text-center space-y-2 mt-2.5 md:mt-3.5 leading-relaxed [text-shadow:_0_1px_12px_rgba(0,0,0,0.8)]"
          >
            <p className="text-white/95 text-xs sm:text-sm md:text-base font-normal">
              A look at the moments we’ve captured, the stories we’ve shaped, and the ideas we’ve brought to life.
            </p>
            <p className="text-white/75 text-xs sm:text-sm font-light">
              From high-energy events to brand campaigns and cinematic films, explore the work that brings the REVO creative spirit to the screen.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.8 }}
            className="flex items-center gap-3 mt-2.5 text-red-200/90 font-serif italic text-xs sm:text-sm tracking-wide [text-shadow:_0_1px_10px_rgba(0,0,0,0.8)]"
          >
            <span className="w-6 h-px bg-gradient-to-r from-transparent to-[#C3143D]" />
            <span>“Every project has a story. Here are some of ours.”</span>
            <span className="w-6 h-px bg-gradient-to-l from-transparent to-[#C3143D]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.9 }}
            className="flex flex-row items-center gap-3.5 md:gap-4 mt-4 md:mt-5"
          >
            <button
              type="button"
              onClick={handleScrollToProjects}
              className="group relative px-6 py-2.5 md:px-7 md:py-3 bg-[#C3143D] text-white overflow-hidden rounded-full font-semibold tracking-widest uppercase text-xs md:text-sm shadow-[0_0_25px_rgba(195,20,61,0.4)] hover:shadow-[0_0_45px_rgba(195,20,61,0.6)] hover:scale-105 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-cinematic" />
              <span className="relative flex items-center gap-2">
                Explore Projects{" "}
                <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <Link
              href="/contact"
              className="group px-6 py-2.5 md:px-7 md:py-3 bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-full font-semibold tracking-widest uppercase text-xs md:text-sm hover:border-white hover:bg-white/10 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
            >
              Let&apos;s Talk <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </motion.div>

          {/* ── CINEMATIC SHOWCASE CARDS DUO ── */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1 }}
            className="flex flex-row items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-5 w-full max-w-xl mx-auto z-20"
          >
            <div
              onClick={handleScrollToProjects}
              className="cursor-pointer h-[150px] sm:h-[175px] md:h-[195px] aspect-[16/10]"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative w-full h-full rounded-2xl p-1.5 bg-black/50 backdrop-blur-xl border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(195,20,61,0.2)] hover:border-[#C3143D]/70 hover:shadow-[0_20px_50px_rgba(195,20,61,0.5)] transition-all duration-300 -rotate-1 hover:rotate-0"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <img
                    src="/images/revo-portfolio-card1.jpg"
                    alt="Live Concert Duo"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-1.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <p className="text-[11px] sm:text-xs font-bold truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      Stage Vocals
                    </p>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#C3143D] transition-colors shrink-0">
                      <Play size={7} className="fill-current text-white translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div
              onClick={handleScrollToProjects}
              className="cursor-pointer h-[150px] sm:h-[175px] md:h-[195px] aspect-[2/3]"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative w-full h-full rounded-2xl p-1.5 bg-black/50 backdrop-blur-xl border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(195,20,61,0.2)] hover:border-[#C3143D]/70 hover:shadow-[0_20px_50px_rgba(195,20,61,0.5)] transition-all duration-300 rotate-1 hover:rotate-0"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <img
                    src="/images/revo-portfolio-card2.jpg"
                    alt="Live Guitar Solo"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-1.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <p className="text-[11px] sm:text-xs font-bold truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      Solo Energy
                    </p>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#C3143D] transition-colors shrink-0">
                      <Play size={7} className="fill-current text-white translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── ROTATING BADGE ── */}
        <motion.div
          onClick={handleScrollToProjects}
          role="button"
          tabIndex={0}
          aria-label="Scroll to projects"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 1.2, ease: EASE }}
          className="absolute bottom-16 right-6 md:bottom-20 md:right-8 w-24 h-24 md:w-28 md:h-28 hidden lg:flex items-center justify-center cursor-pointer group z-20 select-none"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-white fill-current"
            >
              <path
                id="circlePathPort"
                d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                fill="none"
              />
              <text className="text-[10px] uppercase font-bold tracking-[0.25em]">
                <textPath href="#circlePathPort" startOffset="0%">
                  ★ REVO PORTFOLIO ARCHIVE ★ CREATIVE EXCELLENCE
                </textPath>
              </text>
            </svg>
          </motion.div>

          <div className="relative z-10 w-9 h-9 rounded-full bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#C3143D] group-hover:border-[#C3143D] group-hover:scale-110 transition-all duration-300">
            <ArrowDown
              size={14}
              className="text-white group-hover:translate-y-0.5 transition-transform"
            />
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-20 pointer-events-none" />
      </section>

      {/* ─── MARQUEE ─── */}
      <MarqueeStrip />

      {/* ─── WORKS SECTION ─── */}
      <div
        id="portfolio-grid"
        ref={projectsRef}
        className="max-w-[1400px] mx-auto px-6 pt-20 pb-10 relative z-10 scroll-mt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 mb-3">
              <Flame className="w-3.5 h-3.5 text-[#C3143D]" />
              <span className="text-[#C3143D] text-[11px] font-bold tracking-[0.3em] uppercase">
                Curated Portfolio
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sora font-extrabold text-white tracking-tight uppercase">
              Signature{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#C3143D]">
                Masterpieces.
              </span>
            </h2>
          </div>

          <p className="text-white/50 max-w-md text-sm font-light leading-relaxed">
            From stadium live shows to cinematic commercial stories, explore how REVO crafts visual legacies that command global attention.
          </p>
        </motion.div>

        {/* Editorial Underline Navigation & Minimalist Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mt-10 border-b border-white/10"
        >
          <div className="flex items-center gap-6 sm:gap-8 lg:gap-10 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className="relative py-4 text-xs sm:text-[13px] font-sora uppercase tracking-[0.2em] transition-colors duration-300 whitespace-nowrap cursor-pointer flex items-center gap-2 group shrink-0"
            >
              <span
                className={`transition-colors duration-300 ${
                  selectedCategory === "All"
                    ? "text-white font-extrabold"
                    : "text-white/40 group-hover:text-white/80 font-semibold"
                }`}
              >
                All Works
              </span>
              <span
                className={`text-[10px] font-mono transition-colors duration-300 ${
                  selectedCategory === "All"
                    ? "text-[#C3143D] font-bold"
                    : "text-white/30 group-hover:text-white/60"
                }`}
              >
                [{String(rawProjects.length).padStart(2, "0")}]
              </span>

              {selectedCategory === "All" && (
                <motion.div
                  layoutId="editorialTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C3143D] shadow-[0_0_12px_rgba(195,20,61,0.9)]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </button>

            {activeCategories.map((cat: any) => {
              const isActive = selectedCategory.toLowerCase() === String(cat.id).toLowerCase();
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="relative py-4 text-xs sm:text-[13px] font-sora uppercase tracking-[0.2em] transition-colors duration-300 whitespace-nowrap cursor-pointer flex items-center gap-2 group shrink-0"
                >
                  <span
                    className={`transition-colors duration-300 ${
                      isActive
                        ? "text-white font-extrabold"
                        : "text-white/40 group-hover:text-white/80 font-semibold"
                    }`}
                  >
                    {cat.displayName || cat.nameEn}
                  </span>
                  <span
                    className={`text-[10px] font-mono transition-colors duration-300 ${
                      isActive
                        ? "text-[#C3143D] font-bold"
                        : "text-white/30 group-hover:text-white/60"
                    }`}
                  >
                    [{String(cat.count).padStart(2, "0")}]
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="editorialTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C3143D] shadow-[0_0_12px_rgba(195,20,61,0.9)]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-64 mb-2.5 shrink-0">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none"
              size={14}
            />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] hover:bg-white/[0.06] focus:bg-white/[0.08] border-white/10 text-white placeholder:text-white/35 pl-9 pr-8 h-9 rounded-full text-xs font-sora tracking-wide focus-visible:ring-[#C3143D] focus-visible:border-[#C3143D] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

        </motion.div>
      </div>

      {/* ── PROJECTS GRID ── */}
      <div className="max-w-[1400px] mx-auto px-6 pb-24">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border border-white/5 bg-white/[0.01]">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
              <Sparkles className="w-6 h-6 text-white/40" />
            </div>
            <h3 className="text-xl font-sora font-bold text-white mb-2">
              No projects found
            </h3>
            <p className="text-white/40 text-sm max-w-sm mx-auto">
              No works match your current selection. Try selecting &apos;All Works&apos; or clearing your search.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#C3143D] text-white text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all cursor-pointer shadow-[0_0_20px_rgba(195,20,61,0.4)]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => {
                  const absoluteIndex = index;
                  const category = categories.find(
                    (c: any) => c.id === project.categoryId
                  );
                  const categoryTitle = (
                    project.categoryNameEn ||
                    category?.nameEn ||
                    project.categoryNameAr ||
                    category?.nameAr ||
                    "Live Production"
                  ).trim();
                  const isVideo = project.thumbnailType === MediaType.Video;
                  const hasCover = isValidImageCover(project.thumbnailUrl);
                  const projectCaption = (
                    project.captionEn ||
                    project.captionAr ||
                    "Cinematic Project"
                  ).trim();

                  return (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <Link
                        href={`/portfolio/${project.id}`}
                        className="block h-full group"
                      >
                        <motion.div
                          whileHover={{ y: -6, scale: 1.02 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="relative rounded-2xl md:rounded-[1.75rem] overflow-hidden aspect-[4/5] sm:aspect-[3/4] border border-white/10 hover:border-[#C3143D]/60 transition-all duration-500 shadow-[0_15px_40px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_50px_rgba(195,20,61,0.25)] bg-black cursor-pointer h-full flex flex-col justify-between p-6 md:p-7"
                        >
                          {/* Background Media (Black space is default for videos) */}
                          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                            {hasCover ? (
                              <CloudinaryImage
                                src={project.thumbnailUrl!}
                                alt={projectCaption}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className={
                                  isVideo
                                    ? "object-contain bg-black transition-transform duration-700 ease-out group-hover:scale-105"
                                    : "object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                                }
                              />
                            ) : isVideo ? (
                              <div className="w-full h-full bg-black" />
                            ) : (
                              <CloudinaryImage
                                src="/images/revo-hero-bg.jpg"
                                alt={projectCaption}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/25" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#C3143D]/25 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          </div>

                          {/* Center Play Button for Video Items */}
                          {isVideo && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                              <div className="w-14 h-14 rounded-full bg-[#C3143D] text-white flex items-center justify-center shadow-[0_0_30px_rgba(195,20,61,0.55)] group-hover:scale-110 transition-transform duration-300">
                                <Play size={22} className="fill-current ml-0.5" />
                              </div>
                            </div>
                          )}

                          {/* Top Bar: Category Pill & Index Number */}
                          <div className="relative z-10 flex items-center justify-between">
                            <div className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-lg group-hover:border-[#C3143D]/40 transition-colors">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D] animate-pulse shadow-[0_0_8px_#C3143D]" />
                              {categoryTitle}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white/30 font-sora font-extrabold text-sm tracking-wider group-hover:text-white/80 transition-colors">
                                {String(absoluteIndex + 1).padStart(2, "0")}
                              </span>
                            </div>
                          </div>

                          {/* Bottom Content Area */}
                          <div className="relative z-10 mt-auto pt-8">
                            <h3 className="text-xl md:text-2xl font-sora font-extrabold text-white tracking-tight group-hover:text-red-100 transition-colors drop-shadow-md leading-snug">
                              {projectCaption}
                            </h3>

                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C3143D] group-hover:text-red-300 transition-colors">
                                {isVideo ? "Watch Film" : "View Case Study"}
                              </span>
                              <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md group-hover:bg-[#C3143D] flex items-center justify-center transition-colors">
                                <ArrowUpRight
                                  size={14}
                                  className="text-white group-hover:rotate-45 transition-transform duration-300"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 pointer-events-none" />
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* ── TOTAL PROJECTS COUNT ── */}
            <div className="flex items-center justify-center pt-10 border-t border-white/10">
              <div className="text-xs text-white/40 tracking-wider uppercase font-semibold">
                Total{" "}
                <span className="text-white font-bold">
                  {filteredProjects.length}
                </span>{" "}
                Projects
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
