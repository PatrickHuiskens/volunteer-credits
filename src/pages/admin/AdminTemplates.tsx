import { useState } from 'react'
import { Repeat, Trash2, Play, Copy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/shared/PageHeader'
import { CreditBadge } from '@/components/shared/CreditBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useData } from '@/hooks/useData'
import { CATEGORY_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { TaskTemplate } from '@/types'
import { toast } from 'sonner'

const RECURRENCE_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  none: 'One-time',
}

function getNextOccurrences(recurrence: string, count: number): string[] {
  const dates: string[] = []
  const today = new Date()
  // Start from next Monday
  const start = new Date(today)
  start.setDate(start.getDate() + ((8 - start.getDay()) % 7 || 7))

  let intervalDays = 7
  if (recurrence === 'biweekly') intervalDays = 14
  if (recurrence === 'monthly') intervalDays = 30

  for (let i = 0; i < count; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i * intervalDays)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export default function AdminTemplates() {
  const { taskTemplates, deleteTemplate, generateFromTemplate } = useData()
  const [generateOpen, setGenerateOpen] = useState<TaskTemplate | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedDates, setSelectedDates] = useState<string[]>([])

  const openGenerate = (template: TaskTemplate) => {
    const dates = getNextOccurrences(template.recurrence, 4)
    setSelectedDates(dates)
    setGenerateOpen(template)
  }

  const handleGenerate = () => {
    if (!generateOpen || selectedDates.length === 0) return
    generateFromTemplate(generateOpen.id, selectedDates)
    toast.success(`${selectedDates.length} task(s) created from template!`)
    setGenerateOpen(null)
    setSelectedDates([])
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteTemplate(deleteId)
      toast.success('Template deleted')
      setDeleteId(null)
    }
  }

  const toggleDate = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task Templates"
        description="Manage recurring task templates and generate tasks from them"
      />

      {taskTemplates.length === 0 ? (
        <EmptyState
          icon={Copy}
          title="No templates yet"
          description="Save a task as a template from the task editor to get started."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {taskTemplates.map((template) => {
            const cat = CATEGORY_CONFIG[template.category]
            const CatIcon = cat.icon
            return (
              <Card key={template.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant="secondary" className={cn(cat.bgColor, cat.color, 'border-0')}>
                      <CatIcon className="mr-1 h-3 w-3" />
                      {cat.label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Repeat className="mr-1 h-3 w-3" />
                      {RECURRENCE_LABELS[template.recurrence]}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{template.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{template.startTime} — {template.endTime}</span>
                    <CreditBadge amount={template.creditReward} size="sm" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {template.location} · Max {template.maxVolunteers} volunteers
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" className="flex-1" onClick={() => openGenerate(template)}>
                      <Play className="mr-1 h-3.5 w-3.5" />
                      Generate Tasks
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(template.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Generate Tasks Dialog */}
      <Dialog open={!!generateOpen} onOpenChange={(open) => !open && setGenerateOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Tasks from Template</DialogTitle>
          </DialogHeader>
          {generateOpen && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select dates to create tasks for "{generateOpen.title}":
              </p>
              <div className="space-y-2">
                {getNextOccurrences(generateOpen.recurrence, 4).map((date) => (
                  <Label key={date} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedDates.includes(date)}
                      onCheckedChange={() => toggleDate(date)}
                    />
                    <span className="text-sm">
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </Label>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateOpen(null)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={selectedDates.length === 0}>
              Generate {selectedDates.length} Task(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Template"
        description="Are you sure you want to delete this template? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
