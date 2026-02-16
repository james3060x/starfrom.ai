import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '管理后台 - StarFrom AI',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#1e3a5f] text-white py-4">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">StarFrom AI 管理后台</h1>
            <nav className="flex gap-6">
              <a href="/admin" className="hover:text-[#06b6d4]">仪表盘</a>
              <a href="/admin/leads" className="hover:text-[#06b6d4]">线索</a>
              <a href="/admin/modules" className="hover:text-[#06b6d4]">模块</a>
              <a href="/admin/cases" className="hover:text-[#06b6d4]">案例</a>
              <a href="/" className="hover:text-[#06b6d4]">返回前台</a>
            </nav>
          </div>
        </div>
      </div>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
