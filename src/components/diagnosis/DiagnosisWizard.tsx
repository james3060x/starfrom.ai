'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const steps = [
  {
    id: 'industry',
    title: '您的行业？',
    type: 'single' as const,
    options: ['电商', '教育', '制造', '医疗', '金融', '通用', '其他']
  },
  {
    id: 'size',
    title: '团队规模？',
    type: 'single' as const,
    options: ['1-10人', '10-50人', '50-200人', '200人以上']
  },
  {
    id: 'needs',
    title: '最想用 AI 解决什么问题？',
    type: 'multiple' as const,
    options: ['客服', '知识管理', '内容生成', '数据分析', '流程自动化', '系统集成', '其他']
  },
  {
    id: 'integration',
    title: '是否有现有系统需要对接？',
    type: 'single' as const,
    options: ['是', '否']
  },
  {
    id: 'budget',
    title: '预算范围？',
    type: 'single' as const,
    options: ['1-3万', '3-10万', '10万+', '不确定']
  }
]

const moduleRecommendations: Record<string, string[]> = {
  '客服': ['base-01', 'plugin-09', 'plugin-01'],
  '知识管理': ['base-01', 'plugin-01'],
  '内容生成': ['base-01', 'plugin-02'],
  '数据分析': ['base-01', 'plugin-04'],
  '流程自动化': ['base-01', 'plugin-08', 'plugin-03'],
  '系统集成': ['base-01', 'plugin-03'],
}

