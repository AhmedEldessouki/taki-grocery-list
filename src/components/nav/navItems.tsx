import React from 'react'
import styled from '@emotion/styled'
import {FormattedMessage} from 'react-intl'
import {useAuth} from '../../context/auth'
import {mqMax} from '../../shared/utils'
import User from '../user/user'
import NavItem from './item'
import LangSelect from '../langSelect'

const $NavItemsContainer = styled.div`
  display: flex;
  gap: 50px;
  z-index: 200;
  position: relative;
  align-items: center;

  ${mqMax.phoneLarge} {
    max-height: 100vh;
    gap: 10px;
    justify-content: space-around;
    align-items: center;
  }
  ${mqMax.s} {
    gap: 10px;
  }
`

function NavItems({signOut}: {signOut: () => Promise<void> | null}) {
  const {user} = useAuth()
  return user ? (
    <$NavItemsContainer>
      <User user={user} />
      <NavItem onClick={signOut}>
        <FormattedMessage id="sign.out" />
      </NavItem>
      <LangSelect />
    </$NavItemsContainer>
  ) : (
    <LangSelect />
  )
}

export default NavItems
