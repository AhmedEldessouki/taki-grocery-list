import * as React from 'react'
import {ToastContainer} from 'react-toastify'
import styled from '@emotion/styled'
import {Helmet} from 'react-helmet'
import {useQuery} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import type {UserDataType} from '../types/user'
import {globalStyles} from './shared/styles'
import {useAuth} from './context/auth'
import SignIn from './components/forms/signIn'
import SignUp from './components/forms/signUp'
import {auth} from './lib/firebase'
import Layout from './components/layout'
import Grocery from './components/grocery'
import 'react-toastify/dist/ReactToastify.css'
import {getOneLevelDeepDoc} from './lib/get'

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

  // ADD ISDONE

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
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <title>Grocery List</title>
      </Helmet>
      {globalStyles}
      {user ? (
        <$AuthAppContainer>
          <Grocery userId={user.uid} />
        </$AuthAppContainer>
      ) : (
        <$AppContainer>
          <SignIn />
          <SignUp />
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
      <ReactQueryDevtools />
    </Layout>
  )
}

export default App
