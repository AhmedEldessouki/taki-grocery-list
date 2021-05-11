import React from 'react'
import styled from '@emotion/styled'
import myFirebase from '../../lib/firebase'
import Profile from './profile'

const $UserContainer = styled.div`
  // margin: 10px auto;
  button {
    --bg: rgba(100, 100, 100, 0.29);
    color: var(--white);
    font-size: var(--fontS);
    font-size: var(--fontS);
    width: 100%;
    padding: 10px 17px 13px;
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
function User({user}: {user: myFirebase.User}) {
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
        <Profile
          showDialog={showDialog}
          user={user}
          closeDialog={closeDialog}
        />
      )}
    </$UserContainer>
  )
}
export default User
