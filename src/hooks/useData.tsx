import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Task, Transaction, ShopItem, Club, Volunteer, Notification, Availability, TaskTemplate, Announcement } from '@/types'
import { TransactionType, TaskStatus, type TimeSlot } from '@/types'
import { mockTasks } from '@/data/mock-tasks'
import { mockTransactions } from '@/data/mock-transactions'
import { mockShopItems } from '@/data/mock-shop-items'
import { mockClub } from '@/data/mock-club'
import { mockVolunteers } from '@/data/mock-users'
import { mockAvailability } from '@/data/mock-availability'
import { mockTemplates } from '@/data/mock-templates'
import { mockAnnouncements } from '@/data/mock-announcements'

interface DataContextType {
  tasks: Task[]
  transactions: Transaction[]
  shopItems: ShopItem[]
  club: Club
  volunteers: Volunteer[]
  notifications: Notification[]
  availability: Availability[]
  taskTemplates: TaskTemplate[]
  announcements: Announcement[]
  signUpForTask: (taskId: string, volunteerId: string) => void
  cancelTaskSignUp: (taskId: string, volunteerId: string) => void
  redeemShopItem: (itemId: string, userId: string) => void
  createTask: (task: Omit<Task, 'id'>) => void
  updateTask: (task: Task) => void
  deleteTask: (taskId: string) => void
  completeTask: (taskId: string) => void
  adjustCredits: (volunteerId: string, amount: number, description: string) => void
  updateClub: (club: Club) => void
  markNotificationRead: (notificationId: string) => void
  getUserTransactions: (userId: string) => Transaction[]
  getUserTasks: (userId: string) => Task[]
  // Availability
  toggleAvailability: (volunteerId: string, dayOfWeek: number, timeSlot: TimeSlot) => void
  getVolunteerAvailability: (volunteerId: string) => Availability[]
  getAvailableVolunteers: (dayOfWeek: number, timeSlot: TimeSlot) => string[]
  // Templates
  createTemplate: (template: Omit<TaskTemplate, 'id'>) => void
  deleteTemplate: (id: string) => void
  generateFromTemplate: (templateId: string, dates: string[]) => void
  // Announcements
  createAnnouncement: (announcement: Omit<Announcement, 'id'>) => void
  deleteAnnouncement: (id: string) => void
  togglePinAnnouncement: (id: string) => void
  // Waitlist
  joinWaitlist: (taskId: string, volunteerId: string) => void
  leaveWaitlist: (taskId: string, volunteerId: string) => void
}

const DataContext = createContext<DataContextType | null>(null)

const initialNotifications: Notification[] = [
  { id: 'notif-1', userId: 'vol-1', title: 'New task available', message: 'BBQ event — Meat grilling is now open for sign-ups!', read: false, date: '2026-02-13T10:00:00', type: 'task' },
  { id: 'notif-2', userId: 'vol-1', title: 'Credits earned', message: 'You earned 25 CR for Parking lot repairs', read: false, date: '2026-02-28T15:00:00', type: 'credit' },
  { id: 'notif-3', userId: 'vol-1', title: 'Shop item redeemed', message: 'Your Canteen Voucher (5x) is ready for pickup', read: true, date: '2026-02-27T12:00:00', type: 'shop' },
  { id: 'notif-4', userId: 'admin-1', title: 'Task completed', message: 'Parking lot repairs has been marked as completed', read: false, date: '2026-02-28T15:00:00', type: 'task' },
  { id: 'notif-5', userId: 'admin-1', title: 'New sign-up', message: 'Thomas van den Berg signed up for Bar duty — Saturday tournament', read: false, date: '2026-02-13T09:00:00', type: 'task' },
]

