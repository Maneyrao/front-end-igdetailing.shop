"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const phoneNumber = "5511999999999" // Replace with actual number
  const message = "Hi! I have a question about your detailing products."
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 animate-pulse-glow"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
