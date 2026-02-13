import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ListTodo } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TaskCard } from '@/components/shared/TaskCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useData } from '@/hooks/useData'
import { TaskStatus } from '@/types'
import { CATEGORY_CONFIG } from '@/lib/constants'
import { toast } from 'sonner'

export default function VolunteerTasks() {
  const { currentUser } = useAuth()
  const { tasks, signUpForTask, cancelTaskSignUp } = useData()
  const navigate = useNavigate()
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const userId = currentUser!.id

  const filterByCategory = (taskList: typeof tasks) =>
    categoryFilter === 'all' ? taskList : taskList.filter((t) => t.category === categoryFilter)

  const availableTasks = filterByCategory(
    tasks.filter((t) => t.status === TaskStatus.OPEN && !t.assignedVolunteerIds.includes(userId))
  )
  const myTasks = filterByCategory(
    tasks.filter((t) => t.assignedVolunteerIds.includes(userId) && t.status !== TaskStatus.COMPLETED)
  )
  const completedTasks = filterByCategory(
    tasks.filter((t) => t.assignedVolunteerIds.includes(userId) && t.status === TaskStatus.COMPLETED)
  )

  const handleSignUp = (taskId: string) => {
    signUpForTask(taskId, userId)
    toast.success('Signed up for task!')
  }

  const handleCancel = (taskId: string) => {
    cancelTaskSignUp(taskId, userId)
    toast.info('Cancelled task sign-up')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Tasks" description="Browse and sign up for volunteer tasks" />

      <div className="flex items-center gap-3">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">Available ({availableTasks.length})</TabsTrigger>
          <TabsTrigger value="my-tasks">My Tasks ({myTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-3 mt-4">
          {availableTasks.length === 0 ? (
            <EmptyState icon={ListTodo} title="No available tasks" description="Check back later for new volunteer opportunities." />
          ) : (
            availableTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                showSignUp
                onSignUp={() => handleSignUp(task.id)}
                onClick={() => navigate(`/volunteer/tasks/${task.id}`)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="my-tasks" className="space-y-3 mt-4">
          {myTasks.length === 0 ? (
            <EmptyState icon={ListTodo} title="No signed-up tasks" description="Browse available tasks and sign up!" />
          ) : (
            myTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                showSignUp
                isSignedUp
                onCancel={() => handleCancel(task.id)}
                onClick={() => navigate(`/volunteer/tasks/${task.id}`)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-4">
          {completedTasks.length === 0 ? (
            <EmptyState icon={ListTodo} title="No completed tasks" description="Your completed tasks will appear here." />
          ) : (
            completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={() => navigate(`/volunteer/tasks/${task.id}`)} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
