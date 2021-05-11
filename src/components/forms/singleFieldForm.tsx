import React, {useState} from 'react'
import EditIcon from '@material-ui/icons/Edit'
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded'
import Button from '@material-ui/core/Button'
import styled from '@emotion/styled'
import {keyframes} from '@emotion/react'
import {mqMax} from '../../shared/utils'
import {spacefy} from '../../lib/spacefy'
import ConfirmPassword from './confirmPassword'

interface SingleFieldFormType
  extends React.InputHTMLAttributes<HTMLInputElement> {
  submitFunction: (e: React.SyntheticEvent) => Promise<string>
  onEditStart: () => void
  onEditEnd: () => void
  passwordConfirmation?: boolean
  name: string
  type?: string
  isPending: boolean
  isSuccess: boolean
  handleUserConfirmed?: (arg: boolean) => void
  inputOverrides?: React.InputHTMLAttributes<HTMLInputElement>
}

const successfulKeyframes = keyframes`
0%{
color: var(--black);
} 25% {
color: yellowgreen;
} 50%{
color: var(--green);
} 75% {
color: yellowgreen;
} 100% {
  color: var(--black);
}
`
const $Label = styled.label`
  letter-spacing: 0.3px;
  text-transform: capitalize;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.8px;
`
const $EditFormContainer = styled.div<{successful: boolean}>`
  display: flex;
  align-items: center;

  input {
    letter-spacing: 0.3px;
    margin-bottom: 15px;
    margin-top: 5px;
    width: 320px;
    border: none;
    border-bottom: 3px solid var(--black);
    animation: ${successfulKeyframes} 1s linear;
    animation-iteration-count: 0;
    background: transparent;
    padding: 5px 3px;
    color: var(--black);
    border-radius: var(--roundness);
    ${({successful}) => successful && `animation-iteration-count: 1;`}
    :focus-within {
      outline: none;
      border-color: var(--lightGray);
    }
    :valid {
      border-color: var(--green);
    }
    :invalid {
      border-color: var(--red);
    }
    :read-only {
      border-color: var(--blackShade);
    }
  }
  button {
    padding: 1px 0 0;
    margin-bottom: 12px;
    margin-left: -30px;
    border: none;
    background: transparent;
    width: 25px;
    cursor: pointer;
  }
`

function SingleFieldForm({
  submitFunction,
  name,
  type = 'text',
  isPending,
  isSuccess,
  passwordConfirmation,
  onEditStart,
  onEditEnd,
  handleUserConfirmed,
  ...inputOverrides
}: SingleFieldFormType) {
  const [isEditActive, setIsEditActive] = useState(false)
  const [showDialog, setShowDialog] = useState<boolean>()

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()

    const status = await submitFunction(e)
    if (status === 'rejected') return
    onEditEnd()
    setIsEditActive(false)
  }
  const label = spacefy(name)
  return (
    <>
      {isEditActive ? (
        <form onSubmit={handleSubmit}>
          <$Label htmlFor={name}>{label}</$Label>
          <$EditFormContainer successful={isSuccess}>
            <input name={name} id={name} type={type} {...inputOverrides} />
            <button
              disabled={isPending}
              type="submit"
              style={{color: 'var(--green)'}}
            >
              <CheckCircleOutlineRoundedIcon />
            </button>
          </$EditFormContainer>
        </form>
      ) : (
        <>
          <$Label htmlFor={name}>{label}</$Label>
          <$EditFormContainer successful={isSuccess}>
            <input
              name={name}
              id={name}
              type={type}
              readOnly
              {...inputOverrides}
            />
            <button
              disabled={isPending}
              aria-label="Edit"
              type="button"
              style={{
                gridArea: 'edit',
              }}
              onClick={() => {
                setIsEditActive(true)
                onEditStart()
                if (passwordConfirmation) {
                  setShowDialog(true)
                }
              }}
            >
              <EditIcon style={{color: 'var(--blue)'}} />
            </button>
          </$EditFormContainer>
        </>
      )}
      {handleUserConfirmed ? (
        <ConfirmPassword
          showDialog={!!showDialog}
          handleUserConfirmed={handleUserConfirmed}
          pendingStart={() => {
            setIsEditActive(true)
          }}
          onDialogClose={() => {
            setShowDialog(false)
          }}
          onDialogCancel={() => {
            onEditEnd()
            setIsEditActive(false)
            setShowDialog(false)
          }}
        />
      ) : (
        <div />
      )}
    </>
  )
}

export default SingleFieldForm
