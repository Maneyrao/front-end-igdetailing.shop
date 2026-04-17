"use client"

import { Truck, Shield, Headphones, CreditCard } from "lucide-react"

export function ShippingTicker() {
  const messages = [
    { icon: Truck, text: "FREE SHIPPING ON ORDERS OVER $75" },
    { icon: Shield, text: "100% AUTHENTIC PRODUCTS" },
    { icon: Headphones, text: "WHATSAPP SUPPORT AVAILABLE" },
    { icon: CreditCard, text: "SECURE PAYMENT" },
  ]

  return (
    <div className="sticky top-0 z-50 bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="flex gap-12">
        {/* First set for infinite scroll */}
        <div className="flex items-center gap-12 whitespace-nowrap animate-marquee-infinite">
          {messages.map((item, index) => (
            <span
              key={`set1-${index}`}
              className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium uppercase tracking-wide"
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.text}
            </span>
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex items-center gap-12 whitespace-nowrap animate-marquee-infinite" aria-hidden="true">
          {messages.map((item, index) => (
            <span
              key={`set2-${index}`}
              className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium uppercase tracking-wide"
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.text}
            </span>
          ))}
        </div>
        {/* Third set to ensure no gaps */}
        <div className="flex items-center gap-12 whitespace-nowrap animate-marquee-infinite" aria-hidden="true">
          {messages.map((item, index) => (
            <span
              key={`set3-${index}`}
              className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium uppercase tracking-wide"
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
