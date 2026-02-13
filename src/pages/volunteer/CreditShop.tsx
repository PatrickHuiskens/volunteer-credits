import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditBadge } from '@/components/shared/CreditBadge'
import { PageHeader } from '@/components/shared/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useData } from '@/hooks/useData'
import { ShopItemCategory, type ShopItem, type Volunteer } from '@/types'
import { SHOP_CATEGORY_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function CreditShop() {
  const { currentUser } = useAuth()
  const { shopItems, redeemShopItem } = useData()
  const [confirmItem, setConfirmItem] = useState<ShopItem | null>(null)
  const volunteer = currentUser as Volunteer

  const categories = ['all', ...Object.values(ShopItemCategory)] as const

  const handleRedeem = () => {
    if (!confirmItem) return
    if (volunteer.creditBalance < confirmItem.creditCost) {
      toast.error('Not enough credits')
      return
    }
    redeemShopItem(confirmItem.id, volunteer.id)
    toast.success(`Redeemed: ${confirmItem.name}`)
    setConfirmItem(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Credit Shop" description={`Your balance: ${volunteer.creditBalance} CR`} />

      <Tabs defaultValue="all">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All</TabsTrigger>
          {Object.entries(SHOP_CATEGORY_CONFIG).map(([key, config]) => (
            <TabsTrigger key={key} value={key}>
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-4">
            {(() => {
              const items = cat === 'all' ? shopItems : shopItems.filter((i) => i.category === cat)
              if (items.length === 0) {
                return (
                  <EmptyState icon={ShoppingBag} title="No items" description="No items available in this category." />
                )
              }
              return (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => {
                    const catConfig = SHOP_CATEGORY_CONFIG[item.category]
                    const canAfford = volunteer.creditBalance >= item.creditCost
                    return (
                      <Card
                        key={item.id}
                        className={cn('transition-shadow hover:shadow-md', !item.isAvailable && 'opacity-60')}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className={cn(catConfig.bgColor, catConfig.color, 'border-0')}>
                              {catConfig.label}
                            </Badge>
                            <CreditBadge amount={item.creditCost} />
                          </div>
                          <CardTitle className="text-base">{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full"
                            disabled={!item.isAvailable || !canAfford}
                            onClick={() => setConfirmItem(item)}
                          >
                            {!item.isAvailable ? 'Unavailable' : !canAfford ? 'Not enough credits' : 'Redeem'}
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              )
            })()}
          </TabsContent>
        ))}
      </Tabs>

      <ConfirmDialog
        open={!!confirmItem}
        onOpenChange={(open) => !open && setConfirmItem(null)}
        title="Redeem Item"
        description={
          confirmItem
            ? `Redeem "${confirmItem.name}" for ${confirmItem.creditCost} CR? Your new balance will be ${volunteer.creditBalance - confirmItem.creditCost} CR.`
            : ''
        }
        confirmLabel="Redeem"
        onConfirm={handleRedeem}
      />
    </div>
  )
}
