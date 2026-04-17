"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { useCart } from "./cart-provider"
import { useToast } from "@/hooks/use-toast"
import { Check, ShoppingBag, AlertCircle, User, HelpCircle, BookOpen } from "lucide-react"
import type { Product } from "@/lib/products"

export function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "")
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showSizeError, setShowSizeError] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  const images = product.images || [product.image]

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 1 && !selectedSize) {
      setShowSizeError(true)
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart",
        variant: "destructive",
        duration: 3000,
      })
      setTimeout(() => setShowSizeError(false), 1000)
      return
    }

    setIsAdding(true)
    setShowSuccess(true)
    setShowSizeError(false)

    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize || product.sizes?.[0] || "Standard",
    }

    addItem(item)

    toast({
      title: "Added to cart!",
      description: `${product.name}${selectedSize ? ` - ${selectedSize}` : ""}`,
      duration: 2000,
    })

    setTimeout(() => {
      setIsAdding(false)
      setShowSuccess(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
        {/* Product Images */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
            <Image
              src={images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.bestSeller && (
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded">
                Best Seller
              </span>
            )}
            {product.isKit && (
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded">
                Complete Kit
              </span>
            )}
            {showSuccess && (
              <div className="absolute inset-0 bg-primary/90 flex items-center justify-center animate-in fade-in zoom-in-50 duration-300">
                <div className="bg-background text-foreground rounded-full p-4 sm:p-6 animate-in zoom-in-50 duration-500 delay-150">
                  <Check className="h-8 w-8 sm:h-12 sm:w-12" />
                </div>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-secondary rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-4 sm:mb-6">
            <p className="text-xs text-primary uppercase tracking-wider mb-2 font-medium">{product.category}</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-balance">
              {product.name}
            </h1>
            <p className="text-2xl sm:text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8">
            {product.description}
          </p>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 1 && (
            <div className={`mb-6 sm:mb-8 transition-all duration-300 ${showSizeError ? "animate-shake" : ""}`}>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-semibold text-sm sm:text-base">Select Size</h3>
                {showSizeError && (
                  <div className="flex items-center gap-1 text-destructive text-xs sm:text-sm animate-in fade-in slide-in-from-right-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Please select a size</span>
                  </div>
                )}
              </div>
              <div
                className={`flex flex-wrap gap-2 p-3 border-2 rounded-lg transition-colors ${
                  showSizeError ? "border-destructive bg-destructive/5" : "border-transparent"
                }`}
              >
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size)
                      setShowSizeError(false)
                    }}
                    className={`px-4 sm:px-6 py-2 sm:py-3 border rounded-lg transition-all duration-200 text-sm sm:text-base ${
                      selectedSize === size
                        ? "bg-primary text-primary-foreground border-primary scale-105"
                        : "bg-secondary text-foreground border-border hover:border-primary hover:scale-105"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            size="lg"
            className="w-full h-12 sm:h-14 text-sm sm:text-base mb-6 sm:mb-8 transition-all duration-300 disabled:scale-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isAdding ? (
              <>
                <Check className="h-5 w-5 mr-2 animate-in zoom-in-50 duration-300" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </>
            )}
          </Button>

          {/* Product Info Cards */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {product.forWhom && (
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Who Is This For?</h4>
                  <p className="text-sm text-muted-foreground">{product.forWhom}</p>
                </div>
              </div>
            )}
            {product.howToUse && (
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">How to Use</h4>
                  <p className="text-sm text-muted-foreground">{product.howToUse}</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          {product.details && product.details.length > 0 && (
            <div className="border-t border-border pt-6 sm:pt-8">
              <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">
                {product.isKit ? "What's Included" : "Product Details"}
              </h3>
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Shipping & Returns */}
          <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 space-y-3 sm:space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Free Shipping</h4>
                <p className="text-muted-foreground">Complimentary shipping on all orders over $75</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Need Help?</h4>
                <p className="text-muted-foreground">Contact us on WhatsApp for product recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
