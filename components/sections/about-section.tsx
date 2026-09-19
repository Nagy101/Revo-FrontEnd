"use client"

import Image from "next/image"
import { gsap } from "@/lib/gsap"
import { useGSAP } from "@/hooks/use-gsap"

export function AboutSection() {
  const containerRef = useGSAP(() => {
    // Text animations
    gsap.fromTo(
      ".about-title",
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-title",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    gsap.fromTo(
      ".about-text",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".about-text",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Stats counter animation
    gsap.fromTo(
      ".stat-number",
      { textContent: 0 },
      {
        textContent: (i: number, target: Element) => (target as HTMLElement).dataset.count,
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: ".stats-container",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Image reveal animation
    gsap.fromTo(
      ".about-image",
      { scale: 1.2, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-image",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Badge entrance animation
    gsap.fromTo(
      ".about-badge",
      { scale: 0, rotation: -180 },
      {
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".about-badge",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Parallax effect for image
    gsap.to(".about-image", {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current!,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })
  })

  return (
    <section ref={containerRef} className="py-32 noise-overlay">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="about-title text-5xl md:text-6xl font-sora font-bold uppercase mb-8">
              About <span className="gradient-text">REVO</span>
            </h2>
            <p className="about-text text-xl text-foreground/80 mb-8 leading-relaxed">
              We are a premium creative agency specializing in cinematic storytelling, brand identity, and digital
              experiences that leave lasting impressions.
            </p>
            <p className="about-text text-lg text-foreground/70 mb-12 leading-relaxed">
              Our team of visionaries, strategists, and creators work together to transform ideas into powerful visual
              narratives that connect with audiences on an emotional level.
            </p>

            <div className="stats-container grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="stat-number text-3xl font-bold text-primary mb-2" data-count="150">
                  0
                </div>
                <div className="text-sm text-foreground/60">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="stat-number text-3xl font-bold text-secondary mb-2" data-count="50">
                  0
                </div>
                <div className="text-sm text-foreground/60">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="stat-number text-3xl font-bold text-primary mb-2" data-count="5">
                  0
                </div>
                <div className="text-sm text-foreground/60">Years Experience</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="about-image relative">
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="REVO Creative Team"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl"
              />

              {/* Animated REVO badge */}
              <div
                className="about-badge absolute -bottom-6 -right-6 w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/25 shadow-[0_10px_35px_rgba(220,38,38,0.35)] float-y"
                aria-label="REVO badge"
              >
                {/* Base crimson gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary" />

                {/* Breathing ambient glow expanded beyond bounds, clipped by overflow-hidden */}
                <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-primary to-secondary blur-2xl opacity-60 pulse-soft" />

                {/* Rotating sheen using a conic gradient */}
                <div
                  className="absolute inset-0 rounded-full mix-blend-screen opacity-35 spin-slow"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.28) 55deg, rgba(255,255,255,0) 120deg, rgba(255,255,255,0.18) 185deg, rgba(255,255,255,0) 240deg, rgba(255,255,255,0.2) 300deg, rgba(255,255,255,0) 360deg)",
                  }}
                  aria-hidden="true"
                />

                {/* Label */}
                <div className="relative z-10 flex h-full items-center justify-center">
                  <span className="text-white font-bold text-lg tracking-wide">REVO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoped animation styles with motion preferences */}
      <style jsx>{`
        .spin-slow {
          animation: spinSlow 12s linear infinite;
          will-change: transform;
        }
        .pulse-soft {
          animation: pulseSoft 4s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .float-y {
          animation: floatY 6s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulseSoft {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.04);
            opacity: 1;
          }
        }
        @keyframes floatY {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .spin-slow,
          .pulse-soft,
          .float-y {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}
