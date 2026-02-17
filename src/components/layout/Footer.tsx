import Link from 'next/link'
import { Sparkles, Github, Twitter, Mail, MessageCircle } from 'lucide-react'
import { footerContent, siteContent } from '@/lib/content'

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Mail, href: 'mailto:contact@starfrom.ai', label: 'Email' },
  { icon: MessageCircle, href: '#', label: 'WeChat' },
]

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-[#050508]/50 backdrop-blur-sm">
      {/* Top Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="container max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-bold text-white">StarFrom</span>
                <span className="text-xl font-bold text-blue-400">.AI</span>
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              {footerContent.description}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/10 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{footerContent.links.product.title}</h4>
            <ul className="space-y-3">
              {footerContent.links.product.items.map((link: { label: string; href: string }) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-white/40 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{footerContent.links.company.title}</h4>
            <ul className="space-y-3">
              {footerContent.links.company.items.map((link: { label: string; href: string }) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-white/40 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{footerContent.links.resources.title}</h4>
            <ul className="space-y-3">
              {footerContent.links.resources.items.map((link: { label: string; href: string }) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-white/40 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            {siteContent.copyright}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="text-white/30 hover:text-white/60">{footerContent.bottom.privacy}</Link>
            <Link href="#" className="text-white/30 hover:text-white/60">{footerContent.bottom.terms}</Link>
            <span className="text-white/20">{footerContent.bottom.compliance}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
