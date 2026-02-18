'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { usePricingStore } from '@/lib/store'
import type { Module } from '@/lib/constants'
import { defaultModules } from '@/lib/constants'
import { pricingContent } from '@/lib/content'

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
    <div
      className={`glass-card transition-all cursor-pointer ${
        selected ? 'border-blue-500/50 bg-blue-500/5' : 'border-transparent hover:border-white/10'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'card-hover'}`}
      onClick={() => !disabled && onSelect()}
    >
      <div className="p-4">
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
                <h3 className="font-semibold text-white">{module.name}</h3>
              </div>
              <span className="px-2 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/50 text-xs">
                {module.category}
              </span>
            </div>

            <p className="text-sm text-white/50 mb-2">{module.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="font-bold gradient-text">
                  ¥{module.price_min?.toLocaleString()} - {module.price_max?.toLocaleString()}
                </span>
                <span className="text-sm text-white/40">{module.price_unit}</span>
              </div>
              <span className="text-xs text-white/30">{module.delivery_days}</span>
            </div>

            {features.length > 0 && (
              <div className="mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpanded(!expanded)
                  }}
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {expanded ? '收起' : '查看详情'}
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expanded && (
                  <div className="mt-3 space-y-2">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-white/60">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ModuleSelector() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedModules, addModule, removeModule } = usePricingStore()
  
  useEffect(() => {
    async function fetchModules() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('service_modules')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        let moduleData: Module[]
        if (error) {
          console.warn('Supabase fetch failed, using fallback data:', error.message)
          moduleData = defaultModules
        } else if (data && data.length > 0) {
          moduleData = data as Module[]
        } else {
          moduleData = defaultModules
        }
        setModules(moduleData)
      } catch (e) {
        console.warn('Supabase connection failed, using fallback data:', e)
        setModules(defaultModules)
      }
      setLoading(false)
    }
    fetchModules()
  }, [])
  
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
          <div key={i} className="h-32 bg-white/[0.02] rounded-2xl animate-pulse border border-white/[0.06]" />
        ))}
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {baseModule && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <span>🧱</span>
            {pricingContent['模块选择器']['基础模块标题']}
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
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
          <span>🔌</span>
          {pricingContent['模块选择器']['增值模块标题']}
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
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
          <span>🔄</span>
          {pricingContent['模块选择器']['持续服务标题']}
        </h3>
        <RadioGroup
          value={selectedSubscription?.id}
          onValueChange={handleSubscriptionSelect}
          className="space-y-4"
        >
          {subscriptionModules.map((mod) => (
            <div
              key={mod.id}
              className={`glass-card transition-all cursor-pointer ${
                selectedSubscription?.id === mod.id
                  ? 'border-blue-500/50 bg-blue-500/5'
                  : 'border-transparent hover:border-white/10'
              } card-hover`}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <RadioGroupItem value={mod.id} id={mod.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={mod.id} className="flex items-center gap-2 cursor-pointer text-white">
                      <span className="text-2xl">{mod.icon}</span>
                      <span className="font-semibold">{mod.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/50 text-xs">
                        {mod.category}
                      </span>
                    </Label>
                    <p className="text-sm text-white/50 mt-1 ml-8">{mod.description}</p>
                    <div className="flex items-baseline gap-1 mt-2 ml-8">
                      <span className="font-bold gradient-text">¥{mod.price_min?.toLocaleString()}</span>
                      <span className="text-sm text-white/40">{mod.price_unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}
