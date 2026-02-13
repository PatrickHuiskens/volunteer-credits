import { useLocation, useNavigate } from 'react-router'
import { ArrowLeftRight, LogOut } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { VOLUNTEER_NAV, ADMIN_NAV } from '@/lib/constants'

export function AppSidebar() {
  const { currentUser, role, logout, switchRole } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = role === 'admin' ? ADMIN_NAV : VOLUNTEER_NAV

  if (!currentUser) return null

  const initials = `${currentUser.firstName[0]}${currentUser.lastName[0]}`

  return (
    <Sidebar>
      <SidebarHeader className="p-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 opacity-90" />
            <div className="absolute inset-[3px] rounded-full bg-sidebar" />
            <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">SV Oranje</span>
            <span className="text-xs text-sidebar-foreground/50">Volunteer Credits</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[10px] tracking-wider font-medium">
            {role === 'admin' ? 'Administration' : 'Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.url}
                    onClick={() => navigate(item.url)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-3">
        <div className="h-px bg-sidebar-border" />
        <div className="flex items-center gap-3 py-1">
          <Avatar className="h-8 w-8 border border-sidebar-border">
            <AvatarFallback className="text-xs bg-sidebar-accent text-sidebar-accent-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium truncate">
              {currentUser.firstName} {currentUser.lastName}
            </span>
            <span className="text-xs text-sidebar-foreground/50 capitalize">{role}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => {
              switchRole()
              navigate(role === 'admin' ? '/volunteer' : '/admin')
            }}
          >
            <ArrowLeftRight className="mr-1 h-3 w-3" />
            Switch Role
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            <LogOut className="h-3 w-3" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
