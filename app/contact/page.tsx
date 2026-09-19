"use client"

import type React from "react"

// ===================================
// CONTACT PAGE COMPONENT
// Contact form, information, and FAQ section
// Features: Interactive form, contact details, FAQ
// ===================================

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"

// ===================================
// DATA CONSTANTS
// ===================================

const services = [
  "Video Production",
  "Photography",
  "Brand Identity",
  "Digital Marketing",
  "Web Design",
  "Creative Direction",
]

// ===================================
// CONTACT PAGE COMPONENT
// ===================================

export default function Contact() {
  // ===================================
  // STATE MANAGEMENT
  // ===================================

  const [selectedService, setSelectedService] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
    timeline: "",
  })

  // ===================================
  // EVENT HANDLERS
  // ===================================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // ===================================
  // RENDER COMPONENT
  // ===================================

  return (
    <div className="pt-24 pb-16">
      {/* ===================================
          PAGE HEADER
          Main title and introduction
          =================================== */}

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-sora font-bold uppercase mb-8">
            Let's <span className="gradient-text">Create</span>
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Ready to bring your vision to life? Get in touch and let's discuss how we can help elevate your brand
            through creative excellence.
          </p>
        </div>

        {/* ===================================
            MAIN CONTENT GRID
            Contact form and information
            =================================== */}

        <div className="grid lg:grid-cols-2 gap-16">
          {/* ===================================
              CONTACT FORM SECTION
              Interactive project inquiry form
              =================================== */}

          <div>
            <h2 className="text-3xl font-sora font-bold mb-8">Start Your Project</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Company Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="Your company name"
                />
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Service Needed *</label>
                <select
                  name="service"
                  required
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget and Timeline Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">Select budget range</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="50k+">$50,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Timeline</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">ASAP</option>
                    <option value="1-2months">1-2 months</option>
                    <option value="3-6months">3-6 months</option>
                    <option value="6months+">6+ months</option>
                  </select>
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Project Details *</label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your project, goals, and vision..."
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3">
                Send Message
                <Send size={20} />
              </button>
            </form>
          </div>

          {/* ===================================
              CONTACT INFORMATION SECTION
              Contact details and quick quote CTA
              =================================== */}

          <div>
            <h2 className="text-3xl font-sora font-bold mb-8">Get in Touch</h2>

            {/* Contact Details */}
            <div className="space-y-8 mb-12">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-foreground/70">hello@revo.agency</p>
                  <p className="text-foreground/70">projects@revo.agency</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-foreground/70">+1 (555) 123-4567</p>
                  <p className="text-foreground/70">+1 (555) 987-6543</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Office</h3>
                  <p className="text-foreground/70">123 Creative Street</p>
                  <p className="text-foreground/70">New York, NY 10001</p>
                </div>
              </div>
            </div>

            {/* Quick Quote CTA */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-sora font-bold mb-4">Need a Quick Quote?</h3>
              <p className="text-foreground/80 mb-6">
                Get an instant estimate for your project with our quick quote tool.
              </p>
              <button className="btn-outline w-full">Get Quick Quote</button>
            </div>
          </div>
        </div>

        {/* ===================================
            FAQ SECTION
            Frequently asked questions
            =================================== */}

        <div className="mt-32">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sora font-bold uppercase mb-8">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>

          {/* FAQ Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="p-6 bg-background/50 backdrop-blur-sm rounded-2xl border border-border">
                <h3 className="font-sora font-bold text-lg mb-3">What's your typical project timeline?</h3>
                <p className="text-foreground/70">
                  Project timelines vary based on scope and complexity. Most projects range from 4-12 weeks from concept
                  to completion.
                </p>
              </div>

              <div className="p-6 bg-background/50 backdrop-blur-sm rounded-2xl border border-border">
                <h3 className="font-sora font-bold text-lg mb-3">Do you work with international clients?</h3>
                <p className="text-foreground/70">
                  We work with clients worldwide and have experience managing projects across different time zones and
                  cultures.
                </p>
              </div>

              <div className="p-6 bg-background/50 backdrop-blur-sm rounded-2xl border border-border">
                <h3 className="font-sora font-bold text-lg mb-3">What's included in your creative process?</h3>
                <p className="text-foreground/70">
                  Our process includes strategy, concept development, design/production, revisions, and final delivery
                  with full project documentation.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="p-6 bg-background/50 backdrop-blur-sm rounded-2xl border border-border">
                <h3 className="font-sora font-bold text-lg mb-3">Do you offer ongoing support?</h3>
                <p className="text-foreground/70">
                  Yes, we provide ongoing support and maintenance packages to ensure your creative assets continue to
                  perform at their best.
                </p>
              </div>

              <div className="p-6 bg-background/50 backdrop-blur-sm rounded-2xl border border-border">
                <h3 className="font-sora font-bold text-lg mb-3">Can you work within our existing brand guidelines?</h3>
                <p className="text-foreground/70">
                  Definitely! We can work within your existing brand framework or help evolve and enhance your current
                  brand identity.
                </p>
              </div>

              <div className="p-6 bg-background/50 backdrop-blur-sm rounded-2xl border border-border">
                <h3 className="font-sora font-bold text-lg mb-3">What makes REVO different?</h3>
                <p className="text-foreground/70">
                  Our cinematic approach, attention to detail, and commitment to storytelling sets us apart. We don't
                  just create content—we craft experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
