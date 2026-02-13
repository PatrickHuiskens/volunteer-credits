export enum TaskCategory {
  BAR = 'bar',
  CANTEEN = 'canteen',
  MAINTENANCE = 'maintenance',
  EVENTS = 'events',
  COACHING = 'coaching',
  ADMINISTRATION = 'administration',
}

export enum TaskStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TransactionType {
  EARNED = 'earned',
  SPENT = 'spent',
  ADJUSTMENT = 'adjustment',
}

export enum ShopItemCategory {
  MEMBERSHIP = 'membership',
  CANTEEN = 'canteen',
  FACILITY = 'facility',
  TRAINING = 'training',
  ACTIVITY = 'activity',
}

export type Role = 'volunteer' | 'admin'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: Role
  avatarUrl?: string
  joinedDate: string
}

export interface Volunteer extends User {
  role: 'volunteer'
  creditBalance: number
  totalEarned: number
  totalSpent: number
  tasksCompleted: number
}

export interface Admin extends User {
  role: 'admin'
}

export interface Task {
  id: string
  title: string
  description: string
  category: TaskCategory
  creditReward: number
  date: string
  startTime: string
  endTime: string
  location: string
  status: TaskStatus
  maxVolunteers: number
  assignedVolunteerIds: string[]
}

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  description: string
  date: string
  relatedId?: string
}

export interface ShopItem {
  id: string
  name: string
  description: string
  category: ShopItemCategory
  creditCost: number
  imageUrl?: string
  isAvailable: boolean
}

export interface Club {
  id: string
  name: string
  sportType: string
  creditName: string
  creditSymbol: string
  creditToEuroRatio: number
  stats: {
    totalMembers: number
    activeVolunteers: number
    totalCreditsIssued: number
    totalCreditsSpent: number
    tasksCompleted: number
    tasksOpen: number
  }
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  read: boolean
  date: string
  type: 'task' | 'credit' | 'shop' | 'system'
}
