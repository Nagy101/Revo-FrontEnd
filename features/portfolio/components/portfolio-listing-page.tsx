"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  ArrowUpRight,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
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
import { useCategories } from "@/features/categories/hooks/useCategories";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EASE = [0.16, 1, 0.3, 1] as const;

// Marquee items
const MARQUEE_ITEMS = [
  "Creative Direction",
  "Brand Identity",
  "Web Development",
  "UI/UX Design",
  "Digital Marketing",
  "Motion Design",
];

function MarqueeStrip() {
  // Triple the items to ensure a perfectly seamless endless loop
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  const MarqueeContent = ({ filled }: { filled?: boolean }) => (
    <motion.div
      className="flex gap-16 md:gap-24 whitespace-nowrap items-center w-max"
      animate={{ x: ["0%", "-33.333333%"] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-16 md:gap-24">
          <span
            className={`text-2xl md:text-4xl font-black uppercase tracking-tighter cursor-default transition-all ${
              filled ? "text-white/95" : "text-transparent"
            }`}
            style={{
              WebkitTextStroke: filled ? "none" : "1px rgba(255,255,255,0.15)",
              textShadow: filled ? "0 0 12px rgba(255,255,255,0.2)" : "none",
            }}
          >
            {item}
          </span>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className={`text-lg md:text-2xl ${filled ? "text-white/95" : "text-[#C3143D]"}`}
            style={{
              filter: filled
                ? "drop-shadow(0 0 6px rgba(255,255,255,0.3))"
                : "none",
            }}
          >
            ✦
          </motion.div>
        </div>
      ))}
    </motion.div>
  );

  return (
    <div className="overflow-hidden py-6 md:py-8 bg-[#030303] border-y border-white/[0.04] relative group mt-8 md:mt-16">
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-[#C3143D]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Base Layer: Outlined Text */}
      <MarqueeContent />

      {/* Overlay Layer: Filled Text with Spotlight Mask */}
      <div
        className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, transparent 20%, black 40%, black 60%, transparent 80%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, transparent 20%, black 40%, black 60%, transparent 80%, transparent 100%)",
        }}
      >
        <MarqueeContent filled />
      </div>
    </div>
  );
}

