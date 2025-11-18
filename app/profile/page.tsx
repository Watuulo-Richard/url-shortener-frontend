'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStoreValue } from '@simplestack/store/react'
import { userStore, signout, isLoadingStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function ProfilePage() {
  const router = useRouter()
  const user = useStoreValue(userStore)
  const loading = useStoreValue(isLoadingStore)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{'Loading...'}</p>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">{'LinkShort'}</h1>
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            {'Back to Dashboard'}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{'Profile'}</CardTitle>
            <CardDescription>{'Manage your account information'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={user.name} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <div>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input value={new Date(user.createdAt).toLocaleDateString()} disabled />
            </div>
            <div className="pt-4 border-t border-border">
              <Button variant="destructive" onClick={handleSignOut}>
                {'Sign out'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
