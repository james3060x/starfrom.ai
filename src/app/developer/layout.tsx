'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

export default function DeveloperLayout({
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
      if (!user) {
        router.push('/admin/login')
        return
      }
      setUser(user)
    }
    getUser()
  }, [router])

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
            <h1 className="text-xl font-bold">开发者门户</h1>
            <nav className="flex items-center gap-6">
              <a href="/developer" className="hover:text-[#06b6d4]">API密钥</a>
              <a href="/developer/docs" className="hover:text-[#06b6d4]">API文档</a>
              <a href="/developer/webhooks" className="hover:text-[#06b6d4]">Webhook</a>
              <a href="/developer/logs" className="hover:text-[#06b6d4]">调用日志</a>
              <a href="/admin" className="hover:text-[#06b6d4]">管理后台</a>
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
