import { Metadata } from 'next'
import { Suspense } from 'react'
import { ContactForm } from '@/components/contact/ContactForm'
import { Mail, MessageCircle, Clock } from 'lucide-react'
import { contactContent, siteContent } from '@/lib/content'

export const metadata: Metadata = {
  title: contactContent['页面头部'].标题 + ' - ' + siteContent['网站基础信息']['网站名称'],
  description: contactContent['页面头部'].描述,
}

export default function ContactPage() {
  return (
    <div className="min-h-screen relative">
      <div className="relative pt-32 pb-16">
        <div className="container max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="badge-neon mb-6 inline-block">
            联系我们
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
            {contactContent['页面头部'].标题}
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            {contactContent['页面头部'].描述}
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="h-96 bg-white/[0.02] rounded-2xl animate-pulse border border-white/[0.06]" />}>
              <ContactForm />
            </Suspense>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card">
              <div className="p-6">
                <h3 className="font-semibold text-white mb-4">{contactContent['联系方式卡片'].卡片标题}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white/40">{contactContent['联系方式卡片'].邮箱标签}</p>
                      <p className="text-white">{contactContent['联系方式卡片'].邮箱地址}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <MessageCircle className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white/40">{contactContent['联系方式卡片'].微信标签}</p>
                      <p className="text-white">{contactContent['联系方式卡片'].微信号}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white/40">{contactContent['联系方式卡片'].工作时间标签}</p>
                      <p className="text-white">{contactContent['联系方式卡片'].工作时间内容}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <div className="p-6">
                <h3 className="font-semibold text-white mb-4">{contactContent['响应时间卡片'].卡片标题}</h3>
                <ul className="space-y-2 text-sm text-white/60">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    {contactContent['响应时间卡片'].响应时间1}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    {contactContent['响应时间卡片'].响应时间2}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    {contactContent['响应时间卡片'].响应时间3}
                  </li>
                </ul>
              </div>
            </div>

            <div className="glass-card text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-pink-400" />
              <div className="p-6 relative z-10">
                <p className="text-white font-semibold mb-2">{contactContent['快速诊断 CTA'].标题}</p>
                <p className="text-white/50 text-sm mb-4">{contactContent['快速诊断 CTA'].描述}</p>
                <a
                  href="/diagnosis"
                  className="inline-block glow-btn text-white px-6 py-2 rounded-lg text-sm font-medium"
                >
                  {contactContent['快速诊断 CTA'].按钮}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
