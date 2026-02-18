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
    <section className="py-16 glass-card rounded-2xl px-8">
      <div className="text-center mb-12">
        <span className="badge-neon mb-4 inline-block">技术架构</span>
        <h2 className="text-2xl font-bold text-white mb-2">技术栈</h2>
        <p className="text-white/50">采用业界领先的开源技术，确保系统稳定可靠</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {techStack.map((tech, index) => (
          <div key={index} className="glass-card p-4 text-center card-hover">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 mx-auto mb-3 flex items-center justify-center border border-blue-500/20">
              <span className="text-lg font-bold gradient-text">
                {tech.name.slice(0, 2)}
              </span>
            </div>
            <h4 className="font-semibold text-white mb-1">{tech.name}</h4>
            <p className="text-xs text-white/40">{tech.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
