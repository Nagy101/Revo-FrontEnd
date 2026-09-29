"use client"

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePublicServices } from "../hooks/useServices";
import { OptimizedGSAPSection } from "@/components/optimized-gsap-section";

const EASE = [0.16, 1, 0.3, 1] as const;

function ServicesHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scroll Parallax Effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const floatY1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const floatY3 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Mouse Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mousePixelX = useMotionValue(0);
  const mousePixelY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 150, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 150, mass: 0.5 });
  const smoothPixelX = useSpring(mousePixelX, {
    damping: 40,
    stiffness: 150,
    mass: 0.5,
  });
  const smoothPixelY = useSpring(mousePixelY, {
    damping: 40,
    stiffness: 150,
    mass: 0.5,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
      mousePixelX.set(e.clientX);
      mousePixelY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, mousePixelX, mousePixelY]);

  // GPU-Accelerated Spotlight Transform
  const spotlightX = useTransform(smoothPixelX, (x) => x - 800);
  const spotlightY = useTransform(smoothPixelY, (y) => y - 800);

  const imgX1 = useTransform(smoothX, [-1, 1], [-30, 30]);
  const imgY1 = useTransform(smoothY, [-1, 1], [-30, 30]);

  const imgX2 = useTransform(smoothX, [-1, 1], [40, -40]);
  const imgY2 = useTransform(smoothY, [-1, 1], [40, -40]);

  const imgX3 = useTransform(smoothX, [-1, 1], [-50, 50]);
  const imgY3 = useTransform(smoothY, [-1, 1], [50, -50]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100dvh] h-auto py-24 md:py-0 lg:min-h-[900px] flex items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* ── BASE BACKGROUND ── */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 z-0 origin-top will-change-transform"
      >
        <img
          src="/images/agency_hero_bg.jpg"
          alt="Services Background"
          className="w-full h-full object-cover opacity-[0.2] grayscale-[40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/70 to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent h-full" />
      </motion.div>

      {/* ── MOUSE SPOTLIGHT (GPU ACCELERATED) ── */}
      {isMounted && (
        <motion.div
          className="fixed top-0 left-0 w-[1600px] h-[1600px] rounded-full pointer-events-none z-0 will-change-transform"
          style={{
            background:
              "radial-gradient(circle, rgba(195, 20, 61, 0.12) 0%, transparent 60%)",
            x: spotlightX,
            y: spotlightY,
          }}
        />
      )}

      {/* ── FLOATING PARALLAX IMAGES (DESKTOP) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block max-w-[1600px] mx-auto w-full">
        {/* Card 1: Top Left */}
        <motion.div
          style={{ y: floatY1, x: imgX1, rotate: -8 }}
          className="absolute left-[8%] top-[12%] w-56 h-72 rounded-3xl overflow-hidden border border-white/5 shadow-2xl opacity-60 backdrop-blur-sm"
        >
          <img
            src="/images/auth-bg.jpg"
            className="w-full h-full object-cover scale-110"
            alt="Web Design"
          />
          <div className="absolute inset-0 bg-[#C3143D]/20 mix-blend-overlay" />
        </motion.div>

        {/* Card 2: Bottom Right */}
        <motion.div
          style={{ y: floatY2, x: imgX2, rotate: 12 }}
          className="absolute right-[6%] bottom-[15%] w-64 h-80 rounded-3xl overflow-hidden border border-[#C3143D]/20 shadow-[0_0_40px_rgba(195,20,61,0.15)] opacity-80"
        >
          <img
            src="/images/agency_hero_bg.jpg"
            className="w-full h-full object-cover scale-110"
            alt="Digital Marketing"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] to-transparent opacity-50" />
        </motion.div>

        {/* Card 3: Bottom Left (Difference from Home) */}
        <motion.div
          style={{ y: floatY3, x: imgX3, rotate: 5 }}
          className="absolute left-[18%] bottom-[20%] w-48 h-60 rounded-3xl overflow-hidden border border-white/10 shadow-xl opacity-40 backdrop-blur-sm"
        >
          <img
            src="/images/auth-bg.jpg"
            className="w-full h-full object-cover scale-110 grayscale"
            alt="Branding"
          />
        </motion.div>
      </div>

      {/* ── NOISE OVERLAY ── */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'url("/images/noise.png")' }}
      />

      {/* ── MAIN CONTENT ── */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center mt-10 md:mt-20"
      >
        {/* Intro Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="flex items-center gap-4 mb-8 md:mb-12"
        >
          <div className="w-12 md:w-20 h-[1px] bg-gradient-to-r from-transparent to-white/30" />
          <span className="flex items-center gap-2 text-[#C3143D] text-xs md:text-sm font-semibold tracking-[0.3em] uppercase">
            <Sparkles className="w-4 h-4" /> Core Expertise
          </span>
          <div className="w-12 md:w-20 h-[1px] bg-gradient-to-l from-transparent to-white/30" />
        </motion.div>

        {/* Main Title Group */}
        <div className="flex flex-col items-center text-center">
          <div className="overflow-hidden pb-2">
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
              className="text-[4rem] sm:text-7xl md:text-[8rem] lg:text-[10rem] font-sora font-black uppercase tracking-tighter text-white leading-[0.9]"
            >
              Digital
            </motion.h1>
          </div>

          <div className="flex items-center justify-center gap-4 md:gap-8 overflow-hidden w-full">
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
              <h1 className="text-[3.5rem] sm:text-6xl md:text-[7rem] lg:text-[8.5rem] font-serif italic leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-[#C3143D] via-[#ff2a5f] to-[#C3143D] pr-4 drop-shadow-[0_0_30px_rgba(195,20,61,0.4)]">
                Arsenal
              </h1>
              {/* Subtle text glow */}
              <h1 className="absolute inset-0 text-[3.5rem] sm:text-6xl md:text-[7rem] lg:text-[8.5rem] font-serif italic leading-[0.9] text-[#C3143D] opacity-30 blur-2xl pointer-events-none">
                Arsenal
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
          className="max-w-3xl text-center text-white/60 text-base md:text-xl font-light mt-8 md:mt-12 leading-relaxed"
        >
          Unleash the full potential of your brand with our premium suite of creative engineering. We deliver high-impact digital platforms, striking visual identities, and cutting-edge production designed to dominate the market.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mt-10 md:mt-16"
        >
          <button
            onClick={() => {
              document
                .getElementById("all-services")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative px-8 py-4 md:px-10 md:py-5 bg-[#C3143D] text-white overflow-hidden rounded-full font-semibold tracking-widest uppercase text-xs md:text-sm shadow-[0_0_30px_rgba(195,20,61,0.3)] hover:shadow-[0_0_50px_rgba(195,20,61,0.5)] transition-all duration-500"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
            <span className="relative flex items-center gap-3">
              Explore Arsenal{" "}
              <ArrowUpRight
                size={16}
                className="group-hover:rotate-45 transition-transform duration-300"
              />
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* ── ROTATING BADGE ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 1.2, ease: EASE }}
        className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-32 h-32 md:w-40 md:h-40 hidden lg:flex items-center justify-center cursor-pointer group z-20"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-700"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-white fill-current"
          >
            <path
              id="circlePathS"
              d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
              fill="none"
            />
            <text className="text-[10px] uppercase font-bold tracking-[0.25em]">
              <textPath href="#circlePathS" startOffset="0%">
                ★ PREMIUM SERVICES ★ DIGITAL AGENCY
              </textPath>
            </text>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
export function ServicesPageContent() {
  const { data: services = [], isLoading } = usePublicServices();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(services.length / itemsPerPage);

  const paginatedServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Global mouse tracking for full-page ambient glow
  const globalMouseX = useMotionValue(0);
  const globalMouseY = useMotionValue(0);
  const globalSmoothX = useSpring(globalMouseX, {
    damping: 50,
    stiffness: 400,
    mass: 0.5,
  });
  const globalSmoothY = useSpring(globalMouseY, {
    damping: 50,
    stiffness: 400,
    mass: 0.5,
  });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      globalMouseX.set(e.clientX);
      globalMouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [globalMouseX, globalMouseY]);

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-[#C3143D]/30 border-t-[#C3143D] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative z-10 bg-[#050505] min-h-screen">
      {/* ── GLOBAL AMBIENT GLOW ── */}
      <motion.div
        style={{
          left: globalSmoothX,
          top: globalSmoothY,
          x: "-50%",
          y: "-50%",
        }}
        className="fixed w-[800px] h-[800px] bg-[#C3143D]/10 rounded-full blur-[200px] pointer-events-none z-0"
      />

      <ServicesHero />

      {/* ── SECTION DIVIDER & TITLE ── */}
      <div className="max-w-[1600px] mx-auto px-6 mt-16 md:mt-24 mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center text-center gap-6"
        >
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#C3143D] to-transparent" />

          <div className="flex flex-col gap-2">
            <span className="text-[#C3143D] text-xs font-bold uppercase tracking-[0.3em]">
              Expertise
            </span>
            <h2 className="text-4xl md:text-6xl font-serif italic text-white/90">
              Our <span className="text-[#C3143D]">Services</span>
            </h2>
          </div>

          <p className="text-white/40 max-w-lg text-sm md:text-base font-light">
            Explore our comprehensive suite of creative solutions designed to
            elevate your brand and deliver unforgettable digital experiences.
          </p>
        </motion.div>
      </div>

      {/* ── SERVICES GRID ── */}
      <div id="all-services" className="pt-10 scroll-mt-24">
        <OptimizedGSAPSection
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto px-6 md:px-12 pb-16"
          animationType="stagger"
          threshold={0.1}
        >
          {paginatedServices.map((service, index) => {
            // Keep absolute index for display number
            const absoluteIndex = (currentPage - 1) * itemsPerPage + index;

            return (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="block h-full"
              >
                <motion.div
                  data-animate
                  className="group relative rounded-[2rem] overflow-hidden aspect-[4/5] sm:aspect-square border border-white/10 hover:border-white/20 transition-all duration-700 hover:shadow-[0_0_50px_rgba(195,20,61,0.15)] bg-[#050505] cursor-pointer h-full"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.nameEn}
                        className="w-full h-full object-cover transition-transform duration-1500 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#111]" />
                    )}
                  </div>

                  {/* Top Gradient Overlay */}
                  <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent opacity-60" />

                  {/* Bottom Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />

                  {/* Content Container (Absolute) */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                    {/* Top Row: Index */}
                    <div className="flex justify-between items-start">
                      <div className="backdrop-blur-md bg-white/10 border border-white/20 px-4 py-1.5 rounded-full flex items-center justify-center transform group-hover:bg-[#C3143D] group-hover:border-[#C3143D] transition-all duration-500 shadow-lg">
                        <span className="text-white font-black text-xs tracking-[0.2em]">
                          {String(absoluteIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Text & Arrow */}
                    <div className="flex flex-col gap-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out text-start">
                      <div className="flex flex-col gap-2">
                        {/* Hover Label */}
                        <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                          <div className="w-2 h-2 rounded-full bg-[#C3143D]" />
                          <span className="text-white/80 text-xs font-bold tracking-[0.15em] uppercase">
                            Service
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-lg">
                          {service.nameEn}
                        </h3>
                      </div>

                      {/* Arrow Button / View Service */}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-[#C3143D] group-hover:text-white transition-colors duration-500">
                          <ArrowUpRight
                            size={24}
                            className="group-hover:rotate-45 transition-transform duration-500"
                          />
                        </div>
                        <span className="text-white font-bold text-sm tracking-widest uppercase opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-75">
                          Explore
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </OptimizedGSAPSection>
      </div>

      {/* ── PAGINATION CONTROLS ── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pb-32 pt-8 relative z-10">
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                window.scrollTo({
                  top: window.innerHeight * 0.85,
                  behavior: "smooth",
                });
              }
            }}
            disabled={currentPage === 1}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all mr-2"
            aria-label="Previous Page"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentPage(i + 1);
                window.scrollTo({
                  top: window.innerHeight * 0.85,
                  behavior: "smooth",
                });
              }}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full text-sm font-bold transition-all duration-300 ${
                currentPage === i + 1
                  ? "bg-[#C3143D] text-white shadow-[0_0_15px_rgba(195,20,61,0.5)]"
                  : "bg-transparent text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}

          <button
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                window.scrollTo({
                  top: window.innerHeight * 0.85,
                  behavior: "smooth",
                });
              }
            }}
            disabled={currentPage === totalPages}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all ml-2"
            aria-label="Next Page"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

