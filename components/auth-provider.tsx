'use client'

import { useEffect, useState } from 'react'
import { checkAuth } from '@/lib/auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    async function verifySession() {
      try {
        await checkAuth()
      } finally {
        setIsCheckingAuth(false)
      }
    }

    verifySession()
  }, [])

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
