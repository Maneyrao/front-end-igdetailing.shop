"use client"

import Link from "next/link"
import { ShoppingBag, User, Menu, Sparkles } from "lucide-react"
import { useCart } from "./cart-provider"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { useState } from "react"

export function Header() {
  const { itemCount } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className="relative w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-foreground">IG Detailing</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Shop
          </Link>
          <Link href="/collections" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Kits
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-primary">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium animate-in zoom-in-50 duration-200">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Cart ({itemCount} items)</span>
            </Button>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-primary">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] sm:w-[350px] px-6 bg-card [&>button]:border-0 [&>button]:shadow-none [&>button]:ring-0 [&>button]:top-8"
            >
              <div className="flex flex-col gap-8 pt-8">
                <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span>IG Detailing</span>
                </div>

                <nav className="flex flex-col gap-0">
                  <Link
                    href="/shop"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium py-5 px-4 border-b border-border hover:bg-secondary hover:text-primary transition-colors"
                  >
                    Shop All
                  </Link>
                  <Link
                    href="/collections"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium py-5 px-4 border-b border-border hover:bg-secondary hover:text-primary transition-colors"
                  >
                    Kits
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium py-5 px-4 border-b border-border hover:bg-secondary hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium py-5 px-4 border-b border-border hover:bg-secondary hover:text-primary transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium py-5 px-4 border-b border-border hover:bg-secondary hover:text-primary transition-colors flex items-center justify-between"
                  >
                    <span>Cart</span>
                    {itemCount > 0 && (
                      <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
