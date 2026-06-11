import { store } from '@simplestack/store'
import { User, authApi } from './api'

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Create the main auth store
export const authStore = store<AuthState>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
})

// Export granular selectors for specific properties
export const userStore = authStore.select('user')
export const tokenStore = authStore.select('token')
export const isAuthenticatedStore = authStore.select('isAuthenticated')
export const isLoadingStore = authStore.select('isLoading')
export const errorStore = authStore.select('error')

const setAuthenticatedSession = (user: User, token: string) => {
  authStore.set({
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })

  localStorage.setItem('auth_token', token)
}

const clearAuthenticatedSession = () => {
  authStore.set({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  })

  localStorage.removeItem('auth_token')
}

// Auth action functions
export const signin = async (email: string, password: string) => {
  isLoadingStore.set(true)
  errorStore.set(null)

  try {
    const { user, token, error } = await authApi.signin(email, password)

    if (error) {
      errorStore.set(error)
      throw new Error(error) // <-- throw so the catch in SignInPage fires
    }

    if (!user || !token) {
      throw new Error('Signin succeeded, but the server did not return a valid session.')
    }

    setAuthenticatedSession(user, token)
    
    return user
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed'
    clearAuthenticatedSession()
    errorStore.set(message)
    throw error
  } finally {
    isLoadingStore.set(false)
  }
}

export const signup = async (email: string, password: string, name: string) => {
  isLoadingStore.set(true)
  errorStore.set(null)

  try {
    const { user, token, error } = await authApi.signup(email, password, name)
    
    if (error) {
      errorStore.set(error)
      return {
        error: error,
        user: null
      }
    }

    if (!user || !token) {
      return {
        error: 'Signup succeeded, but the server did not return a valid session.',
        user: null
      }
    }

    setAuthenticatedSession(user, token)
    
    return {
      user: user,
      error: null
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed'
    errorStore.set(message)
    throw error
  } finally {
    isLoadingStore.set(false)
  }
}

export const signout = async () => {
  isLoadingStore.set(true)

  try {
    const token = tokenStore.get()
    if (token) {
      await authApi.signout()
    }
  } catch (error) {
    console.error('Signout error:', error)
  } finally {
    clearAuthenticatedSession()
  }
}

export const checkAuth = async () => {
  const token = localStorage.getItem('auth_token')

  if (!token) {
    isLoadingStore.set(false)
    return
  }

  isLoadingStore.set(true)

  try {
    const user = await authApi.getCurrentUser(token)
    
    setAuthenticatedSession(user, token)
  } catch (error) {
    // Clear invalid token
    clearAuthenticatedSession()
    errorStore.set('Session expired. Please login again.')
  } finally {
    isLoadingStore.set(false)
  }
}
