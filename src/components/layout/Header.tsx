'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { navContent } from '@/lib/content'

const navItems = navContent['菜单']

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-[#050508]/80 backdrop-blur-xl border-b border-white/[0.08]' 
        : 'bg-transparent'
    }`}>
      <div className="container flex h-20 items-center justify-between max-w-7xl mx-auto px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-bold text-white tracking-tight">{navContent['品牌名']}</span>
            <span className="text-xl font-bold text-blue-400">{navContent['后缀']}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                  isActive
                    ? 'text-blue-400'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-0 rounded-lg bg-blue-500/10 border border-blue-500/20 -z-10" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* CTA & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Link href="/diagnosis" className="hidden sm:block">
            <Button size="sm" className="glow-btn text-white font-semibold text-sm px-5">
              {navContent['主按钮']}
            </Button>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/[0.04]">
                <Menu className="h-5 w-5" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-[#050508]/95 backdrop-blur-xl border-white/[0.08]">
              <nav className="flex flex-col gap-1 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                      pathname === item.href || pathname?.startsWith(item.href + '/')
                        ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/diagnosis" onClick={() => setIsOpen(false)} className="mt-4">
                  <Button className="w-full glow-btn text-white font-semibold">
                    {navContent['主按钮']}
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
