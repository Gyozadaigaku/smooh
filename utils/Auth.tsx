const AuthContext = createContext({})
import { createContext, useState, useEffect, useContext } from 'react'
import { getAuth } from 'firebase/auth'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './components/Loading' or its c... Remove this comment to see the full error message
import Loading from './components/Loading'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './components/Login' or its cor... Remove this comment to see the full error message
import Login from './components/Login'
import nookies from 'nookies'

export const AuthProvider = ({ children }: any) => {
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
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'User' is not assignable to param... Remove this comment to see the full error message
      setCurrentUser(user)
      setLoading(false)
      nookies.set(undefined, 'token', token, {})
    })
  }, [])
  if (loading) {
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    return <Loading />
  }

  if (!currentUser) {
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    return <Login />
  } else {
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>
  }
}

export const useAuth = () => useContext(AuthContext)