export function PortfolioListingPage() {
  const { data: portfolios = [], isLoading: isLoadingPortfolios } =
    usePublicPortfolios();
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useCategories();
  const categories = categoriesResponse?.data?.data || [];

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { scrollY } = useScroll();

  // Parallax effects (using absolute pixels instead of ref progress to avoid hydration crashes)
  const heroY = useTransform(scrollY, [0, 1000], ["0%", "25%"]);
  const heroScale = useTransform(scrollY, [0, 1000], [1, 0.85]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);

  // Mouse tracking for red glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 150, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 150, mass: 0.5 });
  const imgX1 = useTransform(smoothX, [-1000, 1000], [-40, 40]);
  const imgY1 = useTransform(smoothY, [-1000, 1000], [-40, 40]);
  const imgX2 = useTransform(smoothX, [-1000, 1000], [50, -50]);
  const imgY2 = useTransform(smoothY, [-1000, 1000], [30, -30]);
  const imgX3 = useTransform(smoothX, [-1000, 1000], [-30, 30]);
  const imgY3 = useTransform(smoothY, [-1000, 1000], [50, -50]);
  const imgX4 = useTransform(smoothX, [-1000, 1000], [40, -40]);
  const imgY4 = useTransform(smoothY, [-1000, 1000], [-40, 40]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Filtering logic executed directly on render
  let filteredProjects = portfolios;
  if (selectedCategory !== "All") {
    filteredProjects = filteredProjects.filter(
      (p) => p.categoryId === selectedCategory,
    );
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredProjects = filteredProjects.filter(
      (p) =>
        p.captionEn?.toLowerCase().includes(q) ||
        p.captionAr?.toLowerCase().includes(q),
    );
  }

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const projectsRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (projectsRef.current) {
      const y =
        projectsRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (isLoadingPortfolios || isLoadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-[#C3143D]/30 border-t-[#C3143D] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* ─── HERO SECTION ─── */}
      <div className="relative w-full overflow-hidden bg-[#050505] min-h-[90dvh] flex items-center justify-center pt-20">
        {/* ── BACKGROUND LAYER (Subtle parallax) ── */}
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0 origin-top"
        >
          <img
            src="/images/auth-bg.jpg"
            alt="Creative Agency Background"
            className="w-full h-full object-cover opacity-[0.15] grayscale-[60%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/60 to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent h-full" />
        </motion.div>

        {/* ── DYNAMIC SPOTLIGHT GLOW ── */}
        <motion.div
          className="absolute pointer-events-none z-0 rounded-full"
          style={{
            width: 800,
            height: 800,
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
            background:
              "radial-gradient(circle, rgba(195, 20, 61, 0.15) 0%, transparent 60%)",
          }}
        />

        {/* ── FLOATING PORTFOLIO IMAGES (UNIQUE TO PORTFOLIO) ── */}
        <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block max-w-[1800px] mx-auto w-full">
          <motion.div
            style={{
              x: imgX1,
              y: imgY1,
              rotate: -6,
            }}
            className="absolute left-[5%] top-[10%] w-48 h-64 rounded-2xl overflow-hidden border border-white/5 shadow-2xl opacity-60"
          >
            <img
              src="/images/agency_hero_bg.jpg"
              className="w-full h-full object-cover scale-110"
              alt="Work"
            />
            <div className="absolute inset-0 bg-[#C3143D]/20 mix-blend-overlay" />
          </motion.div>
          <motion.div
            style={{
              x: imgX2,
              y: imgY2,
              rotate: 12,
            }}
            className="absolute right-[8%] top-[15%] w-56 h-72 rounded-3xl overflow-hidden border border-[#C3143D]/20 shadow-[0_0_40px_rgba(195,20,61,0.15)] opacity-80"
          >
            <img
              src="/images/auth-bg.jpg"
              className="w-full h-full object-cover scale-110"
              alt="Work"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] to-transparent opacity-30" />
          </motion.div>
          <motion.div
            style={{
              x: imgX3,
              y: imgY3,
              rotate: -15,
            }}
            className="absolute left-[12%] bottom-[15%] w-60 h-80 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] opacity-90"
          >
            <img
              src="/images/auth-bg.jpg"
              className="w-full h-full object-cover scale-110 grayscale"
              alt="Work"
            />
          </motion.div>
          <motion.div
            style={{
              x: imgX4,
              y: imgY4,
              rotate: 8,
            }}
            className="absolute right-[15%] bottom-[10%] w-44 h-56 rounded-2xl overflow-hidden border border-white/10 shadow-xl opacity-50 backdrop-blur-sm"
          >
            <img
              src="/images/agency_hero_bg.jpg"
              className="w-full h-full object-cover scale-110"
              alt="Work"
            />
          </motion.div>
        </div>

        {/* ── NOISE OVERLAY ── */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: 'url("/images/noise.png")' }}
        />

        {/* ── MAIN CONTENT ── */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center mt-10 md:mt-20"
        >
          {/* Intro Tag */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            className="flex items-center gap-4 mb-8 md:mb-12"
          >
            <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-[#C3143D]" />
            <span className="text-white text-xs md:text-sm font-bold tracking-[0.3em] uppercase flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C3143D] animate-pulse" />
              Featured Work
            </span>
            <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-[#C3143D]" />
          </motion.div>

          {/* Main Title Group */}
          <div className="flex flex-col items-center text-center w-full">
            <div className="overflow-hidden pb-2">
              <motion.h1
                initial={{ y: "100%", opacity: 0, rotate: 2 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
                className="text-[4rem] sm:text-6xl md:text-[8rem] lg:text-[10rem] font-sora font-black uppercase tracking-tighter text-white leading-[0.9] drop-shadow-2xl"
              >
                Digital
              </motion.h1>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 overflow-hidden w-full mt-2 md:mt-4 relative">
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
                className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-white/50 origin-right max-w-[150px]"
              />
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
                className="relative"
              >
                <h1 className="text-[3.5rem] sm:text-6xl md:text-[7rem] lg:text-[8.5rem] font-serif italic leading-[1] text-transparent bg-clip-text bg-gradient-to-br from-[#C3143D] via-[#ff2a5f] to-[#C3143D] pr-4 drop-shadow-[0_0_30px_rgba(195,20,61,0.4)]">
                  Showcase
                </h1>
                {/* Subtle text glow */}
                <h1 className="absolute inset-0 text-[3.5rem] sm:text-6xl md:text-[7rem] lg:text-[8.5rem] font-serif italic leading-[1] text-[#C3143D] opacity-30 blur-2xl pointer-events-none">
                  Showcase
                </h1>
              </motion.div>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
                className="hidden md:block flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#C3143D]/50 to-[#C3143D] origin-left max-w-[150px]"
              />
            </div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.7 }}
            className="max-w-3xl text-center text-white/90 text-sm md:text-xl font-light mt-4 md:mt-6 leading-relaxed relative z-20"
          >
            Step into our curated exhibition of creative engineering. Witness how we transform bold visions into industry-defining realities that captivate and dominate.
          </motion.p>
        </motion.div>

        {/* ── ROTATING BADGE ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 1.2, ease: EASE }}
          className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-32 h-32 md:w-40 md:h-40 hidden lg:flex items-center justify-center pointer-events-none z-20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center opacity-40 transition-opacity duration-700"
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
                  ★ CRAFTING MASTERPIECES ★ DIGITAL AGENCY
                </textPath>
              </text>
            </svg>
          </motion.div>
        </motion.div>

        {/* Bottom edge fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-20 pointer-events-none" />
      </div>

      {/* ─── MARQUEE ─── */}
      <MarqueeStrip />

      {/* ─── WORKS SECTION ─── */}
      <div
        ref={projectsRef}
        className="max-w-[1600px] mx-auto px-6 md:px-12 pt-20 pb-32"
      >
        {/* Section label + filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16"
        >
          {/* Unified Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                size={18}
              />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-white/20 text-white placeholder:text-white/40 pl-11 h-12 rounded-full focus-visible:ring-[#C3143D]"
              />
            </div>

            {/* Category Select */}
            <div className="w-full sm:w-56">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full bg-transparent border-white/20 text-white h-12 rounded-full focus:ring-[#C3143D]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white rounded-2xl">
                  <SelectItem
                    value="All"
                    className="focus:bg-[#C3143D] focus:text-white rounded-xl cursor-pointer"
                  >
                    All Categories
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id}
                      className="focus:bg-[#C3143D] focus:text-white rounded-xl cursor-pointer"
                    >
                      {cat.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="w-16 h-px bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-[#C3143D]" />
            <span className="text-white/80 text-sm font-medium tracking-wide">
              Featured Projects
            </span>
          </div>
        </motion.div>

        {/* Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-32 rounded-lg border border-white/5 bg-white/[0.01]">
            <h3 className="text-2xl font-bold text-white mb-2">
              No projects found
            </h3>
            <p className="text-white/30">Try selecting a different category.</p>
          </div>
        ) : (
          <div className="space-y-12">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {paginatedProjects.map((project, index) => {
                  const category = categories.find(
                    (c) => c.id === project.categoryId,
                  );

                  return (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="group relative rounded-[2rem] overflow-hidden aspect-[4/5] sm:aspect-square border border-white/10 hover:border-white/20 transition-all duration-700 hover:shadow-[0_0_50px_rgba(195,20,61,0.15)] bg-[#050505]"
                    >
                      <Link
                        href={`/portfolio/${project.id}`}
                        className="block w-full h-full"
                      >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <CloudinaryImage
                            src={
                              project.thumbnailUrl || "/images/placeholder.jpg"
                            }
                            alt={project.captionEn || "Project thumbnail"}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-1500 ease-out group-hover:scale-110"
                          />
                        </div>

                        {/* Top Gradient Overlay (for index pill readability) */}
                        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent opacity-60" />

                        {/* Bottom Gradient Overlay (for text readability) */}
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />

                        {/* Content Container (Absolute) */}
                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                          {/* Top Row: Index & Play Button */}
                          <div className="flex justify-between items-start z-10">
                            {/* Index Pill */}
                            <div className="backdrop-blur-md bg-white/10 border border-white/20 px-4 py-1.5 rounded-full flex items-center justify-center transform group-hover:bg-[#C3143D] group-hover:border-[#C3143D] transition-all duration-500">
                              <span className="text-white font-black text-xs tracking-[0.2em]">
                                {String(
                                  (currentPage - 1) * ITEMS_PER_PAGE +
                                    index +
                                    1,
                                ).padStart(2, "0")}
                              </span>
                            </div>

                            {/* Video play button */}
                            {project.thumbnailType === 2 && (
                              <div className="w-12 h-12 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:bg-[#C3143D] group-hover:border-[#C3143D] group-hover:scale-110 transition-all duration-500 shadow-[0_0_30px_rgba(195,20,61,0)] group-hover:shadow-[0_0_30px_rgba(195,20,61,0.5)]">
                                <Play
                                  fill="white"
                                  className="w-4 h-4 ms-1 text-white"
                                />
                              </div>
                            )}
                          </div>

                          {/* Bottom Row: Text & Arrow */}
                          <div className="flex flex-col gap-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out z-10 text-start">
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                                <div className="w-2 h-2 rounded-full bg-[#C3143D]" />
                                <span
                                  className={`text-white/80 text-xs font-bold tracking-[0.15em] uppercase ${project.categoryNameAr ? "rtl:hidden" : ""}`}
                                >
                                  {project.categoryNameEn ||
                                    category?.nameEn ||
                                    "Portfolio"}
                                </span>
                                {project.categoryNameAr && (
                                  <span className="text-white/80 text-xs font-bold tracking-[0.15em] uppercase hidden rtl:block">
                                    {project.categoryNameAr}
                                  </span>
                                )}
                              </div>

                              <h3
                                className={`text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-lg ${project.captionAr ? "rtl:hidden" : ""}`}
                              >
                                {project.captionEn}
                              </h3>
                              {project.captionAr && (
                                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-lg hidden rtl:block">
                                  {project.captionAr}
                                </h3>
                              )}
                            </div>

                            {/* Arrow Button / View Project */}
                            <div className="flex items-center gap-4 mt-2">
                              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-[#C3143D] group-hover:text-white transition-colors duration-500">
                                <ArrowUpRight
                                  size={24}
                                  className="group-hover:rotate-45 transition-transform duration-500"
                                />
                              </div>
                              <span className="text-white font-bold text-sm tracking-widest uppercase opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-75">
                                View Project
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center gap-3 mt-16"
              >
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2 mx-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        currentPage === i + 1
                          ? "bg-[#C3143D] text-white"
                          : "bg-white/5 text-white/50 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
