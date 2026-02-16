import { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, MessageCircle, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: '联系我们 - StarFrom AI',
  description: '联系 StarFrom AI 获取专属 AI 解决方案，我们的团队将在24小时内与您联系。',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] py-16">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            联系我们
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            告诉我们您的需求，我们将在24小时内与您联系
          </p>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">联系方式</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#1e3a5f]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">邮箱</p>
                      <p className="text-gray-900">contact@starfrom.ai</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-[#1e3a5f]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">微信</p>
                      <p className="text-gray-900">starfrom-ai</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#1e3a5f]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">工作时间</p>
                      <p className="text-gray-900">周一至周五 9:00-18:00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">响应时间</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>表单提交：24小时内</li>
                  <li>微信咨询：2小时内</li>
                  <li>紧急需求：1小时内</li>
                </ul>
              </CardContent>
            </Card>
            
            <div className="bg-[#1e3a5f] rounded-xl p-6 text-center">
              <p className="text-white font-semibold mb-2">想要快速了解？</p>
              <p className="text-gray-300 text-sm mb-4">试试我们的 AI 需求诊断工具</p>
              <a
                href="/diagnosis"
                className="inline-block bg-[#06b6d4] hover:bg-[#0891b2] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                免费诊断
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
