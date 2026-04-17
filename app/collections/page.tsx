import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight, Check } from "lucide-react"
import { getKits } from "@/lib/products"

export default function CollectionsPage() {
  const kits = getKits()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Detailing Kits</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Complete packages designed for every skill level. Everything you need to achieve professional results at home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kits.map((kit) => (
            <div
              key={kit.id}
              className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-all duration-300"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={kit.image}
                  alt={kit.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <span className="text-xs text-primary font-medium uppercase tracking-wider">Complete Kit</span>
                <h2 className="text-xl font-bold mt-2 mb-3 group-hover:text-primary transition-colors">
                  {kit.name}
                </h2>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {kit.description}
                </p>

                {/* Kit Contents */}
                {kit.details && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-2">What&apos;s Included:</h3>
                    <ul className="space-y-1">
                      {kit.details.slice(0, 4).map((detail, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                      {kit.details.length > 4 && (
                        <li className="text-sm text-muted-foreground pl-6">
                          +{kit.details.length - 4} more items
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-2xl font-bold">${kit.price.toFixed(2)}</span>
                  <Button asChild>
                    <Link href={`/product/${kit.id}`}>
                      View Kit
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose a Kit Section */}
        <section className="mt-16 py-12 bg-card rounded-lg border border-border">
          <div className="text-center mb-10 px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose a Kit?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our kits are carefully curated to give you everything you need at a better value.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12">
            {[
              {
                title: "Save Money",
                description: "Kits are priced up to 20% less than buying products separately."
              },
              {
                title: "No Guesswork",
                description: "We've selected products that work perfectly together."
              },
              {
                title: "Perfect for Learning",
                description: "Each kit includes guides to help you get started."
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-4">0{index + 1}</div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
