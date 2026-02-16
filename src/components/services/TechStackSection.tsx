import { Card, CardContent } from '@/components/ui/card'

const techStack = [
  { name: 'Dify', description: 'AI 工作流编排平台', category: '平台' },
  { name: 'FastGPT', description: '知识库问答系统', category: '平台' },
  { name: 'DeepSeek', description: '国产大语言模型', category: '模型' },
  { name: 'Qwen', description: '通义千问多模态模型', category: '模型' },
  { name: 'One API', description: '模型路由网关', category: '网关' },
  { name: 'RAGFlow', description: '复杂文档解析', category: 'RAG' },
  { name: 'Milvus', description: '向量数据库', category: '数据库' },
  { name: 'LangGraph', description: 'Agent 工作流引擎', category: '框架' },
  { name: 'Docker', description: '容器化部署', category: '部署' },
  { name: 'Kubernetes', description: '容器编排', category: '部署' },
]

export function TechStackSection() {
  return (
    <section className="py-16 bg-gray-50 rounded-2xl px-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">技术栈</h2>
        <p className="text-gray-600">采用业界领先的开源技术，确保系统稳定可靠</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {techStack.map((tech, index) => (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-lg font-bold text-[#1e3a5f]">
                  {tech.name.slice(0, 2)}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{tech.name}</h4>
              <p className="text-xs text-gray-500">{tech.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
