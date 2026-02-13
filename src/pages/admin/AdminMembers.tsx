import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Users, Search } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/PageHeader'
import { CreditBadge } from '@/components/shared/CreditBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { useData } from '@/hooks/useData'
import { formatDate } from '@/lib/utils'

export default function AdminMembers() {
  const { volunteers } = useData()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = volunteers.filter((v) =>
    `${v.firstName} ${v.lastName} ${v.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Members" description="Manage club members and their credits" />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No members found" description="Try adjusting your search." />
      ) : (
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Tasks Done</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow
                  key={v.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/admin/members/${v.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {v.firstName[0]}
                          {v.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {v.firstName} {v.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{v.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {v.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <CreditBadge amount={v.creditBalance} size="sm" />
                  </TableCell>
                  <TableCell className="text-sm">{v.tasksCompleted}</TableCell>
                  <TableCell className="text-sm">{formatDate(v.joinedDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
