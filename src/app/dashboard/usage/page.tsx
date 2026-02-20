'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart3, Activity, Clock, Zap, TrendingUp, Calendar } from 'lucide-react'

export default function UsagePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      try {
        const token = await supabase.auth.getSession()
        const response = await fetch(`/api/usage?period=${period}`, {
          headers: {
            'Authorization': `Bearer ${token.data.session?.access_token}`
          }
        })
        const data = await response.json()
        
        if (data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch usage:', error)
      }

      setLoading(false)
    }

    fetchData()
  }, [period, router, supabase])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    )
  }

  const summary = stats?.summary || {
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    avgLatencyMs: 0,
    totalTokens: 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">用量统计</h1>
          <p className="text-slate-400">查看 API 使用情况</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="7d">最近 7 天</option>
            <option value="30d">最近 30 天</option>
            <option value="90d">最近 90 天</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">总调用次数</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatNumber(summary.totalCalls)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">成功调用</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {formatNumber(summary.successfulCalls)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">平均延迟</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {summary.avgLatencyMs}ms
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Token 消耗</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {formatNumber(summary.totalTokens)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            调用趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.timeline && Object.keys(stats.timeline).length > 0 ? (
            <div className="h-48 flex items-end gap-1">
              {Object.entries(stats.timeline).map(([date, count]: [string, any]) => {
                const maxCount = Math.max(...Object.values(stats.timeline))
                const height = maxCount > 0 ? (count / maxCount) * 100 : 0
                return (
                  <div key={date} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-cyan-500/60 rounded-t hover:bg-cyan-400 transition-colors"
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${date}: ${count} 次调用`}
                    />
                    <span className="text-[10px] text-slate-500 transform -rotate-45 origin-left">
                      {date.slice(5)}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400">
              暂无调用数据
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-white">接口调用分布</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.byEndpoint && Object.keys(stats.byEndpoint).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.byEndpoint).map(([endpoint, count]: [string, any]) => (
                <div key={endpoint} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <code className="text-sm text-cyan-400">{endpoint}</code>
                  <span className="text-white font-medium">{formatNumber(count)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              暂无接口调用数据
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-white">最近调用记录</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentCalls && stats.recentCalls.length > 0 ? (
            <div className="space-y-2">
              {stats.recentCalls.map((call: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg text-sm">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      call.status_code && call.status_code < 400
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {call.method}
                    </span>
                    <code className="text-slate-300">{call.endpoint}</code>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <span>{call.latency_ms}ms</span>
                    <span>{call.called_at?.slice(11, 19)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              暂无调用记录
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
