import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/toaster"
import { ShippingTicker } from "@/components/shipping-ticker"
import { WhatsAppButton } from "@/components/whatsapp-button"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "IG Detailing Shop - Professional Car Detailing Products",
  description: "Premium car detailing products for enthusiasts and professionals. Shampoos, waxes, interior cleaners, microfiber towels, and complete detailing kits.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartProvider>
          <ShippingTicker />
          {children}
          <WhatsAppButton />
          <Toaster />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
