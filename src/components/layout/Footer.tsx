import Link from 'next/link'
import { Sparkles, Github, Twitter, Mail, MessageCircle } from 'lucide-react'

const footerLinks = {
  产品: [
    { label: '服务详情', href: '/services' },
    { label: '定价方案', href: '/pricing' },
    { label: '成功案例', href: '/cases' },
    { label: '在线体验', href: '/demo' },
  ],
  公司: [
    { label: '关于我们', href: '#' },
    { label: '联系方式', href: '/contact' },
    { label: '加入我们', href: '#' },
    { label: '合作伙伴', href: '#' },
  ],
  资源: [
    { label: '帮助中心', href: '#' },
    { label: 'API 文档', href: '#' },
    { label: '开发博客', href: '#' },
    { label: '社区', href: '#' },
  ],
}

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
              为中小企业打造专属 AI 智能体，模板化交付，3 天上线，让 AI 技术触手可及。
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
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
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
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2026 StarFrom AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="text-white/30 hover:text-white/60">隐私政策</Link>
            <Link href="#" className="text-white/30 hover:text-white/60">服务条款</Link>
            <span className="text-white/20">数据不出境 · 安全合规</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
