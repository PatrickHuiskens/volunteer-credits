import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Mail, Phone, Calendar, Wallet, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StatCard } from '@/components/shared/StatCard'
import { CreditBadge } from '@/components/shared/CreditBadge'
import { useData } from '@/hooks/useData'
import { formatDate } from '@/lib/utils'
import { TransactionType } from '@/types'
import { toast } from 'sonner'

export default function AdminMemberDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { volunteers, getUserTransactions, tasks, adjustCredits } = useData()
  const [adjustOpen, setAdjustOpen] = useState(false)
  const [adjustAmount, setAdjustAmount] = useState(0)
  const [adjustDesc, setAdjustDesc] = useState('')

  const volunteer = volunteers.find((v) => v.id === id)
  if (!volunteer) return <div className="p-8 text-center">Member not found</div>

  const initials = `${volunteer.firstName[0]}${volunteer.lastName[0]}`
  const txs = getUserTransactions(volunteer.id)
  const memberTasks = tasks.filter((t) => t.assignedVolunteerIds.includes(volunteer.id))

  const handleAdjust = () => {
    if (adjustAmount === 0 || !adjustDesc) {
      toast.error('Please fill in amount and description')
      return
    }
    adjustCredits(volunteer.id, adjustAmount, adjustDesc)
    toast.success(`Credits adjusted by ${adjustAmount > 0 ? '+' : ''}${adjustAmount} CR`)
    setAdjustOpen(false)
    setAdjustAmount(0)
    setAdjustDesc('')
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-xl font-bold">
              {volunteer.firstName} {volunteer.lastName}
            </h2>
            <p className="text-sm text-muted-foreground capitalize">{volunteer.role}</p>
            <Separator className="my-4" />
            <div className="w-full space-y-3 text-sm text-left">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{volunteer.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{volunteer.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {formatDate(volunteer.joinedDate)}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <Button variant="outline" className="w-full" onClick={() => setAdjustOpen(true)}>
              <Wallet className="mr-2 h-4 w-4" />
              Adjust Credits
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={Wallet} label="Balance" value={`${volunteer.creditBalance} CR`} />
            <StatCard icon={Award} label="Tasks Done" value={volunteer.tasksCompleted} />
            <StatCard icon={Wallet} label="Total Earned" value={`${volunteer.totalEarned} CR`} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Task History</CardTitle>
            </CardHeader>
            <CardContent>
              {memberTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
              ) : (
                <div className="space-y-2">
                  {memberTasks.slice(0, 5).map((t) => (
                    <div key={t.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{t.title}</span>
                      <div className="flex items-center gap-2">
                        <CreditBadge amount={t.creditReward} size="sm" />
                        <span className="text-xs text-muted-foreground">{formatDate(t.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {txs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No transactions</p>
              ) : (
                <div className="rounded-md border overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {txs.slice(0, 10).map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="text-sm">{formatDate(tx.date)}</TableCell>
                          <TableCell className="text-sm">{tx.description}</TableCell>
                          <TableCell className="text-right">
                            <CreditBadge
                              amount={tx.amount}
                              type={tx.type === TransactionType.SPENT ? 'spent' : 'earned'}
                              size="sm"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Amount (positive to add, negative to deduct)</Label>
              <Input
                type="number"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                value={adjustDesc}
                onChange={(e) => setAdjustDesc(e.target.value)}
                placeholder="e.g. Admin bonus, correction..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdjust}>Adjust Credits</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
