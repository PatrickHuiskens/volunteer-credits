import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import type { Role } from '@/types'

export default function LoginPage() {
  const { login, volunteers, admins } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('volunteer')
  const [userId, setUserId] = useState('')

  const users = role === 'admin' ? admins : volunteers

  const handleLogin = () => {
    if (!userId) return
    login(userId)
    navigate(role === 'admin' ? '/admin' : '/volunteer')
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="relative mx-auto h-16 w-16 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600" />
            <div className="absolute inset-[4px] rounded-full bg-slate-900" />
            <div className="absolute inset-[8px] rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SV Oranje</h1>
          <p className="text-sm text-slate-400 mt-1">Volunteer Credit Platform</p>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">Sign in to your account</CardTitle>
            <CardDescription>Select a role and user to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Role</Label>
              <Select value={role} onValueChange={(v: Role) => { setRole(v); setUserId('') }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="admin">Club Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">User</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.firstName} {u.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleLogin} disabled={!userId}>
              Continue
            </Button>
            <p className="text-center text-xs text-muted-foreground pt-1">
              This is a demo — no real authentication is performed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
