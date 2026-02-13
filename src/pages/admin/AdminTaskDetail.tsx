import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Calendar, Clock, MapPin, Users, UserPlus, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { CreditBadge } from '@/components/shared/CreditBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useData } from '@/hooks/useData'
import { CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib/constants'
import { formatDate, cn } from '@/lib/utils'
import { TaskStatus, type TimeSlot } from '@/types'
import { toast } from 'sonner'

function getTimeSlotFromHour(time: string): TimeSlot {
  const hour = parseInt(time.split(':')[0], 10)
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

function getDayOfWeek(dateStr: string): number {
  const date = new Date(dateStr)
  // JS getDay: 0=Sun, we want 0=Mon
  const day = date.getDay()
  return day === 0 ? 6 : day - 1
}

export default function AdminTaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tasks, volunteers, signUpForTask, cancelTaskSignUp, completeTask, getAvailableVolunteers } = useData()
  const [assignOpen, setAssignOpen] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [selectedVol, setSelectedVol] = useState('')

  const task = tasks.find((t) => t.id === id)
  if (!task) return <div className="p-8 text-center">Task not found</div>

  const category = CATEGORY_CONFIG[task.category]
  const status = STATUS_CONFIG[task.status]
  const CategoryIcon = category.icon
  const assignedVols = volunteers.filter((v) => task.assignedVolunteerIds.includes(v.id))
  const waitlistedVols = volunteers.filter((v) => task.waitlistVolunteerIds.includes(v.id))
  const availableVols = volunteers.filter((v) => !task.assignedVolunteerIds.includes(v.id))
  const spotsLeft = task.maxVolunteers - task.assignedVolunteerIds.length

  // Compute availability for this task's day/time
  const taskDayOfWeek = getDayOfWeek(task.date)
  const taskTimeSlot = getTimeSlotFromHour(task.startTime)
  const availableVolIds = useMemo(
    () => getAvailableVolunteers(taskDayOfWeek, taskTimeSlot),
    [getAvailableVolunteers, taskDayOfWeek, taskTimeSlot]
  )

  const handleAssign = () => {
    if (!selectedVol) return
    signUpForTask(task.id, selectedVol)
    toast.success('Volunteer assigned!')
    setAssignOpen(false)
    setSelectedVol('')
  }

  const handleComplete = () => {
    completeTask(task.id)
    toast.success(`Task completed! ${task.creditReward} CR awarded to ${assignedVols.length} volunteer(s)`)
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
                  <span>
                    {task.startTime} — {task.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{task.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {spotsLeft} / {task.maxVolunteers} spots left
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-3">
              {task.status !== TaskStatus.COMPLETED && task.status !== TaskStatus.CANCELLED && (
                <>
                  <Button
                    className="w-full"
                    onClick={() => setCompleteOpen(true)}
                    disabled={assignedVols.length === 0}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Complete
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setAssignOpen(true)}
                    disabled={spotsLeft === 0}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign Volunteer
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assigned Volunteers ({assignedVols.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignedVols.length === 0 ? (
                <p className="text-sm text-muted-foreground">No volunteers assigned</p>
              ) : (
                assignedVols.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 cursor-pointer rounded-lg p-2 -mx-2 hover:bg-muted/50 transition-colors" onClick={() => navigate(`/admin/members/${v.id}`)}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {v.firstName[0]}
                        {v.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {v.firstName} {v.lastName}
                      </p>
                    </div>
                    {task.status !== TaskStatus.COMPLETED && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          cancelTaskSignUp(task.id, v.id)
                          toast.info('Volunteer removed')
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Waitlist Section */}
          {waitlistedVols.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Waitlist ({waitlistedVols.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {waitlistedVols.map((v, idx) => (
                  <div key={v.id} className="flex items-center gap-3 rounded-lg p-2 -mx-2">
                    <span className="text-xs font-bold text-muted-foreground w-4">#{idx + 1}</span>
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
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Volunteer</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Select Volunteer</Label>
            <Select value={selectedVol} onValueChange={setSelectedVol}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a volunteer..." />
              </SelectTrigger>
              <SelectContent>
                {availableVols.map((v) => {
                  const isAvailable = availableVolIds.includes(v.id)
                  return (
                    <SelectItem key={v.id} value={v.id}>
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            'h-2 w-2 rounded-full shrink-0',
                            isAvailable ? 'bg-green-500' : 'bg-gray-300'
                          )}
                        />
                        {v.firstName} {v.lastName}
                      </span>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Green dot = available on this day/time
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedVol}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={completeOpen}
        onOpenChange={setCompleteOpen}
        title="Complete Task"
        description={`Mark this task as completed? ${task.creditReward} CR will be awarded to each of the ${assignedVols.length} assigned volunteer(s).`}
        confirmLabel="Complete Task"
        onConfirm={handleComplete}
      />
    </div>
  )
}
