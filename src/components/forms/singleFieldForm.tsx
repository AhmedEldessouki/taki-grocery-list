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

const $EditFormContainer = styled.div<{successful: boolean}>`
  display: grid;
  align-items: center;
  grid-template-areas: 'label input edit';
  grid-template-columns: 2fr 4fr 1fr;
  gap: 5px;
  label,
  input {
    letter-spacing: 0.3px;
  }
  label {
    text-transform: capitalize;
    font-size: 20px;
    font-weight: 400;
    font-variant: petite-caps;
    letter-spacing: 0.8px;
    grid-area: label;
  }
  input {
    grid-area: input;
    border: none;
    border-bottom: 2px solid var(--black);
    animation: ${successfulKeyframes} 1s linear;
    animation-iteration-count: 0;
    background: white;
    padding: 5px 3px;
    color: var(--black);
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
      border-color: var(--blue);
    }
  }
  ${mqMax.s} {
    width: 208px;
    gap: 10px;
    padding-bottom: 20px;
    grid-template-columns: 3fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
      'label edit'
      'input input';
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
    <div>
      {isEditActive ? (
        <form onSubmit={handleSubmit}>
          <$EditFormContainer successful={isSuccess}>
            <label htmlFor={name}>{label}</label>
            <input name={name} id={name} type={type} {...inputOverrides} />
            <Button
              disabled={isPending}
              type="submit"
              id="edit-form-submit-button"
              style={{color: 'var(--green)'}}
            >
              <CheckCircleOutlineRoundedIcon />
            </Button>
          </$EditFormContainer>
        </form>
      ) : (
        <$EditFormContainer successful={isSuccess}>
          <label htmlFor={name}>{label}</label>
          <input
            name={name}
            id={name}
            type={type}
            readOnly
            {...inputOverrides}
            placeholder=""
          />
          <Button
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
          </Button>
        </$EditFormContainer>
      )}
      {handleUserConfirmed && (
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
      )}
    </div>
  )
}

export default SingleFieldForm
