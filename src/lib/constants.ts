import {
  Beer,
  UtensilsCrossed,
  Wrench,
  PartyPopper,
  GraduationCap,
  ClipboardList,
  LayoutDashboard,
  ListTodo,
  ShoppingBag,
  Receipt,
  UserCircle,
  Users,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { TaskCategory, TaskStatus, ShopItemCategory } from '@/types'

export const CATEGORY_CONFIG: Record<
  TaskCategory,
  { label: string; color: string; bgColor: string; icon: LucideIcon }
> = {
  [TaskCategory.BAR]: {
    label: 'Bar',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    icon: Beer,
  },
  [TaskCategory.CANTEEN]: {
    label: 'Canteen',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: UtensilsCrossed,
  },
  [TaskCategory.MAINTENANCE]: {
    label: 'Maintenance',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: Wrench,
  },
  [TaskCategory.EVENTS]: {
    label: 'Events',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: PartyPopper,
  },
  [TaskCategory.COACHING]: {
    label: 'Coaching',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: GraduationCap,
  },
  [TaskCategory.ADMINISTRATION]: {
    label: 'Administration',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    icon: ClipboardList,
  },
}

export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bgColor: string }
> = {
  [TaskStatus.OPEN]: {
    label: 'Open',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  [TaskStatus.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  [TaskStatus.COMPLETED]: {
    label: 'Completed',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
  },
  [TaskStatus.CANCELLED]: {
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
}

export const SHOP_CATEGORY_CONFIG: Record<
  ShopItemCategory,
  { label: string; color: string; bgColor: string }
> = {
  [ShopItemCategory.MEMBERSHIP]: {
    label: 'Membership',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
  },
  [ShopItemCategory.CANTEEN]: {
    label: 'Canteen',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
  },
  [ShopItemCategory.FACILITY]: {
    label: 'Facility',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  [ShopItemCategory.TRAINING]: {
    label: 'Training',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  [ShopItemCategory.ACTIVITY]: {
    label: 'Activity',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
  },
}

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
}

export const VOLUNTEER_NAV: NavItem[] = [
  { title: 'Dashboard', url: '/volunteer', icon: LayoutDashboard },
  { title: 'Tasks', url: '/volunteer/tasks', icon: ListTodo },
  { title: 'Shop', url: '/volunteer/shop', icon: ShoppingBag },
  { title: 'Transactions', url: '/volunteer/transactions', icon: Receipt },
  { title: 'Profile', url: '/volunteer/profile', icon: UserCircle },
]

export const ADMIN_NAV: NavItem[] = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Tasks', url: '/admin/tasks', icon: ListTodo },
  { title: 'Members', url: '/admin/members', icon: Users },
  { title: 'Transactions', url: '/admin/transactions', icon: Receipt },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
]
