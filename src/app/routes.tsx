import { Navigate, type RouteObject } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import LoginPage from '@/pages/auth/LoginPage'
import VolunteerDashboard from '@/pages/volunteer/VolunteerDashboard'
import VolunteerTasks from '@/pages/volunteer/VolunteerTasks'
import VolunteerTaskDetail from '@/pages/volunteer/VolunteerTaskDetail'
import CreditShop from '@/pages/volunteer/CreditShop'
import TransactionHistory from '@/pages/volunteer/TransactionHistory'
import VolunteerProfile from '@/pages/volunteer/VolunteerProfile'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminTasks from '@/pages/admin/AdminTasks'
import AdminTaskDetail from '@/pages/admin/AdminTaskDetail'
import AdminMembers from '@/pages/admin/AdminMembers'
import AdminMemberDetail from '@/pages/admin/AdminMemberDetail'
import AdminTransactions from '@/pages/admin/AdminTransactions'
import AdminSettings from '@/pages/admin/AdminSettings'
import Agenda from '@/pages/shared/Agenda'

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/volunteer',
    element: <AppLayout />,
    children: [
      { index: true, element: <VolunteerDashboard /> },
      { path: 'tasks', element: <VolunteerTasks /> },
      { path: 'tasks/:id', element: <VolunteerTaskDetail /> },
      { path: 'agenda', element: <Agenda /> },
      { path: 'shop', element: <CreditShop /> },
      { path: 'transactions', element: <TransactionHistory /> },
      { path: 'profile', element: <VolunteerProfile /> },
    ],
  },
  {
    path: '/admin',
    element: <AppLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'tasks', element: <AdminTasks /> },
      { path: 'tasks/:id', element: <AdminTaskDetail /> },
      { path: 'agenda', element: <Agenda /> },
      { path: 'members', element: <AdminMembers /> },
      { path: 'members/:id', element: <AdminMemberDetail /> },
      { path: 'transactions', element: <AdminTransactions /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]
