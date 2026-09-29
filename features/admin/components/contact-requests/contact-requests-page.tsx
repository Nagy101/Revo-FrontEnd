"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Loader2, Check, CheckCircle2, MessageSquare, Phone, Calendar, Mail, MapPin, Briefcase, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react"
import { useContactRequests, useMarkContactRequestAsRead } from "@/features/contact/hooks/useContactRequests"
import { useServices } from "@/features/services/hooks/useServices"

export function ContactRequestsPage() {
  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 10
  const [filterRead, setFilterRead] = useState<boolean | undefined>(undefined)

  const { data, isLoading, isError } = useContactRequests(pageIndex, pageSize, filterRead)
  const { mutate: markAsRead, isPending: isMarking } = useMarkContactRequestAsRead()
  
  const { data: servicesData } = useServices(1, 100)
  const services = servicesData?.data?.data || []

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)

  const requests = data?.data?.data || []
  const totalPages = data?.data?.totalPages || 1

  const selectedRequest = requests.find(r => r.id === selectedRequestId)

  const getServiceName = (id?: string) => {
    if (!id) return null
    const svc = services.find(s => s.id === id)
    return svc ? svc.nameEn : "Loading..."
  }

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const formatDateShort = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatDateLong = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col gap-8 h-full max-h-[calc(100vh-8rem)]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Inbox</h1>
          <p className="text-white/40 text-sm">Manage your incoming inquiries and service bookings.</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 lg:min-h-[600px] lg:h-[calc(100vh-14rem)]">
        
        {/* LEFT COLUMN: List */}
        <div className={`${selectedRequestId ? 'hidden lg:flex' : 'flex'} w-full lg:w-[400px] xl:w-[450px] flex-col bg-[#050505] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative h-[calc(100vh-16rem)] lg:h-auto`}>
          
          {/* Filters */}
          <div className="p-5 border-b border-white/5 bg-[#0a0a0a] flex-shrink-0 z-20 shadow-sm">
            <div className="flex gap-2 bg-[#111] p-1.5 rounded-xl border border-white/5">
              <button
                onClick={() => setFilterRead(undefined)}
                className={`flex-1 px-4 py-2 text-xs font-medium rounded-lg transition-all ${filterRead === undefined ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterRead(false)}
                className={`flex-1 px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${filterRead === false ? 'bg-[#C3143D]/20 text-[#C3143D] shadow-sm' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
              >
                Unread
                {filterRead !== false && <span className="w-1.5 h-1.5 rounded-full bg-[#C3143D]" />}
              </button>
              <button
                onClick={() => setFilterRead(true)}
                className={`flex-1 px-4 py-2 text-xs font-medium rounded-lg transition-all ${filterRead === true ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
              >
                Read
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#050505]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#050505]/80 z-10 backdrop-blur-sm">
                <Loader2 className="animate-spin text-[#C3143D]" size={30} />
              </div>
            )}
            
            {requests.length === 0 && !isLoading && (
              <div className="p-12 text-center flex flex-col items-center justify-center h-full text-white/30">
                <Mail size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Inbox is empty.</p>
              </div>
            )}

            <div className="flex flex-col p-2 gap-1">
              {requests.map(req => {
                const isSelected = selectedRequestId === req.id;
                return (
                  <button
                    key={req.id}
                    onClick={() => setSelectedRequestId(req.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 relative group ${isSelected ? 'bg-gradient-to-r from-white/10 to-white/5 border border-white/10 shadow-lg' : 'border border-transparent hover:bg-white/[0.03]'}`}
                  >
                    {!req.isRead && !isSelected && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C3143D] shadow-[0_0_10px_rgba(195,20,61,0.5)]" />
                    )}
                    
                    <div className={`flex flex-col gap-2 ${!req.isRead && !isSelected ? 'pl-4' : ''} transition-all`}>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className={`font-semibold truncate text-sm ${isSelected ? 'text-white' : !req.isRead ? 'text-white' : 'text-white/60'}`}>
                          {req.name}
                        </h3>
                        <span className={`text-[10px] whitespace-nowrap mt-0.5 ${isSelected ? 'text-white/60' : 'text-white/30'}`}>
                          {formatDateShort(req.createdAt)}
                        </span>
                      </div>
                      
                      <p className={`text-xs line-clamp-1 ${isSelected ? 'text-white/80' : 'text-white/40'}`}>
                        {req.message}
                      </p>
                      
                      <div className="flex justify-between items-center mt-1">
                        {req.serviceId ? (
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium truncate max-w-[180px] ${isSelected ? 'bg-[#C3143D]/20 text-[#C3143D]' : 'bg-white/5 text-white/40'}`}>
                            {getServiceName(req.serviceId)}
                          </span>
                        ) : (
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${isSelected ? 'bg-white/10 text-white/70' : 'bg-white/5 text-white/30'}`}>
                            General Inquiry
                          </span>
                        )}

                        {req.isRead && <CheckCircle2 size={12} className={isSelected ? 'text-white/40' : 'text-white/10'} />}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Creative Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-white/5 bg-[#0a0a0a] flex justify-between items-center shrink-0">
              <button 
                disabled={pageIndex === 1} 
                onClick={() => setPageIndex(p => p - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border border-white/10 text-white/50 hover:bg-white/5 hover:text-white disabled:opacity-20 transition-all group shrink-0"
                aria-label="Previous Page"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              
              {/* Progress Indicator */}
              <div className="flex-1 flex justify-center px-4">
                <div className="w-full max-w-[120px] h-1.5 bg-white/5 rounded-full overflow-hidden relative" title={`Page ${pageIndex} of ${totalPages}`}>
                  <motion.div 
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#A01030] to-[#C3143D] rounded-full"
                    initial={false}
                    animate={{ width: `${(pageIndex / totalPages) * 100}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </div>
              </div>

              <button 
                disabled={pageIndex === totalPages} 
                onClick={() => setPageIndex(p => p + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent border border-white/10 text-white/50 hover:bg-[#C3143D]/10 hover:text-[#C3143D] hover:border-[#C3143D]/30 disabled:opacity-20 transition-all group shrink-0"
                aria-label="Next Page"
              >
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Details View */}
        <div className={`${selectedRequestId ? 'flex' : 'hidden lg:flex'} flex-1 bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative h-[calc(100vh-16rem)] lg:h-auto`}>
          {selectedRequest ? (
            <div className="flex flex-col w-full h-full">
              {/* Toolbar */}
              <div className="h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 flex-shrink-0">
                <div className="flex items-center gap-3 lg:gap-4">
                  <button 
                    onClick={() => setSelectedRequestId(null)}
                    className="lg:hidden p-2 -ml-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5">
                    <span className="text-sm font-bold text-white/70">{selectedRequest.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h2 className="font-medium text-white text-sm">{selectedRequest.name}</h2>
                    <p className="text-[11px] text-white/40">{formatDateLong(selectedRequest.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {!selectedRequest.isRead && (
                    <button
                      disabled={isMarking}
                      onClick={() => handleMarkAsRead(selectedRequest.id)}
                      className="flex items-center gap-2 px-3 lg:px-5 py-2 rounded-xl bg-[#C3143D] hover:bg-[#A01030] text-white text-[10px] lg:text-xs font-medium transition-colors shadow-[0_0_20px_rgba(195,20,61,0.3)] disabled:opacity-50"
                    >
                      {isMarking ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      <span className="hidden sm:inline">Mark as Read</span>
                      <span className="sm:hidden">Read</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5 lg:p-10 custom-scrollbar">
                <div className="max-w-3xl">
                  {/* Meta Details Card */}
                  <div className="flex flex-wrap gap-3 mb-8 lg:mb-10 p-4 lg:p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 text-xs lg:text-sm">
                      <Phone size={14} className="text-white/40" />
                      <a href={`tel:${selectedRequest.phoneNumber}`} className="text-white/80 hover:text-white transition-colors">
                        {selectedRequest.phoneNumber}
                      </a>
                    </div>
                    {selectedRequest.serviceId ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#C3143D]/10 text-xs lg:text-sm border border-[#C3143D]/20">
                        <Briefcase size={14} className="text-[#C3143D]" />
                        <span className="text-white/90">
                          Interested in <span className="text-[#C3143D] font-bold">{getServiceName(selectedRequest.serviceId)}</span>
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 text-xs lg:text-sm">
                        <MessageSquare size={14} className="text-white/40" />
                        <span className="text-white/60">General Inquiry</span>
                      </div>
                    )}
                  </div>

                  {/* Message Body */}
                  <div className="prose prose-invert prose-p:leading-relaxed prose-sm lg:prose-lg max-w-none">
                    {selectedRequest.message ? (
                      <div className="text-white/80 whitespace-pre-wrap font-light text-[14px] lg:text-[15px] leading-7 lg:leading-8">
                        {selectedRequest.message}
                      </div>
                    ) : (
                      <span className="text-white/20 italic flex items-center gap-2">
                        <MessageSquare size={16} /> No message content provided.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/20 p-8 bg-[url('/noise.png')] bg-repeat opacity-80 mix-blend-overlay">
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-6">
                <Mail size={32} className="opacity-40" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-white/60">No Request Selected</h3>
              <p className="text-sm text-white/30 text-center max-w-xs">Select an inquiry from the list on the left to view its complete details here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
