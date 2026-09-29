"use client"

import { useState } from "react"
import { motion, useScroll, useSpring, useMotionValue } from "framer-motion"
import { Mail, Phone, MapPin, Send, Loader2, ArrowUpRight } from "lucide-react"
import { useCreateContactRequest } from "@/features/contact/hooks/useContactRequests"
import { useServices } from "@/features/services/hooks/useServices"

const EASE = [0.16, 1, 0.3, 1] as const

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    serviceId: "",
    message: "",
  })

  // API Hooks
  const { mutate: submitContact, isPending } = useCreateContactRequest()
  const { data: servicesData } = useServices(1, 100) // fetch all services for dropdown
  const services = servicesData?.data?.data || []

  // Mouse tracking for red glow
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400, mass: 0.5 })
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400, mass: 0.5 })

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitContact(
      {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        message: formData.message,
        serviceId: formData.serviceId || undefined
      },
      {
        onSuccess: () => {
          setFormData({ name: "", phoneNumber: "", serviceId: "", message: "" })
        }
      }
    )
  }

  return (
    <div 
      className="relative min-h-screen bg-[#050505] selection:bg-[#C3143D] selection:text-white pb-32"
      onMouseMove={handleMouseMove}
    >
      {/* -- GLOBAL AMBIENT GLOW -- */}
      <motion.div 
        style={{ left: smoothX, top: smoothY, x: "-50%", y: "-50%" }}
        className="fixed w-[800px] h-[800px] bg-[#C3143D]/10 rounded-full blur-[200px] pointer-events-none z-0" 
      />

      <div className="relative z-10 max-w-[1400px] mx-auto pt-32 md:pt-40 px-6 md:px-16">
        
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-10 md:mb-16 max-w-4xl"
        >
          <div className="flex gap-2 items-center mb-6">
            <div className="w-2 h-2 rounded-full bg-[#C3143D]" />
            <span className="text-[#C3143D] text-xs font-bold tracking-[0.3em] uppercase">
              Get in Touch
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-black text-white leading-[1.1] tracking-tight mb-8">
            Let's create something <span className="italic font-serif font-light text-white/70">extraordinary.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 font-light max-w-2xl">
            Whether you have a specific project in mind or just want to explore possibilities, we're ready to listen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative">
          
          {/* LEFT COLUMN: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="lg:col-span-7"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8 bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl backdrop-blur-sm">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs font-bold text-white/50 uppercase tracking-wider pl-1">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl h-14 px-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C3143D] focus:ring-1 focus:ring-[#C3143D] transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber" className="text-xs font-bold text-white/50 uppercase tracking-wider pl-1">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl h-14 px-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C3143D] focus:ring-1 focus:ring-[#C3143D] transition-all"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="service" className="text-xs font-bold text-white/50 uppercase tracking-wider pl-1">Interested In (Optional)</label>
                <div className="relative">
                  <select
                    id="service"
                    value={formData.serviceId}
                    onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl h-14 px-5 text-white focus:outline-none focus:border-[#C3143D] focus:ring-1 focus:ring-[#C3143D] transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#111]">General Inquiry</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id} className="bg-[#111]">
                        {service.nameEn}
                      </option>
                    ))}
                  </select>
                  {/* Custom arrow for select */}
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-bold text-white/50 uppercase tracking-wider pl-1">Project Details</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C3143D] focus:ring-1 focus:ring-[#C3143D] transition-all resize-none"
                  placeholder="Tell us about your project, goals, and vision..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="group relative w-full h-16 bg-[#C3143D] rounded-2xl overflow-hidden mt-2 disabled:opacity-70 transition-all hover:shadow-[0_0_40px_rgba(195,20,61,0.4)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10 flex items-center justify-center gap-3 text-white font-bold tracking-widest uppercase text-sm">
                  {isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </motion.div>

          {/* RIGHT COLUMN: Contact Details Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="lg:col-span-5 flex flex-col pt-0 lg:pt-12"
          >
            <div className="space-y-4 mb-12">
              <h2 className="text-3xl font-serif italic text-white/90">
                Contact Details
              </h2>
              <div className="w-12 h-px bg-[#C3143D]" />
              <p className="text-white/40 text-sm leading-relaxed max-w-sm mt-4">
                We will update these placeholders once the official company contact details are provided. Reach out anytime.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {/* Email */}
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C3143D]/10 group-hover:border-[#C3143D]/30 transition-colors">
                  <Mail className="text-white/50 group-hover:text-[#C3143D] transition-colors" size={24} />
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Email Us</h3>
                  <a href="mailto:hello@revo.agency" className="text-xl text-white hover:text-[#C3143D] transition-colors">hello@revo.agency</a>
                  <a href="mailto:projects@revo.agency" className="text-white/60 hover:text-white transition-colors">projects@revo.agency</a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C3143D]/10 group-hover:border-[#C3143D]/30 transition-colors">
                  <Phone className="text-white/50 group-hover:text-[#C3143D] transition-colors" size={24} />
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Call Us</h3>
                  <a href="tel:+15551234567" className="text-xl text-white hover:text-[#C3143D] transition-colors">+1 (555) 123-4567</a>
                  <span className="text-white/60">Mon - Fri, 9am - 6pm</span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C3143D]/10 group-hover:border-[#C3143D]/30 transition-colors">
                  <MapPin className="text-white/50 group-hover:text-[#C3143D] transition-colors" size={24} />
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Visit Us</h3>
                  <p className="text-xl text-white leading-relaxed">
                    123 Creative Street<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>

            {/* Aesthetic card / Map placeholder */}
            <div className="mt-16 p-8 rounded-[2rem] border border-[#C3143D]/30 bg-gradient-to-br from-[#110508] to-[#050505] shadow-[0_0_50px_rgba(195,20,61,0.1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                <ArrowUpRight size={100} className="text-[#C3143D]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Follow Our Journey</h3>
              <p className="text-white/60 mb-6 relative z-10 max-w-[250px]">Stay updated with our latest creative projects on social media.</p>
              <div className="flex gap-4 relative z-10">
                <a href="#" className="text-white/40 hover:text-white font-bold tracking-wider text-xs uppercase">Instagram</a>
                <a href="#" className="text-white/40 hover:text-white font-bold tracking-wider text-xs uppercase">Twitter</a>
                <a href="#" className="text-white/40 hover:text-white font-bold tracking-wider text-xs uppercase">LinkedIn</a>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}
