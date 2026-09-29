"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Loader2 } from "lucide-react"
import { useCreateContactRequest } from "@/features/contact/hooks/useContactRequests"
import { ServiceItem } from "../types"

interface ServiceBookingModalProps {
  isOpen: boolean
  onClose: () => void
  service: ServiceItem
}

export function ServiceBookingModal({ isOpen, onClose, service }: ServiceBookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    message: ""
  })
  
  const { mutate: sendInquiry, isPending } = useCreateContactRequest()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendInquiry(
      {
        serviceId: service.id,
        ...formData
      },
      {
        onSuccess: () => {
          // Reset form and close modal on success
          setFormData({ name: "", phoneNumber: "", message: "" })
          onClose()
        }
      }
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#C3143D]/10 to-transparent" />
                <div className="relative z-10">
                  <span className="text-[#C3143D] text-[10px] font-bold uppercase tracking-widest mb-1 block">Inquiry</span>
                  <h3 className="text-xl md:text-2xl font-bold text-white">{service.nameEn}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="relative z-10 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-bold text-white/50 uppercase tracking-wider pl-1">Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C3143D] focus:ring-1 focus:ring-[#C3143D] transition-all"
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
                      className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C3143D] focus:ring-1 focus:ring-[#C3143D] transition-all"
                      placeholder="+1 234 567 890"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs font-bold text-white/50 uppercase tracking-wider pl-1">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C3143D] focus:ring-1 focus:ring-[#C3143D] transition-all resize-none"
                      placeholder="Tell us about your project requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="mt-4 w-full h-14 rounded-full bg-[#C3143D] text-white font-bold tracking-widest uppercase text-sm hover:bg-[#a01032] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(195,20,61,0.3)] hover:shadow-[0_0_30px_rgba(195,20,61,0.5)]"
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
