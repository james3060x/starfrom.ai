import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

interface ServiceModule {
  id: string
  name: string
  type: 'base' | 'plugin' | 'subscription'
  category: string
  price_min: number | null
  price_max: number | null
  price_unit: string | null
  is_active: boolean
}

async function getModules() {
  const supabase = createClient()
  const { data } = await supabase
    .from('service_modules')
    .select('*')
    .order('sort_order', { ascending: true })
  
  return (data || []) as ServiceModule[]
}

export default async function ModulesPage() {
  const modules = await getModules()
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">模块管理</h2>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>价格</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-mono text-sm">{module.id}</TableCell>
                  <TableCell className="font-medium">{module.name}</TableCell>
                  <TableCell>
                    <Badge variant={module.type === 'base' ? 'default' : module.type === 'plugin' ? 'secondary' : 'outline'}>
                      {module.type === 'base' ? '基础' : module.type === 'plugin' ? '插件' : '订阅'}
                    </Badge>
                  </TableCell>
                  <TableCell>{module.category}</TableCell>
                  <TableCell>
                    ¥{module.price_min?.toLocaleString()} - {module.price_max?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={module.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                      {module.is_active ? '启用' : '禁用'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {modules.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              暂无模块
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
