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
import { Separator } from '@/components/ui/separator'
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
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            SV
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">SV Oranje</span>
            <span className="text-xs text-muted-foreground">Tennis Club</span>
          </div>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{role === 'admin' ? 'Administration' : 'Menu'}</SidebarGroupLabel>
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
      <SidebarFooter className="p-4 space-y-2">
        <Separator />
        <div className="flex items-center gap-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium truncate">
              {currentUser.firstName} {currentUser.lastName}
            </span>
            <span className="text-xs text-muted-foreground capitalize">{role}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-xs"
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
            className="text-xs"
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
