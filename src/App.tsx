import * as React from 'react'
import {ToastContainer} from 'react-toastify'
import styled from '@emotion/styled'
import {Helmet} from 'react-helmet'
import {globalStyles} from './shared/styles'
import {useAuth} from './context/auth'
import SignIn from './components/forms/signIn'
import SignUp from './components/forms/signUp'
import {auth} from './lib/firebase'

import 'react-toastify/dist/ReactToastify.css'
import Layout from './components/layout'
import AddStuff from './components/forms/addStuff'
import User from './components/user/user'
import Items from './components/items'

const $AppContainer = styled.div`
  background: var(--lightGray);
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
  background: var(--lightGray);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`

function App() {
  const {user, setUser} = useAuth()

  React.useEffect(() => {
    auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        return setUser(currentUser)
      }
      return setUser(null)
    })
  }, [setUser])

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
        <>
          <User />
          <$AuthAppContainer>
            <Items data={['asdasd', 'asdasd']} />
            <AddStuff />
          </$AuthAppContainer>
        </>
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
    </Layout>
  )
}

export default App
