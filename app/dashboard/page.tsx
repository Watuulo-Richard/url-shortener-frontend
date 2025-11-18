'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStoreValue } from '@simplestack/store/react'
import { userStore, tokenStore, isLoadingStore } from '@/lib/auth-store'
import { linksApi, Link } from '@/lib/api'
import { DashboardHeader } from '@/components/dashboard-header'
import { LinkItem } from '@/components/link-item'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function DashboardPage() {
  const router = useRouter()
  const user = useStoreValue(userStore)
  const token = useStoreValue(tokenStore)
  const authLoading = useStoreValue(isLoadingStore)
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (token) {
      loadLinks()
    }
  }, [token])

  const loadLinks = async () => {
    if (!token) return
    
    try {
      const data = await linksApi.getLinks(token)
      setLinks(data)
    } catch (error) {
      console.error('[v0] Failed to load links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    if (!token) return
    
    await linksApi.deleteLink(token, linkId)
    setLinks(links.filter(link => link.id !== linkId))
  }

  const filteredLinks = links.filter(link =>
    link.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">{'Loading...'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">{'Links'}</h1>
              <p className="text-muted-foreground">
                {'Manage and track all your shortened links'}
              </p>
            </div>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => router.push('/dashboard/new')}
            >
              <Plus className="w-4 h-4" />
              {'Create link'}
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by short link or URL"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {'Filter'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>{'All links'}</DropdownMenuItem>
                  <DropdownMenuItem>{'Most clicks'}</DropdownMenuItem>
                  <DropdownMenuItem>{'Least clicks'}</DropdownMenuItem>
                  <DropdownMenuItem>{'Newest first'}</DropdownMenuItem>
                  <DropdownMenuItem>{'Oldest first'}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {'Display'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>{'Compact view'}</DropdownMenuItem>
                  <DropdownMenuItem>{'Detailed view'}</DropdownMenuItem>
                  <DropdownMenuItem>{'Grid view'}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Links List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{'Loading links...'}</p>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No links match your search' : 'No links yet'}
              </p>
              {!searchQuery && (
                <Button onClick={() => router.push('/dashboard/new')}>
                  {'Create your first link'}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLinks.map(link => (
                <LinkItem
                  key={link.id}
                  link={link}
                  onDelete={handleDeleteLink}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
