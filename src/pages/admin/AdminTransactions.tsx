import { useState } from 'react'
import { Receipt, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatCard } from '@/components/shared/StatCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { CreditBadge } from '@/components/shared/CreditBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { useData } from '@/hooks/useData'
import { formatDate } from '@/lib/utils'
import { TransactionType } from '@/types'

export default function AdminTransactions() {
  const { transactions, volunteers, club } = useData()
  const [filter, setFilter] = useState('all')

  const filtered =
    filter === 'all'
      ? transactions
      : filter === 'earned'
        ? transactions.filter(
            (t) => t.type === TransactionType.EARNED || t.type === TransactionType.ADJUSTMENT
          )
        : transactions.filter((t) => t.type === TransactionType.SPENT)

  const outstanding = club.stats.totalCreditsIssued - club.stats.totalCreditsSpent

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" description="Overview of all credit transactions" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={TrendingUp} label="Total Issued" value={`${club.stats.totalCreditsIssued} CR`} />
        <StatCard icon={TrendingDown} label="Total Spent" value={`${club.stats.totalCreditsSpent} CR`} />
        <StatCard icon={Wallet} label="Outstanding" value={`${outstanding} CR`} />
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
          <TabsTrigger value="earned">Earned</TabsTrigger>
          <TabsTrigger value="spent">Spent</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          {filtered.length === 0 ? (
            <EmptyState icon={Receipt} title="No transactions" description="Transactions will appear here." />
          ) : (
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((tx) => {
                    const vol = volunteers.find((v) => v.id === tx.userId)
                    return (
                      <TableRow key={tx.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="text-sm">{formatDate(tx.date)}</TableCell>
                        <TableCell className="text-sm font-medium">
                          {vol ? `${vol.firstName} ${vol.lastName}` : 'Unknown'}
                        </TableCell>
                        <TableCell className="text-sm">{tx.description}</TableCell>
                        <TableCell className="text-sm capitalize">{tx.type}</TableCell>
                        <TableCell className="text-right">
                          <CreditBadge
                            amount={tx.amount}
                            type={tx.type === TransactionType.SPENT ? 'spent' : 'earned'}
                            size="sm"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
