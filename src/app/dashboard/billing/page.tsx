'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, CreditCard, Crown, Zap, AlertCircle, ExternalLink } from 'lucide-react'

interface Plan {
  id: string
  name: string
  description: string
  monthly_price_cents: number
  yearly_price_cents: number
  agent_limit: number
  conversation_limit: number
  message_limit: number
  storage_limit_mb: number
  knowledge_base_limit: number
  api_calls_limit: number
  features: string[]
}

export default function BillingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      try {
        const token = await supabase.auth.getSession()
        const response = await fetch('/api/payments/subscription', {
          headers: {
            'Authorization': `Bearer ${token.data.session?.access_token}`
          }
        })
        const data = await response.json()
        
        if (data.success) {
          setSubscription(data.data.subscription)
          setPlans(data.data.plans || [])
          setInvoices(data.data.recentInvoices || [])
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error)
      }

      setLoading(false)
    }

    fetchData()
  }, [router, supabase])

  const handleUpgrade = async (planId: string) => {
    try {
      const token = await supabase.auth.getSession()
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.data.session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: (await supabase.auth.getUser()).data.user?.id,
          planId,
          billingInterval
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.data.checkoutUrl) {
        window.location.href = data.data.checkoutUrl
      } else {
        alert(data.error || '创建支付链接失败')
      }
    } catch (error) {
      console.error('Upgrade failed:', error)
      alert('升级失败，请稍后重试')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    )
  }

  const currentPlan = plans.find(p => p.id === subscription?.plan_id) || plans[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">账单管理</h1>
        <p className="text-slate-400">管理你的订阅和付款</p>
      </div>

      {subscription && (
        <Card className="bg-slate-900/50 border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              当前订阅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
              <div>
                <p className="text-sm text-slate-400">当前套餐</p>
                <p className="text-2xl font-bold text-white flex items-center gap-2">
                  {subscription.plan_name || 'Free'}
                  {subscription.status === 'active' && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                      生效中
                    </span>
                  )}
                </p>
              </div>
              {subscription.current_period_end && (
                <div className="text-right">
                  <p className="text-sm text-slate-400">到期时间</p>
                  <p className="text-white">
                    {new Date(subscription.current_period_end).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              )}
            </div>

            {subscription.card_last_four && (
              <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">
                <CreditCard className="w-4 h-4" />
                <span>{subscription.card_brand} •••• {subscription.card_last_four}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="w-5 h-5" />
            选择套餐
          </CardTitle>
          <CardDescription className="text-slate-400">
            选择适合你的计划
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-4 py-2 rounded-lg transition-all ${
                billingInterval === 'month'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              月付
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                billingInterval === 'year'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              年付
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                省 20%
              </span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const price = billingInterval === 'month' 
                ? plan.monthly_price_cents / 100 
                : plan.yearly_price_cents / 100 / 12
              const isCurrent = currentPlan?.id === plan.id

              return (
                <div
                  key={plan.id}
                  className={`p-6 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/10 border-cyan-500/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-sm text-slate-400">{plan.description}</p>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">${price.toFixed(0)}</span>
                    <span className="text-slate-400">/月</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400" />
                      {plan.agent_limit} 个 Agent
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400" />
                      {plan.message_limit.toLocaleString()} 条消息/月
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400" />
                      {plan.storage_limit_mb} MB 存储
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400" />
                      {plan.knowledge_base_limit} 个知识库
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400" />
                      {plan.api_calls_limit.toLocaleString()} API 调用/月
                    </li>
                  </ul>

                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent}
                    className={`w-full ${
                      isCurrent
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-cyan-500 hover:bg-cyan-600'
                    }`}
                  >
                    {isCurrent ? '当前套餐' : price === 0 ? '免费使用' : '立即升级'}
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-white">账单历史</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">
                      {invoice.invoice_number || `Invoice #${invoice.id.slice(0, 8)}`}
                    </p>
                    <p className="text-sm text-slate-400">
                      {new Date(invoice.created_at).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      invoice.status === 'paid'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {invoice.status === 'paid' ? '已支付' : invoice.status}
                    </span>
                    <span className="text-white font-medium">
                      ${(invoice.total_cents / 100).toFixed(2)}
                    </span>
                    {invoice.receipt_url && (
                      <a
                        href={invoice.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              暂无账单记录
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
