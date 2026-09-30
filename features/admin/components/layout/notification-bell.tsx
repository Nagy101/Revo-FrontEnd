"use client"

import React, { useState, useRef, useEffect } from "react"
import { Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNotifications } from "@/hooks/useNotifications"
import { useRouter } from "next/navigation"

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (id: string, targetUrl?: string) => {
    markAsRead(id);
    if (targetUrl) {
      // Map backend target URLs to actual Next.js routes
      // E.g. if the backend sends "/contact", "/admin/contact/123", or "/contact-requests"
      let finalUrl = targetUrl;
      const lowerUrl = targetUrl.toLowerCase();
      
      if (lowerUrl.includes("contact")) {
        finalUrl = "/admin/contact-requests";
      } else if (lowerUrl.includes("portfolio") || lowerUrl.includes("project")) {
        finalUrl = "/admin/portfolio";
      } else if (lowerUrl.includes("service")) {
        finalUrl = "/admin/services";
      } else if (lowerUrl.includes("category")) {
        finalUrl = "/admin/categories";
      } else if (!lowerUrl.startsWith("/admin")) {
        finalUrl = `/admin${targetUrl.startsWith("/") ? "" : "/"}${targetUrl}`;
      }

      router.push(finalUrl);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-white/60 hover:bg-white/5 hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-black">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-gray-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md">
              <h3 className="font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex flex-col">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id, notif.targetUrl)}
                    className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!notif.isRead ? 'bg-white/[0.02]' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${!notif.isRead ? 'text-white font-semibold' : 'text-white/70'}`}>
                        {notif.titleEn}
                      </h4>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                    <p className="text-xs text-white/50 line-clamp-2 mt-1">
                      {notif.messageEn}
                    </p>
                    <span className="text-[10px] text-white/30 mt-2 block">
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
                      }).format(new Date(notif.createdAt))}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
