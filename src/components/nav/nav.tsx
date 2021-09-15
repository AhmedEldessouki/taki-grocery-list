import React from 'react'
import styled from '@emotion/styled'
import {FormattedMessage} from 'react-intl'
import {mqMax} from '../../shared/utils'

const NavBar = React.lazy(() => import('./navBar'))

const $Logo = styled.h1`
  margin: 0;
  letter-spacing: 3px;
  font-weight: 500;
  color: var(--white);
  ${mqMax.xs} {
    font-size: 20px;
    margin: 30px auto;
  }
`
const $Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: green;
  color: var(--white);
  height: var(--navHeight);
  ${mqMax.phoneLarge} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  ${mqMax.s} {
    a {
      padding-top: 4px;
    }
  }
  ${mqMax.xs} {
    a {
      padding-top: 2px;
    }
  }
`

function Nav() {
  return (
    <$Nav>
      <$Logo>
        <FormattedMessage id="nav.title" />
      </$Logo>
      <React.Suspense fallback={<div>...</div>}>
        <NavBar />
      </React.Suspense>
    </$Nav>
  )
}
export default Nav
