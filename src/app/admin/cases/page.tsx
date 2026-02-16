import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

interface ServiceCase {
  id: string
  title: string
  industry: string | null
  company_size: string | null
  is_featured: boolean
  sort_order: number
}

async function getCases() {
  const supabase = createClient()
  const { data } = await supabase
    .from('service_cases')
    .select('*')
    .order('sort_order', { ascending: true })
  
  return (data || []) as ServiceCase[]
}

export default async function CasesAdminPage() {
  const cases = await getCases()
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">案例管理</h2>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>行业</TableHead>
                <TableHead>规模</TableHead>
                <TableHead>精选</TableHead>
                <TableHead>排序</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell className="font-medium">{caseItem.title}</TableCell>
                  <TableCell>{caseItem.industry}</TableCell>
                  <TableCell>{caseItem.company_size}</TableCell>
                  <TableCell>
                    <Badge className={caseItem.is_featured ? 'bg-[#06b6d4]' : 'bg-gray-300'}>
                      {caseItem.is_featured ? '是' : '否'}
                    </Badge>
                  </TableCell>
                  <TableCell>{caseItem.sort_order}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {cases.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              暂无案例
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
