import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Pencil, Trash2, ListTodo } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/shared/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { CreditBadge } from '@/components/shared/CreditBadge'
import { useData } from '@/hooks/useData'
import { TaskCategory, TaskStatus, type Task } from '@/types'
import { CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib/constants'
import { formatDate, cn } from '@/lib/utils'
import { toast } from 'sonner'

const defaultTask = {
  title: '',
  description: '',
  category: TaskCategory.BAR,
  creditReward: 10,
  date: '',
  startTime: '09:00',
  endTime: '17:00',
  location: '',
  status: TaskStatus.OPEN,
  maxVolunteers: 3,
  assignedVolunteerIds: [] as string[],
}

export default function AdminTasks() {
  const { tasks, createTask, updateTask, deleteTask } = useData()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [editTask, setEditTask] = useState<Partial<Task> | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isNew, setIsNew] = useState(false)

  const filtered = tasks
    .filter((t) => statusFilter === 'all' || t.status === statusFilter)
    .filter((t) => categoryFilter === 'all' || t.category === categoryFilter)

  const openDialog = (task?: Task) => {
    if (task) {
      setEditTask({ ...task })
      setIsNew(false)
    } else {
      setEditTask({ ...defaultTask })
      setIsNew(true)
    }
  }

  const handleSave = () => {
    if (!editTask?.title || !editTask.date) {
      toast.error('Please fill in required fields')
      return
    }
    if (isNew) {
      createTask(editTask as Omit<Task, 'id'>)
      toast.success('Task created!')
    } else {
      updateTask(editTask as Task)
      toast.success('Task updated!')
    }
    setEditTask(null)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteTask(deleteId)
      toast.success('Task deleted')
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task Management"
        description="Create and manage volunteer tasks"
        actionLabel="Create Task"
        actionIcon={Plus}
        onAction={() => openDialog()}
      />

      <div className="flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks found"
          description="Try adjusting your filters or create a new task."
          actionLabel="Create Task"
          onAction={() => openDialog()}
        />
      ) : (
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Volunteers</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((task) => {
                const cat = CATEGORY_CONFIG[task.category]
                const status = STATUS_CONFIG[task.status]
                return (
                  <TableRow
                    key={task.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/admin/tasks/${task.id}`)}
                  >
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn(cat.bgColor, cat.color, 'border-0')}>
                        {cat.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(task.date)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn(status.bgColor, status.color, 'border-0')}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {task.assignedVolunteerIds.length}/{task.maxVolunteers}
                    </TableCell>
                    <TableCell>
                      <CreditBadge amount={task.creditReward} size="sm" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => openDialog(task)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(task.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!editTask} onOpenChange={(open) => !open && setEditTask(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isNew ? 'Create Task' : 'Edit Task'}</DialogTitle>
          </DialogHeader>
          {editTask && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={editTask.title ?? ''}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editTask.description ?? ''}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={editTask.category}
                    onValueChange={(v) => setEditTask({ ...editTask, category: v as TaskCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Credit Reward</Label>
                  <Input
                    type="number"
                    value={editTask.creditReward ?? 10}
                    onChange={(e) => setEditTask({ ...editTask, creditReward: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={editTask.date ?? ''}
                    onChange={(e) => setEditTask({ ...editTask, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={editTask.startTime ?? '09:00'}
                    onChange={(e) => setEditTask({ ...editTask, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={editTask.endTime ?? '17:00'}
                    onChange={(e) => setEditTask({ ...editTask, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={editTask.location ?? ''}
                    onChange={(e) => setEditTask({ ...editTask, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Volunteers</Label>
                  <Input
                    type="number"
                    value={editTask.maxVolunteers ?? 3}
                    onChange={(e) => setEditTask({ ...editTask, maxVolunteers: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTask(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{isNew ? 'Create' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
