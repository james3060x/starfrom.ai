'use client'

import { MessageCircle, Check, FileCheck, Settings, GraduationCap } from 'lucide-react'

const steps = [
  {
    icon: MessageCircle,
    title: '需求诊断',
    duration: '1 天',
    description: '深入了解业务场景，明确 AI 应用场景',
  },
  {
    icon: Check,
    title: 'Demo 演示',
    duration: '1 天',
    description: '展示真实效果，确认方案可行性',
  },
  {
    icon: FileCheck,
    title: '签约确认',
    duration: '',
    description: '明确交付内容和周期，签署服务协议',
  },
  {
    icon: Settings,
    title: '配置部署',
    duration: '1-2 天',
    description: '知识库导入、Prompt 调优、系统集成',
  },
  {
    icon: GraduationCap,
    title: '培训交付',
    duration: '半天',
    description: '使用培训、文档交付、上线支持',
  },
]

export function ProcessTimeline() {
  return (
    <section className="relative py-32">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="badge-neon mb-6">
            交付流程
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-5">
            5 步交付，最快 3 天上线
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto font-light">
            标准化交付流程，确保每个项目高质量准时交付
          </p>
        </div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-[2.25rem] left-[4rem] right-[4rem] h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div className="relative w-[4.5rem] h-[4.5rem] rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-5">
                  <step.icon className="w-6 h-6 text-blue-400" />
                  
                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
                
                {/* Duration Badge */}
                {step.duration && (
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/50 text-xs mb-3">
                    {step.duration}
                  </span>
                )}
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
