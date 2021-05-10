import React from 'react'
import firebase, {auth} from '../lib/firebase'
import {notify} from '../lib/notify'
import type {MyResponseTypeWithData} from '../../types/api'
import {useLocalStorageState} from '../lib/useLocalStorage'

type Credentials = {
  email: string
  password: string
}
type ResponseType = {user?: firebase.auth.UserCredential; error?: string}
type AuthContextType = {
  user: firebase.User | null | undefined
  setUser: React.Dispatch<
    React.SetStateAction<firebase.User | null | undefined>
  >
}

const AuthContext = React.createContext<unknown>({})

AuthContext.displayName = 'AuthContext'

function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useLocalStorageState<
    firebase.User | null | undefined
  >('______________TakisUser_______________', null)

  const value = {
    user,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

async function signIn(credentials: Credentials) {
  const response: ResponseType = {user: undefined, error: undefined}
  await auth
    .signInWithEmailAndPassword(credentials.email, credentials.password)
    .then(
      res => {
        response.user = res
        notify(
          '👋🏻',
          `Welcome, ${res.user?.displayName && res.user.displayName}!`,
          {
            color: 'var(--lightGray)',
          },
        )
        console.log(res.user)
      },
      (err: Error) => {
        response.error = err.message
        notify('❌', `SignIn Failed!`, {
          color: 'var(--red)',
        })
      },
    )
    .catch((err: Error) => {
      response.error = err.message
      notify('❌', `SignIn Failed!`, {
        color: 'var(--red)',
      })
    })
  return response
}
function useAuth() {
  const value = React.useContext(AuthContext)
  const {user, setUser} = value as AuthContextType

  if (!setUser) {
    throw new Error('"useAuth" should be used inside "AuthProvider"')
  }
  React.useEffect(() => {
    if (!auth.currentUser) return

    auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        return setUser(currentUser)
      }
      return setUser(null)
    })
  }, [setUser])

  async function signOut() {
    notify('👋🏻', `Good Bye, ${user?.displayName && user.displayName}!`, {
      color: 'var(--lightGray)',
    })
    if (auth?.currentUser) await auth.signOut()
    setUser(null)
  }

  async function signUp(newUser: Credentials) {
    const response: ResponseType = {user: undefined, error: undefined}
    await auth
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(
        async res => {
          response.user = res
          if (res.user) setUser(res.user)
        },
        (err: Error) => {
          notify('❌', `SignUp Failed!`, {
            color: 'var(--red)',
          })
          response.error = err.message
        },
      )
      .catch((err: Error) => {
        notify('❌', `SignUp Failed!`, {
          color: 'var(--red)',
        })
        response.error = err.message
      })
    return response
  }
  const reauthenticateUser = async (
    currentPassword: string,
  ): Promise<MyResponseTypeWithData<firebase.auth.UserCredential>> => {
    const response: MyResponseTypeWithData<firebase.auth.UserCredential> = {
      data: undefined,
      error: undefined,
      isSuccessful: false,
    }

    const userXX = auth.currentUser
    if (user === null) return response
    if (typeof userXX?.email !== 'string') return response
    // eslint-disable-next-line import/no-named-as-default-member
    const cred = firebase.auth.EmailAuthProvider.credential(
      userXX?.email,
      currentPassword,
    )

    await user
      ?.reauthenticateWithCredential(cred)
      .then(
        res => {
          notify('👍🏻', `All Right!`, {color: 'var(--green)'})
          response.isSuccessful = true
          response.data = res
        },
        (err: Error) => {
          notify('🤕', `Oh Man!`, {color: 'var(--red)'})
          response.error = err
        },
      )
      .catch((err: Error) => {
        notify('🤕', `Oh Man!`, {color: 'var(--red)'})
        response.error = err
      })
    return response
  }
  return {
    signOut,
    signUp,
    signIn,
    user,
    setUser,
    reauthenticateUser,
  }
}

export {AuthProvider, useAuth}
