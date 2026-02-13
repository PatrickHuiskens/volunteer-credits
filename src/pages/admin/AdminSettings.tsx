import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/shared/PageHeader'
import { useData } from '@/hooks/useData'
import { toast } from 'sonner'

export default function AdminSettings() {
  const { club, updateClub } = useData()
  const [form, setForm] = useState({
    name: club.name,
    sportType: club.sportType,
    creditName: club.creditName,
    creditSymbol: club.creditSymbol,
    creditToEuroRatio: club.creditToEuroRatio,
  })
  const [notifications, setNotifications] = useState({
    taskSignUp: true,
    taskComplete: true,
    shopRedeem: true,
    weeklyReport: false,
  })

  const handleSave = () => {
    updateClub({
      ...club,
      name: form.name,
      sportType: form.sportType,
      creditName: form.creditName,
      creditSymbol: form.creditSymbol,
      creditToEuroRatio: form.creditToEuroRatio,
    })
    toast.success('Settings saved!')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure club and platform settings" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Club Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Club Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Sport Type</Label>
              <Input
                value={form.sportType}
                onChange={(e) => setForm({ ...form, sportType: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Credit Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Credit Name</Label>
              <Input
                value={form.creditName}
                onChange={(e) => setForm({ ...form, creditName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Credit Symbol</Label>
              <Input
                value={form.creditSymbol}
                onChange={(e) => setForm({ ...form, creditSymbol: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Credit to Euro Ratio</Label>
              <Input
                type="number"
                step="0.1"
                value={form.creditToEuroRatio}
                onChange={(e) => setForm({ ...form, creditToEuroRatio: Number(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                1 credit = €{form.creditToEuroRatio.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Task Sign-ups</Label>
                <p className="text-xs text-muted-foreground">
                  Notify when a volunteer signs up for a task
                </p>
              </div>
              <Switch
                checked={notifications.taskSignUp}
                onCheckedChange={(v) => setNotifications({ ...notifications, taskSignUp: v })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Task Completion</Label>
                <p className="text-xs text-muted-foreground">Notify when a task is marked complete</p>
              </div>
              <Switch
                checked={notifications.taskComplete}
                onCheckedChange={(v) => setNotifications({ ...notifications, taskComplete: v })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Shop Redemptions</Label>
                <p className="text-xs text-muted-foreground">
                  Notify when a volunteer redeems a shop item
                </p>
              </div>
              <Switch
                checked={notifications.shopRedeem}
                onCheckedChange={(v) => setNotifications({ ...notifications, shopRedeem: v })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Report</Label>
                <p className="text-xs text-muted-foreground">Receive a weekly summary email</p>
              </div>
              <Switch
                checked={notifications.weeklyReport}
                onCheckedChange={(v) => setNotifications({ ...notifications, weeklyReport: v })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  )
}