export function DiagnosisWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [showResult, setShowResult] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactInfo, setContactInfo] = useState({ name: '', contact: '' })

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleSingleSelect = (value: string) => {
    setAnswers({ ...answers, [step.id]: value })
  }

  const handleMultipleSelect = (value: string) => {
    const current = (answers[step.id] as string[]) || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    setAnswers({ ...answers, [step.id]: updated })
  }

  const handleNext = () => {
    if (step.type === 'single' && !answers[step.id]) {
      toast.error('请选择一个选项')
      return
    }
    if (step.type === 'multiple' && (!answers[step.id] || (answers[step.id] as string[]).length === 0)) {
      toast.error('请至少选择一个选项')
      return
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResult(true)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getRecommendations = () => {
    const needs = (answers.needs as string[]) || []
    const hasIntegration = answers.integration === '是'
    const budget = answers.budget as string

    let recommendedModules = ['base-01']
    
    needs.forEach((need) => {
      const modules = moduleRecommendations[need] || []
      modules.forEach((m) => {
        if (!recommendedModules.includes(m)) {
          recommendedModules.push(m)
        }
      })
    })

    if (hasIntegration && !recommendedModules.includes('plugin-03')) {
      recommendedModules.push('plugin-03')
    }

    let priceMin = 10000
    let priceMax = 20000
    let days = '1-3天'

    if (budget === '1-3万') {
      recommendedModules = recommendedModules.slice(0, 2)
      priceMax = 30000
      days = '1-3天'
    } else if (budget === '3-10万') {
      priceMin = 30000
      priceMax = 100000
      days = '3-7天'
    } else if (budget === '10万+') {
      priceMin = 100000
      priceMax = 200000
      days = '1-2周'
    } else {
      priceMax = Math.min(50000 + (recommendedModules.length - 1) * 20000, 150000)
      days = '3-7天'
    }

    return { recommendedModules, priceMin, priceMax, days }
  }

  const handleContactSubmit = async () => {
    if (!contactInfo.name || !contactInfo.contact) {
      toast.error('请填写联系信息')
      return
    }

    setIsSubmitting(true)

    try {
      getRecommendations()
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_name: contactInfo.name,
          contact_phone: contactInfo.contact.includes('@') ? '' : contactInfo.contact,
          contact_email: contactInfo.contact.includes('@') ? contactInfo.contact : '',
          industry: answers.industry,
          company_size: answers.size,
          need_type: answers.needs,
          budget_range: answers.budget,
          source: 'diagnosis',
        }),
      })

      if (response.ok) {
        toast.success('提交成功！')
        setIsSubmitting(false)
      } else {
        toast.error('提交失败')
        setIsSubmitting(false)
      }
    } catch {
      toast.error('提交失败')
      setIsSubmitting(false)
    }
  }

  if (showContact) {
    return (
      <div className="glass-card max-w-md mx-auto">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-white mb-2">获取完整方案</h3>
          <p className="text-white/50 mb-6">留下您的联系方式，我们将发送详细方案</p>

          <div className="space-y-4">
            <div>
              <Label className="text-white/70">联系人姓名</Label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                placeholder="请输入姓名"
                value={contactInfo.name}
                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-white/70">手机号或邮箱</Label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                placeholder="请输入手机号或邮箱"
                value={contactInfo.contact}
                onChange={(e) => setContactInfo({ ...contactInfo, contact: e.target.value })}
              />
            </div>
            <Button
              className="w-full glow-btn text-white"
              onClick={handleContactSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  提交中...
                </>
              ) : (
                '提交'
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showResult) {
    const result = getRecommendations()

    return (
      <div className="glass-card max-w-2xl mx-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">您的 AI 机会清单</h3>
            <p className="text-white/50">基于您的回答，我们为您推荐以下方案</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="glass-card rounded-xl p-6">
              <h4 className="font-semibold text-white mb-4">推荐模块组合</h4>
              <div className="flex flex-wrap gap-2">
                {result.recommendedModules.map((moduleId) => (
                  <div key={moduleId} className="bg-white/[0.05] px-4 py-2 rounded-lg border border-white/[0.1]">
                    <span className="font-medium text-white/80">{moduleId}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
                <p className="text-white/50 mb-1">预估价格</p>
                <p className="text-2xl font-bold gradient-text">
                  ¥{result.priceMin.toLocaleString()} - {result.priceMax.toLocaleString()}
                </p>
              </div>
              <div className="glass-card rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-pink-400" />
                <p className="text-white/50 mb-1">预估周期</p>
                <p className="text-2xl font-bold text-white">{result.days}</p>
              </div>
            </div>
          </div>

          <Button
            className="w-full glow-btn text-white group"
            size="lg"
            onClick={() => setShowContact(true)}
          >
            获取完整方案
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card max-w-2xl mx-auto">
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/40">
              步骤 {currentStep + 1} / {steps.length}
            </span>
            <span className="text-sm font-medium text-blue-400">
              {step.title}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-white/[0.1]" />
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">{step.title}</h3>

          {step.type === 'single' ? (
            <RadioGroup
              value={answers[step.id] as string}
              onValueChange={handleSingleSelect}
              className="space-y-3"
            >
              {step.options.map((option) => (
                <div
                  key={option}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    answers[step.id] === option
                      ? 'border-blue-500/50 bg-blue-500/5'
                      : 'border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <RadioGroupItem value={option} id={option} className="border-white/30" />
                  <Label htmlFor={option} className="flex-1 cursor-pointer font-normal text-white">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-3">
              {step.options.map((option) => (
                <div
                  key={option}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    (answers[step.id] as string[])?.includes(option)
                      ? 'border-blue-500/50 bg-blue-500/5'
                      : 'border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                  onClick={() => handleMultipleSelect(option)}
                >
                  <Checkbox
                    checked={(answers[step.id] as string[])?.includes(option)}
                    onCheckedChange={() => handleMultipleSelect(option)}
                  />
                  <Label className="flex-1 cursor-pointer font-normal text-white">{option}</Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrev}
              className="flex-1 secondary-btn text-white/70 hover:text-white border-white/[0.1]"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              上一步
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 glow-btn text-white group"
          >
            {currentStep === steps.length - 1 ? '查看结果' : '下一步'}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  )
}
