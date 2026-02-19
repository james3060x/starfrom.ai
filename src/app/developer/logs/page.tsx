'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'

interface ApiLog {
  id: string
  endpoint: string
  method: string
  status_code: number
  latency_ms: number | null
  created_at: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<ApiLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLogs()
  }, [])

  async function loadLogs() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setLoading(false)
      return
    }

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    const ws = workspace as { id: string } | null
    if (!ws) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('api_call_logs')
      .select('id, endpoint, method, status_code, latency_ms, created_at')
      .eq('workspace_id', ws.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (data) {
      setLogs(data)
    }
    setLoading(false)
  }

  function getMethodColor(method: string) {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-blue-100 text-blue-700'
      case 'POST': return 'bg-green-100 text-green-700'
      case 'PUT': return 'bg-yellow-100 text-yellow-700'
      case 'DELETE': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  function getStatusIcon(code: number) {
    if (code >= 200 && code < 300) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (code >= 400) return <XCircle className="w-4 h-4 text-red-500" />
    return <Clock className="w-4 h-4 text-yellow-500" />
  }

  if (loading) {
    return <div className="text-center py-12">加载中...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">API 调用日志</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">今日请求</p>
            <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">成功率</p>
            <p className="text-2xl font-bold text-green-600">
              {logs.length > 0 
                ? Math.round((logs.filter(l => l.status_code < 400).length / logs.length) * 100) 
                : 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">平均延迟</p>
            <p className="text-2xl font-bold text-[#06b6d4]">
              {logs.length > 0 
                ? Math.round((logs.reduce((acc, l) => acc + (l.latency_ms || 0), 0) / logs.length)) 
                : 0}ms
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">错误率</p>
            <p className="text-2xl font-bold text-red-600">
              {logs.length > 0 
                ? Math.round((logs.filter(l => l.status_code >= 400).length / logs.length) * 100) 
                : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            最近调用记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无API调用记录</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">时间</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">方法</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">端点</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">延迟</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        {new Date(log.created_at).toLocaleString('zh-CN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-xs rounded ${getMethodColor(log.method)}`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-gray-600">
                        {log.endpoint}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status_code)}
                          <span className={`text-sm ${
                            log.status_code >= 400 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {log.status_code}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {log.latency_ms ? `${log.latency_ms}ms` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
