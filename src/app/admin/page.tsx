import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

async function getStats() {
  const supabase = createClient()
  
  const { count: totalLeads } = await supabase
    .from('service_leads')
    .select('*', { count: 'exact', head: true })
  
  const { count: newLeads } = await supabase
    .from('service_leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')
  
  const { count: totalModules } = await supabase
    .from('service_modules')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
  
  const { count: totalCases } = await supabase
    .from('service_cases')
    .select('*', { count: 'exact', head: true })
  
  return { totalLeads, newLeads, totalModules, totalCases }
}

export default async function AdminPage() {
  const stats = await getStats()
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-gray-500">总线索数</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.totalLeads || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-gray-500">新线索</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#06b6d4]">{stats.newLeads || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-gray-500">服务模块</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.totalModules || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-gray-500">案例数</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCases || 0}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">快速操作</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <a href="/admin/leads" className="text-[#06b6d4] hover:underline">查看线索</a>
              <a href="/admin/modules" className="text-[#06b6d4] hover:underline">管理模块</a>
              <a href="/admin/cases" className="text-[#06b6d4] hover:underline">管理案例</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
