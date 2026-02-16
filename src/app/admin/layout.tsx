'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  useEffect(() => {
    const supabase = createClient()
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('已退出登录')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#1e3a5f] text-white py-4">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">StarFrom AI 管理后台</h1>
            <nav className="flex items-center gap-6">
              <a href="/admin" className="hover:text-[#06b6d4]">仪表盘</a>
              <a href="/admin/leads" className="hover:text-[#06b6d4]">线索</a>
              <a href="/admin/modules" className="hover:text-[#06b6d4]">模块</a>
              <a href="/admin/cases" className="hover:text-[#06b6d4]">案例</a>
              <a href="/" className="hover:text-[#06b6d4]">返回前台</a>
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:text-[#06b6d4] hover:bg-transparent"
                >
                  退出
                </Button>
              )}
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
