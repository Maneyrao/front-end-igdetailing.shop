"use client"

import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Filter, Droplets, Sparkles, Shield, Package } from "lucide-react"
import { products, categories } from "@/lib/products"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"

function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeCategory = searchParams.get("category")

  const filteredProducts = activeCategory
    ? products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase())
    : products.filter(p => !p.isKit)

  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    wash: Droplets,
    interior: Sparkles,
    protection: Shield,
    accessories: Package,
  }

  const handleCategoryClick = (categoryId: string | null) => {
    if (categoryId) {
      router.push(`/shop?category=${categoryId}`)
    } else {
      router.push("/shop")
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {activeCategory 
              ? categories.find(c => c.id === activeCategory)?.name || "Products"
              : "All Products"
            }
          </h1>
          <p className="text-muted-foreground">
            {activeCategory 
              ? categories.find(c => c.id === activeCategory)?.description
              : `${filteredProducts.length} products available`
            }
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={!activeCategory ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(null)}
          className={!activeCategory ? "" : "bg-transparent"}
        >
          All
        </Button>
        {categories.filter(c => c.id !== "kits").map((category) => {
          const Icon = categoryIcons[category.id]
          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(category.id)}
              className={activeCategory === category.id ? "" : "bg-transparent"}
            >
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              {category.name}
            </Button>
          )
        })}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Link href="/collections">
            <Package className="h-4 w-4 mr-2" />
            View Kits
          </Link>
        </Button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No products found in this category.</p>
          <Button onClick={() => handleCategoryClick(null)}>View All Products</Button>
        </div>
      )}
    </div>
  )
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary rounded w-48 mb-4"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-secondary rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      }>
        <ShopContent />
      </Suspense>
    </div>
  )
}
