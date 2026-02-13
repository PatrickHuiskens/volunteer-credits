import { useNavigate } from 'react-router'
import { Users, Award, TrendingUp, ListTodo, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatCard } from '@/components/shared/StatCard'
import { CreditBadge } from '@/components/shared/CreditBadge'
import { useData } from '@/hooks/useData'
import { formatDate } from '@/lib/utils'
import { TaskStatus, TransactionType } from '@/types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { CATEGORY_CONFIG } from '@/lib/constants'

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b']

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg">
      <p className="text-sm font-medium mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{entry.value} CR</span>
        </div>
      ))}
    </div>
  )
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { name: string } }> }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg">
      <p className="text-sm font-medium">{payload[0].payload.name}</p>
      <p className="text-sm text-muted-foreground">{payload[0].value} tasks</p>
    </div>
  )
}

export default function AdminDashboard() {
  const { club, volunteers, transactions, tasks } = useData()
  const navigate = useNavigate()

  const topVolunteers = [...volunteers].sort((a, b) => b.totalEarned - a.totalEarned).slice(0, 5)
  const recentTransactions = transactions.slice(0, 8)
  const openTasks = tasks.filter((t) => t.status === TaskStatus.OPEN).length

  const monthlyData = [
    { month: 'Oct', earned: 380, spent: 210 },
    { month: 'Nov', earned: 420, spent: 280 },
    { month: 'Dec', earned: 310, spent: 190 },
    { month: 'Jan', earned: 450, spent: 320 },
    { month: 'Feb', earned: 520, spent: 350 },
    { month: 'Mar', earned: 280, spent: 150 },
  ]

  const categoryData = Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
    name: config.label,
    value: tasks.filter((t) => t.category === key).length,
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Active Volunteers"
          value={club.stats.activeVolunteers}
          trend={{ value: '+3 this month', positive: true }}
        />
        <StatCard icon={Award} label="Credits Issued" value={`${club.stats.totalCreditsIssued} CR`} />
        <StatCard icon={TrendingUp} label="Credits Spent" value={`${club.stats.totalCreditsSpent} CR`} />
        <StatCard icon={ListTodo} label="Open Tasks" value={openTasks} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Credits Issued vs Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Bar dataKey="earned" fill="#22c55e" name="Earned" radius={[6, 6, 0, 0]} />
                <Bar dataKey="spent" fill="#ef4444" name="Spent" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={100}
                  dataKey="value"
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Top Volunteers</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/members')}>
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {topVolunteers.map((v, idx) => (
              <div
                key={v.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-lg p-2 -mx-2"
                onClick={() => navigate(`/admin/members/${v.id}`)}
              >
                <span className="text-sm font-bold text-muted-foreground w-5">{idx + 1}</span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {v.firstName[0]}
                    {v.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {v.firstName} {v.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{v.tasksCompleted} tasks</p>
                </div>
                <CreditBadge amount={v.totalEarned} type="earned" size="sm" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/transactions')}>
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((tx) => {
              const vol = volunteers.find((v) => v.id === tx.userId)
              return (
                <div key={tx.id} className="flex items-center justify-between cursor-pointer rounded-lg p-2 -mx-2 hover:bg-muted/50 transition-colors" onClick={() => navigate('/admin/transactions')}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {vol ? `${vol.firstName} ${vol.lastName}` : 'Unknown'} · {formatDate(tx.date)}
                    </p>
                  </div>
                  <CreditBadge
                    amount={tx.amount}
                    type={tx.type === TransactionType.SPENT ? 'spent' : 'earned'}
                    size="sm"
                  />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
