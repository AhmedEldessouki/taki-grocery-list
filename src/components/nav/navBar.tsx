import React from 'react'
import {useAuth} from '../../context/auth'
import NavItems from './navItems'

function NavBar() {
  const {signOut} = useAuth()

  return <NavItems signOut={signOut} />
}

export default NavBar
