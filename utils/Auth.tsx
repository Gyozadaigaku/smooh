const AuthContext = createContext({})
import { createContext, useState, useEffect, useContext } from 'react'
import { getAuth } from 'firebase/auth'
import Loading from './components/Loading'
import Login from './components/Login'
import nookies from 'nookies'

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const auth = getAuth()
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setCurrentUser(null)
        setLoading(false)
        nookies.set(undefined, 'token', '', {})
        return
      }
      const token = await user.getIdToken()
      setCurrentUser(user)
      setLoading(false)
      nookies.set(undefined, 'token', token, {})
    })
  }, [])
  if (loading) {
    return <Loading />
  }

  if (!currentUser) {
    return <Login />
  } else {
    return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>
  }
}

export const useAuth = () => useContext(AuthContext)
