import { Award, Calendar, Mail, Phone, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { StatCard } from '@/components/shared/StatCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/utils'
import type { Volunteer } from '@/types'

export default function VolunteerProfile() {
  const { currentUser } = useAuth()
  const volunteer = currentUser as Volunteer
  const initials = `${volunteer.firstName[0]}${volunteer.lastName[0]}`

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-xl font-bold">
              {volunteer.firstName} {volunteer.lastName}
            </h2>
            <p className="text-sm text-muted-foreground capitalize">Volunteer</p>
            <Separator className="my-4" />
            <div className="w-full space-y-3 text-sm">
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
                <span>Member since {formatDate(volunteer.joinedDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={Wallet} label="Balance" value={`${volunteer.creditBalance} CR`} />
            <StatCard icon={Award} label="Tasks Completed" value={volunteer.tasksCompleted} />
            <StatCard icon={Wallet} label="Total Earned" value={`${volunteer.totalEarned} CR`} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Credit Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Spent</span>
                  <span>
                    {volunteer.totalSpent} / {volunteer.totalEarned} CR
                  </span>
                </div>
                <Progress
                  value={volunteer.totalEarned > 0 ? (volunteer.totalSpent / volunteer.totalEarned) * 100 : 0}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="text-2xl font-bold text-green-700">{volunteer.totalEarned}</p>
                  <p className="text-xs text-green-600">Total Earned</p>
                </div>
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-2xl font-bold text-red-700">{volunteer.totalSpent}</p>
                  <p className="text-xs text-red-600">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
