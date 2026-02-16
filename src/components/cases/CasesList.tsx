'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { ServiceCase } from '@/lib/constants'
import { defaultCases } from '@/lib/constants'
import Link from 'next/link'

const industries = ['全部', '电商', '教育', '制造', '医疗', '金融', '通用', '其他']

export function CasesList() {
  const [cases, setCases] = useState<ServiceCase[]>([])
  const [filteredCases, setFilteredCases] = useState<ServiceCase[]>([])
  const [selectedIndustry, setSelectedIndustry] = useState('全部')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCases() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('service_cases')
          .select('*')
          .order('sort_order', { ascending: true })

        if (error) {
          console.warn('Supabase fetch failed, using fallback data:', error.message)
          setCases(defaultCases)
          setFilteredCases(defaultCases)
        } else if (data && data.length > 0) {
          setCases(data)
          setFilteredCases(data)
        } else {
          setCases(defaultCases)
          setFilteredCases(defaultCases)
        }
      } catch (e) {
        console.warn('Supabase connection failed, using fallback data:', e)
        setCases(defaultCases)
        setFilteredCases(defaultCases)
      }
      setLoading(false)
    }
    fetchCases()
  }, [])

  useEffect(() => {
    if (selectedIndustry === '全部') {
      setFilteredCases(cases)
    } else {
      setFilteredCases(cases.filter(c => c.industry === selectedIndustry))
    }
  }, [selectedIndustry, cases])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry} className="mb-8">
        <TabsList className="flex flex-wrap h-auto gap-2">
          {industries.map((industry) => (
            <TabsTrigger
              key={industry}
              value={industry}
              className="data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white"
            >
              {industry}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCases.map((item) => {
          const results = item.results as Array<{ metric: string; value: string }>
          const modules = item.modules_used as string[]

          return (
            <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#06b6d4] to-[#1e3a5f]" />
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge>{item.industry}</Badge>
                  {item.company_size && (
                    <Badge variant="outline">{item.company_size}</Badge>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">挑战</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.challenge}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">解决方案</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.solution}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {results?.slice(0, 3).map((result, idx) => (
                    <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-[#06b6d4]">
                        {result.value}
                      </div>
                      <div className="text-xs text-gray-500">
                        {result.metric}
                      </div>
                    </div>
                  ))}
                </div>

                {modules && modules.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {modules.map((moduleId, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {moduleId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Link href={`/contact?source=case`}>
                  <Button variant="outline" className="w-full group">
                    我也想要类似方案
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无该行业的案例</p>
        </div>
      )}
    </div>
  )
}
