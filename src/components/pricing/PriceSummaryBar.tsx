'use client'

import { Button } from '@/components/ui/button'
import { X, ArrowRight } from 'lucide-react'
import { usePricingStore } from '@/lib/store'
import Link from 'next/link'
import { pricingContent } from '@/lib/content'

export function PriceSummaryBar() {
  const { selectedModules, removeModule, totalMinPrice, totalMaxPrice, monthlyPrice } = usePricingStore()

  const baseModules = selectedModules.filter(m => m.type !== 'subscription')
  const subscriptionModule = selectedModules.find(m => m.type === 'subscription')

  const minPrice = totalMinPrice()
  const maxPrice = totalMaxPrice()
  const monthly = monthlyPrice()

  return (
    <div className="sticky top-24 glass-card">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-pink-400" />
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">{pricingContent['价格汇总栏']['标题']}</h3>

        {baseModules.length === 0 ? (
          <p className="text-white/40 text-center py-8">{pricingContent['价格汇总栏']['空状态提示']}</p>
        ) : (
          <>
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {baseModules.map((module) => (
                <div key={module.id} className="flex items-center justify-between text-sm">
                  <span className="text-white/70">{module.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">
                      ¥{module.priceMin.toLocaleString()} - {module.priceMax.toLocaleString()}
                    </span>
                    {module.type !== 'base' && (
                      <button
                        onClick={() => removeModule(module.id)}
                        className="text-white/30 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {subscriptionModule && (
                <div className="flex items-center justify-between text-sm pt-3 border-t border-white/[0.06]">
                  <span className="text-white/70">{subscriptionModule.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">
                      ¥{subscriptionModule.priceMin.toLocaleString()}/月
                    </span>
                    <button
                      onClick={() => removeModule(subscriptionModule.id)}
                      className="text-white/30 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/[0.06] pt-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-white/50">{pricingContent['价格汇总栏']['一次性费用标签']}</span>
                <div className="text-right">
                  <span className="text-2xl font-bold gradient-text">
                    ¥{minPrice.toLocaleString()} - {maxPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {monthly > 0 && (
                <div className="flex items-baseline justify-between">
                  <span className="text-white/50">{pricingContent['价格汇总栏']['月度费用标签']}</span>
                  <span className="text-lg font-semibold text-blue-400">
                    ¥{monthly.toLocaleString()}/月
                  </span>
                </div>
              )}
            </div>

            <Link href={`/contact?source=pricing`}>
              <Button className="w-full mt-6 glow-btn text-white group" size="lg">
                {pricingContent['价格汇总栏']['按钮']}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="text-xs text-white/30 text-center mt-3">
              {pricingContent['价格汇总栏']['提示文字']}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
