'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
    <Card className="sticky top-24 border-0 shadow-xl">
      <div className="h-1 bg-gradient-to-r from-[#06b6d4] to-[#1e3a5f]" />
      <CardHeader className="pb-2">
        <h3 className="text-lg font-bold text-gray-900">{pricingContent['价格汇总栏']['标题']}</h3>
      </CardHeader>
      <CardContent>
        {baseModules.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{pricingContent['价格汇总栏']['空状态提示']}</p>
        ) : (
          <>
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {baseModules.map((module) => (
                <div key={module.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{module.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">
                      ¥{module.priceMin.toLocaleString()} - {module.priceMax.toLocaleString()}
                    </span>
                    {module.type !== 'base' && (
                      <button
                        onClick={() => removeModule(module.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {subscriptionModule && (
                <div className="flex items-center justify-between text-sm pt-3 border-t">
                  <span className="text-gray-700">{subscriptionModule.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">
                      ¥{subscriptionModule.priceMin.toLocaleString()}/月
                    </span>
                    <button
                      onClick={() => removeModule(subscriptionModule.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-gray-600">{pricingContent['价格汇总栏']['一次性费用标签']}</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#1e3a5f]">
                    ¥{minPrice.toLocaleString()} - {maxPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {monthly > 0 && (
                <div className="flex items-baseline justify-between">
                  <span className="text-gray-600">{pricingContent['价格汇总栏']['月度费用标签']}</span>
                  <span className="text-lg font-semibold text-[#06b6d4]">
                    ¥{monthly.toLocaleString()}/月
                  </span>
                </div>
              )}
            </div>

            <Link href={`/contact?source=pricing`}>
              <Button className="w-full mt-6 bg-[#06b6d4] hover:bg-[#0891b2]" size="lg">
                {pricingContent['价格汇总栏']['按钮']}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>

            <p className="text-xs text-gray-400 text-center mt-3">
              {pricingContent['价格汇总栏']['提示文字']}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