export function DataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [shopItems, setShopItems] = useState<ShopItem[]>(mockShopItems)
  const [club, setClub] = useState<Club>(mockClub)
  const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [availability, setAvailability] = useState<Availability[]>(mockAvailability)
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>(mockTemplates)
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)

  const signUpForTask = useCallback((taskId: string, volunteerId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId && !t.assignedVolunteerIds.includes(volunteerId) && t.assignedVolunteerIds.length < t.maxVolunteers
          ? { ...t, assignedVolunteerIds: [...t.assignedVolunteerIds, volunteerId] }
          : t
      )
    )
  }, [])

  const cancelTaskSignUp = useCallback((taskId: string, volunteerId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        const newAssigned = t.assignedVolunteerIds.filter((id) => id !== volunteerId)
        // Auto-fill from waitlist if someone cancels and there's a waitlisted volunteer
        if (t.waitlistVolunteerIds.length > 0 && newAssigned.length < t.maxVolunteers) {
          const [promoted, ...remainingWaitlist] = t.waitlistVolunteerIds
          // Create notification for the promoted volunteer
          setNotifications((nPrev) => [
            ...nPrev,
            {
              id: `notif-${Date.now()}`,
              userId: promoted,
              title: 'Waitlist promotion',
              message: `You have been assigned to "${t.title}" from the waitlist!`,
              read: false,
              date: new Date().toISOString(),
              type: 'task',
            },
          ])
          return {
            ...t,
            assignedVolunteerIds: [...newAssigned, promoted],
            waitlistVolunteerIds: remainingWaitlist,
          }
        }
        return { ...t, assignedVolunteerIds: newAssigned }
      })
    )
  }, [])

  const redeemShopItem = useCallback((itemId: string, userId: string) => {
    const item = shopItems.find((i) => i.id === itemId)
    if (!item) return

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId,
      type: TransactionType.SPENT,
      amount: item.creditCost,
      description: item.name,
      date: new Date().toISOString().split('T')[0],
      relatedId: itemId,
    }
    setTransactions((prev) => [newTx, ...prev])
    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === userId
          ? { ...v, creditBalance: v.creditBalance - item.creditCost, totalSpent: v.totalSpent + item.creditCost }
          : v
      )
    )
  }, [shopItems])

  const createTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: `task-${Date.now()}` }
    setTasks((prev) => [newTask, ...prev])
  }, [])

  const updateTask = useCallback((task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }, [])

  const completeTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId)
      if (!task) return prev
      // Award credits to all assigned volunteers
      const newTxs: Transaction[] = task.assignedVolunteerIds.map((vid) => ({
        id: `tx-${Date.now()}-${vid}`,
        userId: vid,
        type: TransactionType.EARNED,
        amount: task.creditReward,
        description: task.title,
        date: new Date().toISOString().split('T')[0],
        relatedId: taskId,
      }))
      setTransactions((txPrev) => [...newTxs, ...txPrev])
      setVolunteers((vPrev) =>
        vPrev.map((v) =>
          task.assignedVolunteerIds.includes(v.id)
            ? {
                ...v,
                creditBalance: v.creditBalance + task.creditReward,
                totalEarned: v.totalEarned + task.creditReward,
                tasksCompleted: v.tasksCompleted + 1,
              }
            : v
        )
      )
      return prev.map((t) => (t.id === taskId ? { ...t, status: TaskStatus.COMPLETED } : t))
    })
  }, [])

  const adjustCredits = useCallback((volunteerId: string, amount: number, description: string) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: volunteerId,
      type: amount >= 0 ? TransactionType.ADJUSTMENT : TransactionType.SPENT,
      amount: Math.abs(amount),
      description,
      date: new Date().toISOString().split('T')[0],
    }
    setTransactions((prev) => [newTx, ...prev])
    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === volunteerId
          ? {
              ...v,
              creditBalance: v.creditBalance + amount,
              ...(amount >= 0 ? { totalEarned: v.totalEarned + amount } : { totalSpent: v.totalSpent + Math.abs(amount) }),
            }
          : v
      )
    )
  }, [])

  const updateClub = useCallback((updatedClub: Club) => {
    setClub(updatedClub)
  }, [])

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    )
  }, [])

  const getUserTransactions = useCallback(
    (userId: string) => transactions.filter((t) => t.userId === userId),
    [transactions]
  )

  const getUserTasks = useCallback(
    (userId: string) => tasks.filter((t) => t.assignedVolunteerIds.includes(userId)),
    [tasks]
  )

  // Availability
  const toggleAvailability = useCallback((volunteerId: string, dayOfWeek: number, timeSlot: TimeSlot) => {
    setAvailability((prev) => {
      const existing = prev.find(
        (a) => a.volunteerId === volunteerId && a.dayOfWeek === dayOfWeek && a.timeSlot === timeSlot
      )
      if (existing) {
        return prev.filter((a) => a.id !== existing.id)
      }
      return [...prev, { id: `avail-${Date.now()}`, volunteerId, dayOfWeek, timeSlot }]
    })
  }, [])

  const getVolunteerAvailability = useCallback(
    (volunteerId: string) => availability.filter((a) => a.volunteerId === volunteerId),
    [availability]
  )

  const getAvailableVolunteers = useCallback(
    (dayOfWeek: number, timeSlot: TimeSlot) =>
      availability.filter((a) => a.dayOfWeek === dayOfWeek && a.timeSlot === timeSlot).map((a) => a.volunteerId),
    [availability]
  )

  // Templates
  const createTemplate = useCallback((template: Omit<TaskTemplate, 'id'>) => {
    setTaskTemplates((prev) => [...prev, { ...template, id: `tmpl-${Date.now()}` }])
  }, [])

  const deleteTemplate = useCallback((id: string) => {
    setTaskTemplates((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const generateFromTemplate = useCallback((templateId: string, dates: string[]) => {
    setTaskTemplates((prev) => {
      const template = prev.find((t) => t.id === templateId)
      if (!template) return prev
      const newTasks: Task[] = dates.map((date) => ({
        id: `task-${Date.now()}-${date}`,
        title: template.title,
        description: template.description,
        category: template.category,
        creditReward: template.creditReward,
        date,
        startTime: template.startTime,
        endTime: template.endTime,
        location: template.location,
        status: TaskStatus.OPEN,
        maxVolunteers: template.maxVolunteers,
        assignedVolunteerIds: [],
        waitlistVolunteerIds: [],
      }))
      setTasks((tPrev) => [...newTasks, ...tPrev])
      return prev
    })
  }, [])

  // Announcements
  const createAnnouncement = useCallback((announcement: Omit<Announcement, 'id'>) => {
    setAnnouncements((prev) => [{ ...announcement, id: `ann-${Date.now()}` }, ...prev])
  }, [])

  const deleteAnnouncement = useCallback((id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const togglePinAnnouncement = useCallback((id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    )
  }, [])

  // Waitlist
  const joinWaitlist = useCallback((taskId: string, volunteerId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId &&
        !t.waitlistVolunteerIds.includes(volunteerId) &&
        !t.assignedVolunteerIds.includes(volunteerId)
          ? { ...t, waitlistVolunteerIds: [...t.waitlistVolunteerIds, volunteerId] }
          : t
      )
    )
  }, [])

  const leaveWaitlist = useCallback((taskId: string, volunteerId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, waitlistVolunteerIds: t.waitlistVolunteerIds.filter((id) => id !== volunteerId) }
          : t
      )
    )
  }, [])

  return (
    <DataContext.Provider
      value={{
        tasks,
        transactions,
        shopItems,
        club,
        volunteers,
        notifications,
        availability,
        taskTemplates,
        announcements,
        signUpForTask,
        cancelTaskSignUp,
        redeemShopItem,
        createTask,
        updateTask,
        deleteTask,
        completeTask,
        adjustCredits,
        updateClub,
        markNotificationRead,
        getUserTransactions,
        getUserTasks,
        toggleAvailability,
        getVolunteerAvailability,
        getAvailableVolunteers,
        createTemplate,
        deleteTemplate,
        generateFromTemplate,
        createAnnouncement,
        deleteAnnouncement,
        togglePinAnnouncement,
        joinWaitlist,
        leaveWaitlist,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
