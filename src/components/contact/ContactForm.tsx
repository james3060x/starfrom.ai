'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2 } from 'lucide-react'
import { usePricingStore } from '@/lib/store'
import { industries, companySizes, needTypes, budgetRanges, timelines } from '@/lib/constants'
import { toast } from 'sonner'

export function ContactForm() {
  const searchParams = useSearchParams()
  const { selectedModules, clearModules } = usePricingStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    contact_phone: '',
    contact_wechat: '',
    contact_email: '',
    industry: '',
    company_size: '',
    need_type: [] as string[],
    budget_range: '',
    expected_timeline: '',
    notes: '',
  })
  
  const source = searchParams.get('source') || 'contact'
  const hasModules = selectedModules.length > 0
  
  useEffect(() => {
    return () => {
      if (isSubmitted) {
        clearModules()
      }
    }
  }, [isSubmitted, clearModules])
  
  const handleNeedTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      need_type: prev.need_type.includes(type)
        ? prev.need_type.filter(t => t !== type)
        : [...prev.need_type, type]
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.contact_name) {
      toast.error('请填写联系人姓名')
      return
    }
    
    if (!formData.contact_phone && !formData.contact_wechat && !formData.contact_email) {
      toast.error('请至少填写一种联系方式')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source,
          selected_modules: selectedModules.map(m => ({ id: m.id, name: m.name })),
        }),
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        toast.success('提交成功！我们将在24小时内与您联系')
      } else {
        toast.error('提交失败，请稍后重试')
      }
    } catch {
      toast.error('提交失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (isSubmitted) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            已收到您的需求
          </h3>
          <p className="text-gray-600 mb-2">
            我们将在 24 小时内与您联系
          </p>
          <p className="text-gray-500 text-sm">
            如需紧急咨询，请添加微信：starfrom-ai
          </p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-8">
        {hasModules && (
          <div className="mb-6 p-4 bg-[#06b6d4]/10 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">您已选择的模块：</p>
            <div className="flex flex-wrap gap-2">
              {selectedModules.map((module) => (
                <Badge key={module.id} variant="secondary">
                  {module.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company_name">公司名称</Label>
              <Input
                id="company_name"
                placeholder="请输入公司名称"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_name">联系人姓名 *</Label>
              <Input
                id="contact_name"
                placeholder="请输入联系人姓名"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">手机号</Label>
              <Input
                id="contact_phone"
                placeholder="请输入手机号"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_wechat">微信号</Label>
              <Input
                id="contact_wechat"
                placeholder="请输入微信号"
                value={formData.contact_wechat}
                onChange={(e) => setFormData({ ...formData, contact_wechat: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_email">邮箱</Label>
              <Input
                id="contact_email"
                type="email"
                placeholder="请输入邮箱"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>行业</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择行业" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>团队规模</Label>
              <Select
                value={formData.company_size}
                onValueChange={(value) => setFormData({ ...formData, company_size: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择团队规模" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>需求类型（可多选）</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {needTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={formData.need_type.includes(type)}
                    onCheckedChange={() => handleNeedTypeToggle(type)}
                  />
                  <Label htmlFor={type} className="text-sm font-normal cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>预算范围</Label>
              <Select
                value={formData.budget_range}
                onValueChange={(value) => setFormData({ ...formData, budget_range: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择预算范围" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>期望上线时间</Label>
              <Select
                value={formData.expected_timeline}
                onValueChange={(value) => setFormData({ ...formData, expected_timeline: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择期望上线时间" />
                </SelectTrigger>
                <SelectContent>
                  {timelines.map((timeline) => (
                    <SelectItem key={timeline} value={timeline}>
                      {timeline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">补充说明</Label>
            <Textarea
              id="notes"
              placeholder="请描述您的具体需求或问题..."
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-[#06b6d4] hover:bg-[#0891b2]"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                提交中...
              </>
            ) : (
              '提交咨询'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
