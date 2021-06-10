import React from 'react'
import styled from '@emotion/styled'
import myFirebase from '../../lib/firebase'
import Settings from './settings'
import Button from '../button'

const $UserContainer = styled.div`
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
    <>
      <$UserContainer>
        <Button
          type="button"
          onClick={() => {
            openDialog()
          }}
        >
          Settings
        </Button>
      </$UserContainer>
      {showDialog && (
        <Settings
          showDialog={showDialog}
          user={user}
          closeDialog={closeDialog}
        />
      )}
    </>
  )
}
export default User
