import type { Database } from '@/lib/supabase/types'

export type Module = Database['public']['Tables']['service_modules']['Row']
export type ServiceCase = Database['public']['Tables']['service_cases']['Row']
export type Lead = Database['public']['Tables']['service_leads']['Row']
export type DiagnosisResult = Database['public']['Tables']['diagnosis_results']['Row']

export const industries = [
  '电商',
  '教育',
  '制造',
  '医疗',
  '金融',
  '通用',
  '其他'
] as const

export const companySizes = [
  '1-10人',
  '10-50人',
  '50-200人',
  '200人以上'
] as const

export const needTypes = [
  '智能客服',
  '知识库问答',
  '内容生成',
  '数据分析',
  '流程自动化',
  '系统集成',
  '私有化部署',
  '其他'
] as const

export const budgetRanges = [
  '1-3万',
  '3-10万',
  '10-30万',
  '30万以上',
  '不确定'
] as const

export const timelines = [
  '1周内',
  '1个月内',
  '3个月内',
  '不确定'
] as const

export const leadSources = [
  { value: 'hero', label: '首页' },
  { value: 'pricing', label: '定价页' },
  { value: 'case', label: '案例页' },
  { value: 'diagnosis', label: '诊断工具' },
  { value: 'footer', label: '页脚' },
  { value: 'demo', label: 'Demo体验' },
] as const

export const leadStatuses = [
  { value: 'new', label: '新线索', color: 'bg-blue-500' },
  { value: 'contacted', label: '已联系', color: 'bg-yellow-500' },
  { value: 'demo_scheduled', label: '预约演示', color: 'bg-purple-500' },
  { value: 'proposal', label: '方案中', color: 'bg-orange-500' },
  { value: 'signed', label: '已签约', color: 'bg-green-500' },
  { value: 'lost', label: '已流失', color: 'bg-gray-500' },
] as const
