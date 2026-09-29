"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useServiceDetails } from "../hooks/useServices";
import { ServiceBookingModal } from "./service-booking-modal";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ServiceDetailsPageProps {
  id: string;
}

export function ServiceDetailsPage({ id }: ServiceDetailsPageProps) {
  const { data, isLoading, error } = useServiceDetails(id);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], ["0%", "30%"]);
  const heroScale = useTransform(scrollY, [0, 1000], [1, 1.1]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);

  // Mouse tracking for red glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400, mass: 0.5 });

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-[#C3143D]/30 border-t-[#C3143D] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <h1 className="text-3xl font-bold mb-4">Service not found</h1>
        <Link
          href="/services"
          className="text-[#C3143D] hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Services
        </Link>
      </div>
    );
  }

  const service = data.data;

  return (
    <div className="relative bg-[#050505] min-h-screen selection:bg-[#C3143D] selection:text-white pb-16 md:pb-24">
      {/* ── GLOBAL AMBIENT GLOW ── */}
      <motion.div
        style={{ left: smoothX, top: smoothY, x: "-50%", y: "-50%" }}
        className="fixed w-[800px] h-[800px] bg-[#C3143D]/10 rounded-full blur-[200px] pointer-events-none z-0"
      />

      {/* ── ELEGANT TYPOGRAPHIC HERO ── */}
      <div className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-16 overflow-hidden min-h-[70dvh] flex items-center z-10">
        <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Breadcrumb */}
            <Link
              href="/services"
              className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300 w-fit mb-8 md:mb-12"
            >
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#C3143D] group-hover:border-[#C3143D] group-hover:text-white transition-all duration-300">
                <ArrowLeft size={16} />
              </div>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
                Back to Services
              </span>
            </Link>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.15 } },
              }}
              className="flex flex-col"
            >
              <div className="flex gap-4 items-center mb-6">
                <div className="w-12 h-px bg-white/40" />
                <span className="text-[#C3143D] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
                  Expertise Area
                </span>
              </div>

              <div className="overflow-hidden mb-2">
                <motion.h1
                  variants={{
                    hidden: { y: "100%", opacity: 0 },
                    show: {
                      y: 0,
                      opacity: 1,
                      transition: { duration: 1.2, ease: EASE },
                    },
                  }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black text-white leading-[1.1] tracking-tight max-w-4xl"
                >
                  {service.nameEn}
                </motion.h1>
              </div>

              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { duration: 1, delay: 0.6 } },
                }}
                className="mt-6 md:mt-10 max-w-lg"
              >
                <p className="text-white/50 text-sm md:text-base font-light leading-relaxed">
                  Discover how our tailored approach to{" "}
                  <span className="text-white font-medium">
                    {service.nameEn}
                  </span>{" "}
                  can transform your digital presence and elevate your brand
                  beyond expectations.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Image */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-8 lg:mt-0">
            <motion.div
              style={{ y: heroY, rotateY: smoothX, rotateX: smoothY }}
              className="w-full max-w-[500px] aspect-[4/5] md:aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-[0_0_80px_rgba(195,20,61,0.15)] relative group perspective-1000"
            >
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.nameEn}
                  className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-out"
                />
              ) : (
                <div className="w-full h-full bg-[#111]" />
              )}
              {/* Dynamic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#C3143D]/20 to-transparent mix-blend-overlay group-hover:opacity-100 opacity-0 transition-opacity duration-700" />

              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="backdrop-blur-md bg-white/10 border border-white/20 px-5 py-2.5 rounded-full shadow-xl">
                  <span className="text-white text-xs font-bold tracking-[0.2em] uppercase">
                    Premium Service
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#C3143D] text-white flex items-center justify-center shadow-[0_0_30px_rgba(195,20,61,0.4)]">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10 relative z-10" />

      {/* ── CONTENT SECTION ── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 pb-20">
        {/* Left Column: Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="lg:col-span-7 flex flex-col pt-0"
        >
          <div className="space-y-4 mb-10">
            <h2 className="text-3xl md:text-5xl font-serif italic text-white/90">
              Overview
            </h2>
            <div className="w-16 h-px bg-[#C3143D]" />
          </div>

          <div className="prose prose-invert prose-base md:prose-xl max-w-none text-white/70 leading-relaxed font-light mb-12">
            <p>{service.descriptionEn}</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex flex-col gap-4 group">
              <div className="w-12 h-12 rounded-full bg-[#C3143D]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-[#C3143D] w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">
                  Tailored Strategy
                </h4>
                <p className="text-white/40 text-sm leading-relaxed">
                  Custom solutions meticulously aligned with your specific
                  business goals.
                </p>
              </div>
            </div>
            <div className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex flex-col gap-4 group">
              <div className="w-12 h-12 rounded-full bg-[#C3143D]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-[#C3143D] w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">
                  Premium Execution
                </h4>
                <p className="text-white/40 text-sm leading-relaxed">
                  Delivering the highest standard of creative and technical
                  excellence.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Booking Widget */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="sticky top-32">
            <div className="p-8 md:p-10 rounded-[2.5rem] border border-[#C3143D]/30 bg-gradient-to-br from-[#110508] to-[#050505] shadow-[0_0_50px_rgba(195,20,61,0.1)] relative overflow-hidden group">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 p-8 opacity-10 md:opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                <ArrowUpRight size={160} className="text-[#C3143D]" />
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                <div>
                  <span className="text-[#C3143D] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                    Let's Collaborate
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                    Ready to elevate your project?
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Book this service or inquire for more details. Our dedicated
                    creative team will reach out within 24 hours to begin the
                    journey.
                  </p>
                </div>

                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full h-14 rounded-full bg-[#C3143D] text-white font-bold tracking-widest uppercase text-xs hover:bg-white hover:text-black transition-colors duration-500 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(195,20,61,0.3)] group/btn"
                >
                  <span>Book Service Now</span>
                  <ArrowUpRight
                    size={18}
                    className="group-hover/btn:rotate-45 transition-transform duration-500"
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <ServiceBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        service={service}
      />
    </div>
  );
}
