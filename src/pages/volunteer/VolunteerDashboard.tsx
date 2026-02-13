import { useNavigate } from 'react-router'
import { Wallet, TrendingUp, TrendingDown, ArrowRight, Pin, Megaphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/shared/StatCard'
import { TaskCard } from '@/components/shared/TaskCard'
import { CreditBadge } from '@/components/shared/CreditBadge'
import { useAuth } from '@/hooks/useAuth'
import { useData } from '@/hooks/useData'
import { formatDate } from '@/lib/utils'
import { TaskStatus, type Volunteer } from '@/types'

export default function VolunteerDashboard() {
  const { currentUser } = useAuth()
  const { tasks, getUserTransactions, cancelTaskSignUp, announcements, volunteers } = useData()
  const navigate = useNavigate()

  const volunteer = currentUser as Volunteer
  const myTransactions = getUserTransactions(volunteer.id).slice(0, 5)
  const upcomingTasks = tasks
    .filter(
      (t) =>
        t.assignedVolunteerIds.includes(volunteer.id) &&
        t.status !== TaskStatus.COMPLETED &&
        t.status !== TaskStatus.CANCELLED
    )
    .slice(0, 3)

  const pinnedAnnouncements = announcements.filter((a) => a.isPinned)
  const regularAnnouncements = announcements.filter((a) => !a.isPinned).slice(0, 3)
  const displayedAnnouncements = [...pinnedAnnouncements, ...regularAnnouncements].slice(0, 5)

  return (
    <div className="space-y-6">
      {displayedAnnouncements.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {displayedAnnouncements.map((ann) => {
              const author = [...volunteers].find((v) => v.id === ann.authorId) ?? { firstName: 'Admin', lastName: '' }
              return (
                <div key={ann.id} className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-center gap-2">
                    {ann.isPinned && <Pin className="h-3.5 w-3.5 text-amber-600" />}
                    <h4 className="text-sm font-semibold">{ann.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {author.firstName} {author.lastName} · {formatDate(ann.date)}
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Credit Balance" value={`${volunteer.creditBalance} CR`} />
        <StatCard
          icon={TrendingUp}
          label="Total Earned"
          value={`${volunteer.totalEarned} CR`}
          trend={{ value: '+25 this month', positive: true }}
        />
        <StatCard icon={TrendingDown} label="Total Spent" value={`${volunteer.totalSpent} CR`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Upcoming Tasks</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/volunteer/tasks')}>
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No upcoming tasks. Browse available tasks to sign up!
              </p>
            ) : (
              upcomingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showSignUp
                  isSignedUp
                  onCancel={() => cancelTaskSignUp(task.id, volunteer.id)}
                  onClick={() => navigate(`/volunteer/tasks/${task.id}`)}
                />
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/volunteer/transactions')}>
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {myTransactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No transactions yet.</p>
            ) : (
              <div className="space-y-3">
                {myTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between cursor-pointer rounded-lg p-2 -mx-2 hover:bg-muted/50 transition-colors" onClick={() => navigate('/volunteer/transactions')}>
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                    </div>
                    <CreditBadge
                      amount={tx.amount}
                      type={tx.type === 'earned' || tx.type === 'adjustment' ? 'earned' : 'spent'}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/volunteer/tasks')}>Browse Tasks</Button>
          <Button variant="outline" onClick={() => navigate('/volunteer/shop')}>
            Visit Shop
          </Button>
          <Button variant="outline" onClick={() => navigate('/volunteer/transactions')}>
            View History
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
