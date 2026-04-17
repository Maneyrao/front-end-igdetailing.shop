"use client"

import { ProductCard } from "./product-card"
import { products, getProductsByCategory } from "@/lib/products"
import { useSearchParams } from "next/navigation"

export function ProductGrid() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  
  const filteredProducts = category 
    ? getProductsByCategory(category) 
    : products.filter(p => !p.isKit) // Show all non-kit products by default

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
