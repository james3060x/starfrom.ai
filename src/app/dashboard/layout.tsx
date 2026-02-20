'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  BarChart3,
  CreditCard
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: '总览', icon: LayoutDashboard },
  { href: '/dashboard/agents', label: 'Agents', icon: Bot },
  { href: '/dashboard/chat', label: '对话', icon: MessageSquare },
  { href: '/dashboard/knowledge', label: '知识库', icon: BookOpen },
  { href: '/dashboard/usage', label: '用量统计', icon: BarChart3 },
  { href: '/dashboard/billing', label: '账单', icon: CreditCard },
  { href: '/dashboard/settings', label: '设置', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 pointer-events-none" />
      
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg lg:hidden"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <span className="text-xl font-bold text-white">AgentOS</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <Link
              href="/solo"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <span className="text-lg">🚀</span>
              <span>升级到 Solo</span>
            </Link>
            
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:pl-64 min-h-screen">
        <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="hidden lg:block" />
            
            <div className="flex items-center gap-4 ml-auto">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-white hidden sm:block">
                    {user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg border border-white/10 shadow-xl z-20">
                      <div className="p-3 border-b border-white/5">
                        <p className="text-sm text-white truncate">{user?.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-md"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          设置
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/5 rounded-md w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          退出登录
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
