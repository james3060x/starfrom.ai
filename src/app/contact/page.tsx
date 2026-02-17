import { Metadata } from 'next'
import { Suspense } from 'react'
import { ContactForm } from '@/components/contact/ContactForm'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, MessageCircle, Clock } from 'lucide-react'
import { contactContent, siteContent } from '@/lib/content'

export const metadata: Metadata = {
  title: contactContent.hero.title + ' - ' + siteContent.name,
  description: '联系 StarFrom AI 获取专属 AI 解决方案，我们的团队将在24小时内与您联系。',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] py-16">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {contactContent.hero.title}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {contactContent.hero.subtitle}
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
                <h3 className="font-semibold text-gray-900 mb-4">{contactContent.info.title}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#1e3a5f]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{contactContent.info.email.label}</p>
                      <p className="text-gray-900">{contactContent.info.email.value}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-[#1e3a5f]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{contactContent.info.wechat.label}</p>
                      <p className="text-gray-900">{contactContent.info.wechat.value}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#1e3a5f]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{contactContent.info.workHours.label}</p>
                      <p className="text-gray-900">{contactContent.info.workHours.value}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{contactContent.response.title}</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {contactContent.response.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="bg-[#1e3a5f] rounded-xl p-6 text-center">
              <p className="text-white font-semibold mb-2">{contactContent.quickDiagnosis.title}</p>
              <p className="text-gray-300 text-sm mb-4">{contactContent.quickDiagnosis.subtitle}</p>
              <a
                href="/diagnosis"
                className="inline-block bg-[#06b6d4] hover:bg-[#0891b2] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {contactContent.quickDiagnosis.button}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
