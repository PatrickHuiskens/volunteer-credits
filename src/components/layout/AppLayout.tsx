import { Outlet, useLocation } from 'react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { TopBar } from './TopBar'
import { Toaster } from '@/components/ui/sonner'

const PAGE_TITLES: Record<string, string> = {
  '/volunteer': 'Dashboard',
  '/volunteer/tasks': 'Tasks',
  '/volunteer/shop': 'Credit Shop',
  '/volunteer/transactions': 'Transactions',
  '/volunteer/availability': 'My Availability',
  '/volunteer/profile': 'My Profile',
  '/admin': 'Dashboard',
  '/admin/tasks': 'Task Management',
  '/admin/templates': 'Task Templates',
  '/admin/members': 'Members',
  '/admin/transactions': 'Transactions',
  '/admin/settings': 'Settings',
}

export function AppLayout() {
  const location = useLocation()
  const basePath = '/' + location.pathname.split('/').slice(1, 3).join('/')
  const title = PAGE_TITLES[basePath] || PAGE_TITLES[location.pathname] || 'SV Oranje'

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <TopBar title={title} />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster richColors position="bottom-right" />
    </SidebarProvider>
  )
}
