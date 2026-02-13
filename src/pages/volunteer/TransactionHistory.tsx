import { useState } from 'react'
import { Receipt } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/shared/PageHeader'
import { CreditBadge } from '@/components/shared/CreditBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useData } from '@/hooks/useData'
import { formatDate } from '@/lib/utils'
import { TransactionType } from '@/types'

export default function TransactionHistory() {
  const { currentUser } = useAuth()
  const { getUserTransactions } = useData()
  const [filter, setFilter] = useState('all')

  const allTx = getUserTransactions(currentUser!.id)
  const filtered =
    filter === 'all'
      ? allTx
      : filter === 'earned'
        ? allTx.filter((t) => t.type === TransactionType.EARNED || t.type === TransactionType.ADJUSTMENT)
        : allTx.filter((t) => t.type === TransactionType.SPENT)

  // Calculate running balance
  let balance = 0
  const withBalance = [...filtered]
    .reverse()
    .map((tx) => {
      if (tx.type === TransactionType.EARNED || tx.type === TransactionType.ADJUSTMENT) {
        balance += tx.amount
      } else {
        balance -= tx.amount
      }
      return { ...tx, balance }
    })
    .reverse()

  return (
    <div className="space-y-6">
      <PageHeader title="Transaction History" description="Overview of all your credit transactions" />

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({allTx.length})</TabsTrigger>
          <TabsTrigger value="earned">Earned</TabsTrigger>
          <TabsTrigger value="spent">Spent</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          {withBalance.length === 0 ? (
            <EmptyState icon={Receipt} title="No transactions" description="Your transactions will appear here." />
          ) : (
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withBalance.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="text-sm">{formatDate(tx.date)}</TableCell>
                      <TableCell className="text-sm font-medium">{tx.description}</TableCell>
                      <TableCell className="text-right">
                        <CreditBadge
                          amount={tx.amount}
                          type={tx.type === TransactionType.SPENT ? 'spent' : 'earned'}
                          size="sm"
                        />
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">{tx.balance} CR</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
