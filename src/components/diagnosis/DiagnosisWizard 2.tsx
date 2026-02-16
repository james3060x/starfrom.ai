'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
    type: 'single',
    options: ['电商', '教育', '制造', '医疗', '金融', '通用', '其他']
  },
  {
    id: 'size',
    title: '团队规模？',
    type: 'single',
    options: ['1-10人', '10-50人', '50-200人', '200人以上']
  },
  {
    id: 'needs',
    title: '最想用 AI 解决什么问题？',
    type: 'multiple',
    options: ['客服', '知识管理', '内容生成', '数据分析', '流程自动化', '系统集成', '其他']
  },
  {
    id: 'integration',
    title: '是否有现有系统需要对接？',
    type: 'single',
    options: ['是', '否']
  },
  {
    id: 'budget',
    title: '预算范围？',
    type: 'single',
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
  const [answers, setAnswers] = useState<Record<string, any>>({})
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
    const current = answers[step.id] || []
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value]
    setAnswers({ ...answers, [step.id]: updated })
  }

  const handleNext = () => {
    if (step.type === 'single' && !answers[step.id]) {
      toast.error('请选择一个选项')
      return
    }
    if (step.type === 'multiple' && (!answers[step.id] || answers[step.id].length === 0)) {
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
    const needs: string[] = answers.needs || []
    const hasIntegration = answers.integration === '是'
    const budget = answers.budget

    let recommendedModules = ['base-01']
    
    needs.forEach((need: string) => {
      const modules = moduleRecommendations[need] || []
      modules.forEach((m: string) => {
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
      const result = getRecommendations()
      
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
    } catch (error) {
      toast.error('提交失败')
      setIsSubmitting(false)
    }
  }

  if (showContact) {
    return (
      <Card className="border-0 shadow-xl max-w-md mx-auto">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">获取完整方案</h3>
          <p className="text-gray-600 mb-6">留下您的联系方式，我们将发送详细方案</p>
          
          <div className="space-y-4">
            <div>
              <Label>联系人姓名</Label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 border rounded-lg"
                placeholder="请输入姓名"
                value={contactInfo.name}
                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
              />
            </div>
            <div>
              <Label>手机号或邮箱</Label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 border rounded-lg"
                placeholder="请输入手机号或邮箱"
                value={contactInfo.contact}
                onChange={(e) => setContactInfo({ ...contactInfo, contact: e.target.value })}
              />
            </div>
            <Button
              className="w-full bg-[#06b6d4] hover:bg-[#0891b2]"
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
        </CardContent>
      </Card>
    )
  }

  if (showResult) {
    const result = getRecommendations()
    
    return (
      <Card className="border-0 shadow-xl max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">您的 AI 机会清单</h3>
            <p className="text-gray-600">基于您的回答，我们为您推荐以下方案</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">推荐模块组合</h4>
              <div className="flex flex-wrap gap-2">
                {result.recommendedModules.map((moduleId) => (
                  <div key={moduleId} className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="font-medium text-gray-900">{moduleId}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1e3a5f] rounded-xl p-6 text-white">
                <p className="text-gray-300 mb-1">预估价格</p>
                <p className="text-2xl font-bold">
                  ¥{result.priceMin.toLocaleString()} - {result.priceMax.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#06b6d4] rounded-xl p-6 text-white">
                <p className="text-gray-100 mb-1">预估周期</p>
                <p className="text-2xl font-bold">{result.days}</p>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-[#06b6d4] hover:bg-[#0891b2]"
            size="lg"
            onClick={() => setShowContact(true)}
          >
            获取完整方案
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              步骤 {currentStep + 1} / {steps.length}
            </span>
            <span className="text-sm font-medium text-[#06b6d4]">
              {step.title}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{step.title}</h3>

          {step.type === 'single' ? (
            <RadioGroup
              value={answers[step.id]}
              onValueChange={handleSingleSelect}
              className="space-y-3"
            >
              {step.options.map((option) => (
                <div
                  key={option}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    answers[step.id] === option
                      ? 'border-[#06b6d4] bg-[#06b6d4]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="flex-1 cursor-pointer font-normal">
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
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    answers[step.id]?.includes(option)
                      ? 'border-[#06b6d4] bg-[#06b6d4]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleMultipleSelect(option)}
                >
                  <Checkbox
                    checked={answers[step.id]?.includes(option)}
                    onCheckedChange={() => handleMultipleSelect(option)}
                  />
                  <Label className="flex-1 cursor-pointer font-normal">{option}</Label>
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
              className="flex-1"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              上一步
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 bg-[#06b6d4] hover:bg-[#0891b2]"
          >
            {currentStep === steps.length - 1 ? '查看结果' : '下一步'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
