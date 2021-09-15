/* eslint-disable @typescript-eslint/dot-notation */
import * as React from 'react'
import {ToastContainer} from 'react-toastify'
import styled from '@emotion/styled'
import {Global} from '@emotion/react'
import {ReactQueryDevtools} from 'react-query/devtools'
import {FormattedMessage} from 'react-intl'
import globalStyles from './shared/styles'
import {useAuth} from './context/auth'
import {auth} from './lib/firebase'
import Layout from './components/layout'
import SignIn from './components/forms/signIn'
import SignUp from './components/forms/signUp'
import Grocery from './components/grocery'
import 'react-toastify/dist/ReactToastify.css'
import {mqMax} from './shared/utils'

const $AppContainer = styled.div`
  background: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90vh;
  button {
    margin: 10px;
  }
`
const $UnAuthContainer = styled.div`
  background: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
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
const $WelcomeMessage = styled.span`
  font-size: 6rem;
  text-align: center;
  padding: 15px;
  letter-spacing: 0.04rem;
  ${mqMax.phoneLarge} {
    font-size: 4rem;
  }
  ${mqMax.s} {
    font-size: 3rem;
  }
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
          <Grocery userId={user.uid} />
        </$AuthAppContainer>
      ) : (
        <$AppContainer>
          <$WelcomeMessage>
            <FormattedMessage id="head.welcome" defaultMessage="Welcome" />
          </$WelcomeMessage>
          <$UnAuthContainer>
            <SignIn />
            <SignUp />
          </$UnAuthContainer>
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
