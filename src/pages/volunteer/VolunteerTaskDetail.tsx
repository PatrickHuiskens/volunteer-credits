import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { CreditBadge } from '@/components/shared/CreditBadge'
import { useAuth } from '@/hooks/useAuth'
import { useData } from '@/hooks/useData'
import { CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib/constants'
import { formatDate, cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function VolunteerTaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { tasks, volunteers, signUpForTask, cancelTaskSignUp, joinWaitlist, leaveWaitlist } = useData()

  const task = tasks.find((t) => t.id === id)
  if (!task) return <div className="p-8 text-center">Task not found</div>

  const category = CATEGORY_CONFIG[task.category]
  const status = STATUS_CONFIG[task.status]
  const CategoryIcon = category.icon
  const isSignedUp = task.assignedVolunteerIds.includes(currentUser!.id)
  const isOnWaitlist = task.waitlistVolunteerIds.includes(currentUser!.id)
  const waitlistPosition = isOnWaitlist ? task.waitlistVolunteerIds.indexOf(currentUser!.id) + 1 : 0
  const spotsLeft = task.maxVolunteers - task.assignedVolunteerIds.length
  const assignedVols = volunteers.filter((v) => task.assignedVolunteerIds.includes(v.id))

  const handleSignUp = () => {
    signUpForTask(task.id, currentUser!.id)
    toast.success('Signed up for task!')
  }

  const handleCancel = () => {
    cancelTaskSignUp(task.id, currentUser!.id)
    toast.info('Cancelled task sign-up')
  }

  const handleJoinWaitlist = () => {
    joinWaitlist(task.id, currentUser!.id)
    toast.success('Joined the waitlist!')
  }

  const handleLeaveWaitlist = () => {
    leaveWaitlist(task.id, currentUser!.id)
    toast.info('Left the waitlist')
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className={cn(category.bgColor, category.color, 'border-0')}>
                  <CategoryIcon className="mr-1 h-3 w-3" />
                  {category.label}
                </Badge>
                <Badge variant="secondary" className={cn(status.bgColor, status.color, 'border-0')}>
                  {status.label}
                </Badge>
                <CreditBadge amount={task.creditReward} size="md" />
              </div>
              <h2 className="text-xl font-bold">{task.title}</h2>
              <p className="text-muted-foreground">{task.description}</p>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(task.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{task.startTime} — {task.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{task.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{spotsLeft} / {task.maxVolunteers} spots left</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-3">
              {isSignedUp ? (
                <Button variant="outline" className="w-full" onClick={handleCancel}>
                  Cancel Sign-up
                </Button>
              ) : isOnWaitlist ? (
                <>
                  <p className="text-sm text-center text-muted-foreground">
                    You're #{waitlistPosition} on the waitlist
                  </p>
                  <Button variant="outline" className="w-full" onClick={handleLeaveWaitlist}>
                    Leave Waitlist
                  </Button>
                </>
              ) : spotsLeft > 0 ? (
                <Button className="w-full" onClick={handleSignUp}>
                  Sign Up for Task
                </Button>
              ) : (
                <Button className="w-full" variant="secondary" onClick={handleJoinWaitlist}>
                  Join Waitlist
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Volunteers ({assignedVols.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignedVols.length === 0 ? (
                <p className="text-sm text-muted-foreground">No volunteers yet</p>
              ) : (
                assignedVols.map((v) => (
                  <div key={v.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {v.firstName[0]}
                        {v.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {v.firstName} {v.lastName}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
