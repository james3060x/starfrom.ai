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
import { toast } from 'sonner'
import { contactContent, optionsContent } from '@/lib/content'

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
            {contactContent['提交成功页面']['标题']}
          </h3>
          <p className="text-gray-600 mb-2">
            {contactContent['提交成功页面']['提示1']}
          </p>
          <p className="text-gray-500 text-sm">
            {contactContent['提交成功页面']['提示2']}
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
              <Label htmlFor="company_name">{contactContent['联系表单']['公司名称标签']}</Label>
              <Input
                id="company_name"
                placeholder={contactContent['联系表单']['公司名称占位符']}
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_name">{contactContent['联系表单']['联系人标签']}</Label>
              <Input
                id="contact_name"
                placeholder={contactContent['联系表单']['联系人占位符']}
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">{contactContent['联系表单']['手机号标签']}</Label>
              <Input
                id="contact_phone"
                placeholder={contactContent['联系表单']['手机号占位符']}
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_wechat">{contactContent['联系表单']['微信号标签']}</Label>
              <Input
                id="contact_wechat"
                placeholder={contactContent['联系表单']['微信号占位符']}
                value={formData.contact_wechat}
                onChange={(e) => setFormData({ ...formData, contact_wechat: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">{contactContent['联系表单']['邮箱标签']}</Label>
              <Input
                id="contact_email"
                type="email"
                placeholder={contactContent['联系表单']['邮箱占位符']}
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>{contactContent['联系表单']['行业标签']}</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={contactContent['联系表单']['行业占位符']} />
                </SelectTrigger>
                <SelectContent>
                  {optionsContent.industries.map((industry: string) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{contactContent['联系表单']['团队规模标签']}</Label>
              <Select
                value={formData.company_size}
                onValueChange={(value) => setFormData({ ...formData, company_size: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={contactContent['联系表单']['团队规模占位符']} />
                </SelectTrigger>
                <SelectContent>
                  {optionsContent.companySizes.map((size: string) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>{contactContent['联系表单']['需求类型标签']}</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {optionsContent.needTypes.map((type: string) => (
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
              <Label>{contactContent['联系表单']['预算范围标签']}</Label>
              <Select
                value={formData.budget_range}
                onValueChange={(value) => setFormData({ ...formData, budget_range: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={contactContent['联系表单']['预算范围占位符']} />
                </SelectTrigger>
                <SelectContent>
                  {optionsContent.budgetRanges.map((range: string) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{contactContent['联系表单']['上线时间标签']}</Label>
              <Select
                value={formData.expected_timeline}
                onValueChange={(value) => setFormData({ ...formData, expected_timeline: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={contactContent['联系表单']['上线时间占位符']} />
                </SelectTrigger>
                <SelectContent>
                  {optionsContent.timelines.map((timeline: string) => (
                    <SelectItem key={timeline} value={timeline}>
                      {timeline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">{contactContent['联系表单']['补充说明标签']}</Label>
            <Textarea
              id="notes"
              placeholder={contactContent['联系表单']['补充说明占位符']}
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
                {contactContent['联系表单']['提交中']}
              </>
            ) : (
              contactContent['联系表单']['提交按钮']
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
