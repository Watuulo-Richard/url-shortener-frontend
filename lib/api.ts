export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface Link {
  id: string
  shortCode: string
  originalUrl: string
  clicks: number
  createdAt: string
  userId: string
  favicon?: string
}

// Mock delay to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Auth API calls
export const authApi = {
  async signup(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    await delay(1000)
    
    // TODO: Replace with actual API call
    // const response = await fetch('YOUR_GOLANG_API/auth/signup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password, name })
    // })
    // return response.json()
    
    return {
      user: {
        id: '1',
        email,
        name,
        role: 'user',
        createdAt: new Date().toISOString()
      },
      token: 'mock_jwt_token_' + Date.now()
    }
  },

  async signin(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(1000)
    
    // TODO: Replace with actual API call
    // const response = await fetch('YOUR_GOLANG_API/auth/signin', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // })
    // return response.json()
    
    return {
      user: {
        id: '1',
        email,
        name: 'Demo User',
        role: 'admin',
        createdAt: '2024-01-01T00:00:00Z'
      },
      token: 'mock_jwt_token_' + Date.now()
    }
  },

  async signout(): Promise<void> {
    await delay(500)
    
    // TODO: Replace with actual API call
    // await fetch('YOUR_GOLANG_API/auth/signout', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
  },

  async getCurrentUser(token: string): Promise<User> {
    await delay(500)
    
    // TODO: Replace with actual API call
    // const response = await fetch('YOUR_GOLANG_API/auth/me', {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
    // return response.json()
    
    return {
      id: '1',
      email: 'user@example.com',
      name: 'Demo User',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00Z'
    }
  }
}

// Links API calls
export const linksApi = {
  async getLinks(token: string): Promise<Link[]> {
    await delay(800)
    
    // TODO: Replace with actual API call
    // const response = await fetch('YOUR_GOLANG_API/links', {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
    // return response.json()
    
    return [
      {
        id: '1',
        shortCode: '8tRJs5y',
        originalUrl: 'https://desishub.com',
        clicks: 22,
        createdAt: '2024-10-09T00:00:00Z',
        userId: '1',
        favicon: 'https://www.google.com/s2/favicons?domain=desishub.com&sz=128'
      },
      {
        id: '2',
        shortCode: 'MD6TPVG',
        originalUrl: 'https://tiktok.com/@jbdesishub/video/7558771457585679672',
        clicks: 8,
        createdAt: '2024-10-08T00:00:00Z',
        userId: '1',
        favicon: 'https://www.google.com/s2/favicons?domain=tiktok.com&sz=128'
      },
      {
        id: '3',
        shortCode: '8leWlK3',
        originalUrl: 'https://desishub.com/courses/fullstack-web-and-mobile-development-course',
        clicks: 5,
        createdAt: '2024-07-26T00:00:00Z',
        userId: '1',
        favicon: 'https://www.google.com/s2/favicons?domain=desishub.com&sz=128'
      }
    ]
  },

  async createLink(token: string, originalUrl: string, customCode?: string): Promise<Link> {
    await delay(1000)
    
    // TODO: Replace with actual API call
    // const response = await fetch('YOUR_GOLANG_API/links', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ originalUrl, customCode })
    // })
    // return response.json()
    
    return {
      id: Date.now().toString(),
      shortCode: customCode || Math.random().toString(36).substring(2, 9),
      originalUrl,
      clicks: 0,
      createdAt: new Date().toISOString(),
      userId: '1',
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(originalUrl).hostname}&sz=128`
    }
  },

  async deleteLink(token: string, linkId: string): Promise<void> {
    await delay(500)
    
    // TODO: Replace with actual API call
    // await fetch(`YOUR_GOLANG_API/links/${linkId}`, {
    //   method: 'DELETE',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
  },

  async getLinkStats(token: string, linkId: string): Promise<{ clicks: number; lastClicked?: string }> {
    await delay(500)
    
    // TODO: Replace with actual API call
    // const response = await fetch(`YOUR_GOLANG_API/links/${linkId}/stats`, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
    // return response.json()
    
    return {
      clicks: Math.floor(Math.random() * 100),
      lastClicked: new Date().toISOString()
    }
  }
}
