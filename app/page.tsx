import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Droplets, Sparkles, Shield, Package, Truck, CreditCard, MessageCircle, Star, ChevronRight } from "lucide-react"
import { getFeaturedProducts, getBestSellers } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

export default function Home() {
  const featuredKits = getFeaturedProducts()
  const bestSellers = getBestSellers()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-car-detailing.jpg"
            alt="Professional car detailing"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance">
              Achieve
              <span className="text-primary"> Professional</span>
              <br />
              Results at Home
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl text-pretty">
              Premium car detailing products for enthusiasts who demand the best. From your first wash to showroom-ready shine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base bg-transparent border-muted-foreground/30 hover:bg-secondary">
                <Link href="/collections">
                  View Kits
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-12 sm:py-16 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">What Do You Need?</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Wash", icon: Droplets, href: "/shop?category=wash", description: "Safe & effective" },
              { name: "Interior", icon: Sparkles, href: "/shop?category=interior", description: "Fresh & clean" },
              { name: "Protection", icon: Shield, href: "/shop?category=protection", description: "Shine & protect" },
              { name: "Accessories", icon: Package, href: "/shop?category=accessories", description: "Tools & towels" },
              { name: "Kits", icon: Star, href: "/collections", description: "Complete packages", featured: true },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`group flex flex-col items-center p-6 rounded-lg border transition-all duration-300 hover:scale-105 ${
                  category.featured 
                    ? "bg-primary/10 border-primary hover:bg-primary/20 col-span-2 md:col-span-1" 
                    : "bg-card border-border hover:border-primary"
                }`}
              >
                <category.icon className={`h-8 w-8 mb-3 transition-colors ${category.featured ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                <span className="font-semibold mb-1">{category.name}</span>
                <span className="text-xs text-muted-foreground">{category.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Goal-Based Navigation */}
      <section className="py-12 sm:py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Not Sure Where to Start?</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            Tell us your goal, and we&apos;ll recommend the perfect products for you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { goal: "I want to wash my car safely", products: "Shampoo, Wash Mitt, Drying Towels", link: "/shop?category=wash" },
              { goal: "I want more shine", products: "Wax, Sealant, Quick Detailer", link: "/shop?category=protection" },
              { goal: "I want to clean the interior", products: "APC, Leather Conditioner, Glass Cleaner", link: "/shop?category=interior" },
              { goal: "I'm just getting started", products: "Beginner Kit with everything you need", link: "/collections" },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="group p-6 bg-secondary rounded-lg border border-border hover:border-primary transition-all duration-300"
              >
                <p className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  &quot;{item.goal}&quot;
                </p>
                <p className="text-sm text-muted-foreground mb-4">{item.products}</p>
                <span className="inline-flex items-center text-sm text-primary font-medium">
                  Find Products <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Kits Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Featured Kits</h2>
              <p className="text-muted-foreground">Complete packages for every skill level</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/collections">
                View All Kits
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredKits.map((kit) => (
              <Link
                key={kit.id}
                href={`/product/${kit.id}`}
                className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary transition-all duration-300"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={kit.image}
                    alt={kit.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">Complete Kit</span>
                  <h3 className="font-bold text-lg mt-2 mb-2 group-hover:text-primary transition-colors">{kit.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{kit.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">${kit.price}</span>
                    <span className="text-sm text-primary font-medium flex items-center">
                      Shop Now <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Button asChild>
              <Link href="/collections">View All Kits</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Best Sellers</h2>
              <p className="text-muted-foreground">Our most popular products</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/shop">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Button asChild>
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Getting professional results is easier than you think
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Goal",
                description: "Whether it's a safe wash, deep shine, or fresh interior - we've got you covered."
              },
              {
                step: "02",
                title: "Get the Right Products",
                description: "Our curated kits and expert recommendations take the guesswork out of detailing."
              },
              {
                step: "03",
                title: "Achieve Pro Results",
                description: "Follow our guides and enjoy a car that looks like it just left the detailer."
              }
            ].map((item, index) => (
              <div key={index} className="relative p-6 text-center">
                <span className="text-6xl font-bold text-primary/20">{item.step}</span>
                <h3 className="text-xl font-bold mt-4 mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 sm:py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Truck, title: "Free Shipping", description: "On orders over $75" },
              { icon: CreditCard, title: "Secure Payment", description: "100% protected" },
              { icon: MessageCircle, title: "WhatsApp Support", description: "We're here to help" },
              { icon: Star, title: "Quality Guaranteed", description: "Premium products only" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-xl font-bold tracking-tight mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span>IG Detailing</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Premium car detailing products for enthusiasts and professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
                <li><Link href="/collections" className="hover:text-primary transition-colors">Kits</Link></li>
                <li><Link href="/shop?category=wash" className="hover:text-primary transition-colors">Wash</Link></li>
                <li><Link href="/shop?category=interior" className="hover:text-primary transition-colors">Interior</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping</Link></li>
                <li><Link href="/returns" className="hover:text-primary transition-colors">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 IG Detailing Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
