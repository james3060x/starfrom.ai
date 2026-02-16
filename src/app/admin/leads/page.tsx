import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { leadStatuses, leadSources } from '@/lib/constants'

type Lead = {
  id: string
  contact_name: string
  company_name: string | null
  industry: string | null
  source: string | null
  status: string
  created_at: string
}

async function getLeads() {
  const supabase = createClient()
  const { data } = await supabase
    .from('service_leads')
    .select('*')
    .order('created_at', { ascending: false })
  
  return (data || []) as Lead[]
}

export default async function LeadsPage() {
  const leads = await getLeads()
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">线索管理</h2>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>联系人</TableHead>
                <TableHead>公司</TableHead>
                <TableHead>行业</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>提交时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => {
                const status = leadStatuses.find(s => s.value === lead.status)
                const source = leadSources.find(s => s.value === lead.source)
                
                return (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.contact_name}</TableCell>
                    <TableCell>{lead.company_name || '-'}</TableCell>
                    <TableCell>{lead.industry || '-'}</TableCell>
                    <TableCell>{source?.label || lead.source || '-'}</TableCell>
                    <TableCell>
                      {status && (
                        <Badge className={`${status.color} text-white`}>
                          {status.label}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(lead.created_at).toLocaleDateString('zh-CN')}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          
          {leads.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              暂无线索
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
