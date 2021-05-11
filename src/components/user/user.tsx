import React from 'react'
import styled from '@emotion/styled'

import Profile from './profile'

const $UserContainer = styled.div`
  // margin: 10px auto;
  button {
    --bg: rgba(100, 100, 100, 0.7);
    color: var(--lightGray);
    font-size: var(--fontS);
    font-size: var(--fontS);
    width: 100%;
    padding: 10px 17px;
    border: none;
    background: none;
    border-radius: var(--roundness);
    :hover,
    :focus-within,
    :focus-visible,
    :focus {
      outline: none;
      background: var(--bg);
    }
  }
`
function User() {
  const [showDialog, setShowDialog] = React.useState(false)

  const openDialog = () => setShowDialog(true)
  const closeDialog = () => setShowDialog(false)

  return (
    <$UserContainer>
      <button
        onClick={() => {
          openDialog()
        }}
      >
        Profile
      </button>
      {showDialog && (
        <Profile showDialog={showDialog} closeDialog={closeDialog} />
      )}
    </$UserContainer>
  )
}
export default User
