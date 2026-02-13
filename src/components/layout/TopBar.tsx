import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Bell, LogOut, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'
import { useData } from '@/hooks/useData'
import { formatRelativeDate } from '@/lib/utils'

export function TopBar({ title }: { title: string }) {
  const { currentUser, role, logout, switchRole } = useAuth()
  const { notifications, markNotificationRead } = useData()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)

  if (!currentUser) return null

  const userNotifications = notifications.filter((n) => n.userId === currentUser.id)
  const unreadCount = userNotifications.filter((n) => !n.read).length
  const initials = `${currentUser.firstName[0]}${currentUser.lastName[0]}`

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <h1 className="text-lg font-semibold flex-1">{title}</h1>

      <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {userNotifications.length === 0 ? (
            <div className="p-4 text-sm text-center text-muted-foreground">No notifications</div>
          ) : (
            userNotifications.slice(0, 5).map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className="flex flex-col items-start gap-1 p-3"
                onClick={() => markNotificationRead(notif.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium text-sm">{notif.title}</span>
                  {!notif.read && <span className="h-2 w-2 rounded-full bg-primary ml-auto shrink-0" />}
                </div>
                <span className="text-xs text-muted-foreground">{notif.message}</span>
                <span className="text-xs text-muted-foreground">{formatRelativeDate(notif.date)}</span>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {currentUser.firstName} {currentUser.lastName}
            <span className="block text-xs font-normal text-muted-foreground capitalize">{role}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { switchRole(); navigate(role === 'admin' ? '/volunteer' : '/admin') }}>
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Switch to {role === 'admin' ? 'Volunteer' : 'Admin'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { logout(); navigate('/login') }}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
