'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { usePricingStore } from '@/lib/store'
import type { Module } from '@/lib/constants'

interface ModuleCardProps {
  module: Module
  selected: boolean
  onSelect: () => void
  disabled?: boolean
}

function ModuleCard({ module, selected, onSelect, disabled }: ModuleCardProps) {
  const [expanded, setExpanded] = useState(false)
  const features = (module.features as string[]) || []
  
  return (
    <Card 
      className={`border-2 transition-all cursor-pointer ${
        selected ? 'border-[#06b6d4] bg-[#06b6d4]/5' : 'border-transparent hover:border-gray-200'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onSelect()}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox 
            checked={selected} 
            disabled={disabled}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{module.icon}</span>
                <h3 className="font-semibold text-gray-900">{module.name}</h3>
              </div>
              <Badge variant="outline">{module.category}</Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{module.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-[#1e3a5f]">
                  ¥{module.price_min?.toLocaleString()} - {module.price_max?.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">{module.price_unit}</span>
              </div>
              <span className="text-xs text-gray-400">{module.delivery_days}</span>
            </div>
            
            {features.length > 0 && (
              <div className="mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpanded(!expanded)
                  }}
                  className="flex items-center gap-1 text-sm text-[#06b6d4] hover:underline"
                >
                  {expanded ? '收起' : '查看详情'}
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                {expanded && (
                  <div className="mt-3 space-y-2">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#06b6d4] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ModuleSelector() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedModules, addModule, removeModule } = usePricingStore()
  
  useEffect(() => {
    async function fetchModules() {
      const supabase = createClient()
      const { data } = await supabase
        .from('service_modules')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      
      if (data) {
        const typedData = data as Module[]
        setModules(typedData)
        const baseModule = typedData.find((m: Module) => m.type === 'base')
        if (baseModule && !selectedModules.find(m => m.id === baseModule.id)) {
          addModule({
            id: baseModule.id,
            name: baseModule.name,
            type: baseModule.type,
            priceMin: baseModule.price_min || 0,
            priceMax: baseModule.price_max || 0,
            priceUnit: baseModule.price_unit || ''
          })
        }
      }
      setLoading(false)
    }
    fetchModules()
  }, [addModule, selectedModules])
  
  const baseModule = modules.find(m => m.type === 'base')
  const pluginModules = modules.filter(m => m.type === 'plugin')
  const subscriptionModules = modules.filter(m => m.type === 'subscription')
  
  const selectedSubscription = selectedModules.find(m => m.type === 'subscription')
  
  const handlePluginToggle = (mod: Module) => {
    const isSelected = selectedModules.find(m => m.id === mod.id)
    if (isSelected) {
      removeModule(mod.id)
    } else {
      addModule({
        id: mod.id,
        name: mod.name,
        type: mod.type,
        priceMin: mod.price_min || 0,
        priceMax: mod.price_max || 0,
        priceUnit: mod.price_unit || ''
      })
    }
  }
  
  const handleSubscriptionSelect = (moduleId: string) => {
    const existingSub = selectedModules.find(m => m.type === 'subscription')
    if (existingSub) {
      removeModule(existingSub.id)
    }
    if (moduleId) {
      const selectedMod = modules.find(m => m.id === moduleId)
      if (selectedMod) {
        addModule({
          id: selectedMod.id,
          name: selectedMod.name,
          type: selectedMod.type,
          priceMin: selectedMod.price_min || 0,
          priceMax: selectedMod.price_max || 0,
          priceUnit: selectedMod.price_unit || ''
        })
      }
    }
  }
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {baseModule && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🧱</span>
            基础模块（必选）
          </h3>
          <ModuleCard
            module={baseModule}
            selected={true}
            onSelect={() => {}}
            disabled={true}
          />
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🔌</span>
          增值模块（按需勾选）
        </h3>
        <div className="space-y-4">
          {pluginModules.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              selected={!!selectedModules.find(m => m.id === mod.id)}
              onSelect={() => handlePluginToggle(mod)}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🔄</span>
          持续服务（可选 1 档）
        </h3>
        <RadioGroup 
          value={selectedSubscription?.id} 
          onValueChange={handleSubscriptionSelect}
          className="space-y-4"
        >
          {subscriptionModules.map((mod) => (
            <Card 
              key={mod.id}
              className={`border-2 transition-all cursor-pointer ${
                selectedSubscription?.id === mod.id 
                  ? 'border-[#06b6d4] bg-[#06b6d4]/5' 
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <RadioGroupItem value={mod.id} id={mod.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={mod.id} className="flex items-center gap-2 cursor-pointer">
                      <span className="text-2xl">{mod.icon}</span>
                      <span className="font-semibold">{mod.name}</span>
                      <Badge variant="outline">{mod.category}</Badge>
                    </Label>
                    <p className="text-sm text-gray-600 mt-1 ml-8">{mod.description}</p>
                    <div className="flex items-baseline gap-1 mt-2 ml-8">
                      <span className="font-bold text-[#1e3a5f]">¥{mod.price_min?.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">{mod.price_unit}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}
