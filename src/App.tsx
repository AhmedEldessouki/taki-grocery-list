import * as React from 'react'
import {ToastContainer} from 'react-toastify'
import styled from '@emotion/styled'
import {Global} from '@emotion/react'
import {ReactQueryDevtools} from 'react-query/devtools'
import globalStyles from './shared/styles'
import {useAuth} from './context/auth'
import {auth} from './lib/firebase'
import Layout from './components/layout'
import 'react-toastify/dist/ReactToastify.css'
import Spinner from './components/spinner'

const SignIn = React.lazy(() => import('./components/forms/signIn'))
const SignUp = React.lazy(() => import('./components/forms/signUp'))
const Grocery = React.lazy(() => import('./components/grocery'))

const $AppContainer = styled.div`
  background: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90vh;
  button {
    margin: 10px;
  }
`
const $AuthAppContainer = styled.div`
  background: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`

function App() {
  const {user, setUser: setUserAuth} = useAuth()

  React.useEffect(() => {
    auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        return setUserAuth(currentUser)
      }
      return setUserAuth(null)
    })
  }, [setUserAuth])

  return (
    <Layout>
      <Global styles={globalStyles} />
      {user ? (
        <$AuthAppContainer>
          <React.Suspense fallback={<Spinner size={40} mount />}>
            <Grocery userId={user.uid} />
          </React.Suspense>
        </$AuthAppContainer>
      ) : (
        <$AppContainer>
          <React.Suspense fallback={<Spinner size={40} mount />}>
            <SignIn />
            <SignUp />
          </React.Suspense>
        </$AppContainer>
      )}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />}
    </Layout>
  )
}

export default App
