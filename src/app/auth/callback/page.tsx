'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession()
      
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setLoading(false)
      router.push('/dashboard')
    }

    handleCallback()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4" />
          <p className="text-white/60">验证中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <a href="/auth/login" className="text-cyan-400 hover:underline">
            返回登录
          </a>
        </div>
      </div>
    )
  }

  return null
}
