import { Header } from "@/components/header"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Award, Heart, MessageCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 py-4">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-car-detailing.jpg"
            alt="Car detailing"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              About <span className="text-primary">IG Detailing</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Helping car enthusiasts achieve professional results at home
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                IG Detailing Shop was born from a passion for cars and a frustration with the confusing world of 
                detailing products. We know how overwhelming it can be to find the right products when you&apos;re 
                just starting out or even when you want to level up your detailing game.
              </p>
              <p>
                That&apos;s why we created a curated selection of premium products that actually work. No gimmicks, 
                no confusing marketing claims - just quality products backed by real knowledge and experience.
              </p>
              <p>
                Whether you&apos;re washing your daily driver for the first time or preparing a show car, 
                we&apos;re here to help you achieve results you can be proud of.
              </p>
            </div>
          </div>
          <div className="relative aspect-video bg-card rounded-lg overflow-hidden border border-border">
            <Image 
              src="/products/beginner-kit.jpg" 
              alt="IG Detailing products" 
              fill 
              className="object-cover" 
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-card py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Award,
                title: "Quality First",
                description: "We only sell products we&apos;ve personally tested and trust. No compromises."
              },
              {
                icon: Sparkles,
                title: "Education",
                description: "We believe in teaching, not just selling. Our guides help you get the best results."
              },
              {
                icon: Heart,
                title: "Passion",
                description: "We&apos;re car enthusiasts first. We understand the joy of a perfectly detailed car."
              },
              {
                icon: MessageCircle,
                title: "Support",
                description: "Have questions? We&apos;re always available via WhatsApp to help you out."
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-6 bg-secondary rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            To make professional car detailing accessible to everyone. We want to empower car owners 
            with the knowledge and tools they need to achieve stunning results, whether you&apos;re a 
            complete beginner or an experienced enthusiast.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <p className="text-sm text-muted-foreground">Premium Products</p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">WhatsApp Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-primary-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Explore our curated selection of detailing products and start your journey to a showroom-ready car.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="h-12 px-8">
                <Link href="/shop">Shop Products</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/collections">View Kits</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
