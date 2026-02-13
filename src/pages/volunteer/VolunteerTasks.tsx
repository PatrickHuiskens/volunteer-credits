import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ListTodo, Search } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
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
  const { tasks, signUpForTask, cancelTaskSignUp, joinWaitlist, leaveWaitlist } = useData()
  const navigate = useNavigate()
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const userId = currentUser!.id

  const filterByCategory = (taskList: typeof tasks) =>
    categoryFilter === 'all' ? taskList : taskList.filter((t) => t.category === categoryFilter)

  const filterBySearch = (taskList: typeof tasks) =>
    search === '' ? taskList : taskList.filter((t) =>
      `${t.title} ${t.description} ${t.location}`.toLowerCase().includes(search.toLowerCase())
    )

  const applyFilters = (taskList: typeof tasks) => filterBySearch(filterByCategory(taskList))

  const availableTasks = applyFilters(
    tasks.filter((t) => t.status === TaskStatus.OPEN && !t.assignedVolunteerIds.includes(userId))
  )
  const myTasks = applyFilters(
    tasks.filter((t) => t.assignedVolunteerIds.includes(userId) && t.status !== TaskStatus.COMPLETED)
  )
  const completedTasks = applyFilters(
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

  const handleJoinWaitlist = (taskId: string) => {
    joinWaitlist(taskId, userId)
    toast.success('Joined the waitlist!')
  }

  const handleLeaveWaitlist = (taskId: string) => {
    leaveWaitlist(taskId, userId)
    toast.info('Left the waitlist')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Tasks" description="Browse and sign up for volunteer tasks" />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
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
            availableTasks.map((task) => {
              const isOnWaitlist = task.waitlistVolunteerIds.includes(userId)
              const waitlistPosition = isOnWaitlist ? task.waitlistVolunteerIds.indexOf(userId) + 1 : 0
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  showSignUp
                  isOnWaitlist={isOnWaitlist}
                  waitlistPosition={waitlistPosition}
                  onSignUp={() => handleSignUp(task.id)}
                  onJoinWaitlist={() => handleJoinWaitlist(task.id)}
                  onLeaveWaitlist={() => handleLeaveWaitlist(task.id)}
                  onClick={() => navigate(`/volunteer/tasks/${task.id}`)}
                />
              )
            })
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
