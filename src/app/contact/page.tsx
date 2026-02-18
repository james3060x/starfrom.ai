import { Metadata } from 'next'
import { Suspense } from 'react'
import { ContactForm } from '@/components/contact/ContactForm'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, MessageCircle, Clock } from 'lucide-react'
import { contactContent, siteContent } from '@/lib/content'

export const metadata: Metadata = {
  title: contactContent['页面头部'].标题 + ' - ' + siteContent['网站基础信息']['网站名称'],
  description: contactContent['页面头部'].描述,
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] py-16">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {contactContent['页面头部'].标题}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {contactContent['页面头部'].描述}
          </p>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="h-96 bg-gray-200 rounded-lg animate-pulse" />}>
              <ContactForm />
            </Suspense>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{contactContent['联系方式卡片'].卡片标题}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#1e3a5f]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{contactContent['联系方式卡片'].邮箱标签}</p>
                      <p className="text-gray-900">{contactContent['联系方式卡片'].邮箱地址}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-[#1e3a5f]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{contactContent['联系方式卡片'].微信标签}</p>
                      <p className="text-gray-900">{contactContent['联系方式卡片'].微信号}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#1e3a5f]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{contactContent['联系方式卡片'].工作时间标签}</p>
                      <p className="text-gray-900">{contactContent['联系方式卡片'].工作时间内容}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{contactContent['响应时间卡片'].卡片标题}</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>{contactContent['响应时间卡片'].响应时间1}</li>
                  <li>{contactContent['响应时间卡片'].响应时间2}</li>
                  <li>{contactContent['响应时间卡片'].响应时间3}</li>
                </ul>
              </CardContent>
            </Card>

            <div className="bg-[#1e3a5f] rounded-xl p-6 text-center">
              <p className="text-white font-semibold mb-2">{contactContent['快速诊断 CTA'].标题}</p>
              <p className="text-gray-300 text-sm mb-4">{contactContent['快速诊断 CTA'].描述}</p>
              <a
                href="/diagnosis"
                className="inline-block bg-[#06b6d4] hover:bg-[#0891b2] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {contactContent['快速诊断 CTA'].按钮}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
