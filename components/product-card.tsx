"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import { Button } from "./ui/button"
import { useCart } from "./cart-provider"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import type { Product } from "@/lib/products"

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [showCartAnimation, setShowCartAnimation] = useState(false)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    setShowCartAnimation(true)

    const defaultSize = product.sizes?.[0] || "Standard"

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: defaultSize,
    })

    toast({
      title: "Added to cart",
      description: `${product.name}${product.sizes && product.sizes.length > 1 ? ` - ${defaultSize}` : ""}`,
      duration: 2000,
    })

    setTimeout(() => {
      setIsAdding(false)
      setShowCartAnimation(false)
    }, 2000)
  }

  return (
    <div className="group relative">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-secondary rounded-lg mb-4">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

          {product.bestSeller && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
              Best Seller
            </span>
          )}

          {showCartAnimation && (
            <div className="absolute top-3 right-3 animate-in zoom-in-50 fade-in duration-300">
              <div className="bg-primary text-primary-foreground rounded-full p-2 animate-bounce">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
          )}

          <Button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 disabled:scale-100"
            size="sm"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            {isAdding ? "Added!" : "Quick Add"}
          </Button>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-primary uppercase tracking-wider font-medium">{product.category}</p>
          <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
          <p className="text-sm font-bold">${product.price.toFixed(2)}</p>
        </div>
      </Link>
    </div>
  )
}
