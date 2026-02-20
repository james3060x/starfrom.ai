'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('密码不匹配')
      return
    }

    if (password.length < 6) {
      toast.error('密码至少需要 6 个字符')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (data.user) {
        // Create free trial user record
        const { error: profileError } = await supabase
          .from('solo_users')
          .insert({
            user_id: data.user.id,
            plan_type: 'free',
            plan_status: 'active',
            agent_limit: 1,
            storage_limit_gb: 0.5,
            api_calls_limit: 1000,
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        toast.success('注册成功！请检查邮箱验证链接')
        router.push('/auth/login')
      }
    } catch (error) {
      toast.error('注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignup = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) {
      toast.error(`${provider} 登录失败`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      
      <Card className="w-full max-w-md relative z-10 glass-card border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <span className="text-4xl">🤖</span>
          </div>
          <CardTitle className="text-2xl font-bold text-white">创建账户</CardTitle>
          <CardDescription className="text-white/60">
            开始你的 AI 智能体之旅
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80">邮箱</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-white/80">密码</label>
              <Input
                type="password"
                placeholder="至少 6 位"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-white/80">确认密码</label>
              <Input
                type="password"
                placeholder="再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-600"
              disabled={loading}
            >
              {loading ? '注册中...' : '注册'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900 px-2 text-white/40">或</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignup('google')}
              className="border-white/10 text-white hover:bg-white/5"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignup('github')}
              className="border-white/10 text-white hover:bg-white/5"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>

          <p className="text-center text-white/60 text-sm mt-6">
            已有账户？{' '}
            <Link href="/auth/login" className="text-cyan-400 hover:underline">
              登录
            </Link>
          </p>

          <p className="text-center text-white/40 text-xs mt-4">
            注册即表示同意我们的{' '}
            <a href="/terms" className="underline hover:text-white">服务条款</a>
            {' '}和{' '}
            <a href="/privacy" className="underline hover:text-white">隐私政策</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
