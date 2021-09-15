/* eslint-disable react/jsx-props-no-spreading */
import React, {useState} from 'react'
import EditIcon from '@material-ui/icons/Edit'
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded'
import styled from '@emotion/styled'
import {keyframes} from '@emotion/react'
import {FormattedMessage} from 'react-intl'
import spacefy from '../../lib/spacefy'
import {mqMax} from '../../shared/utils'
import Spinner from '../spinner'
import ConfirmPassword from './confirmPassword'
import Button from '../button'

interface SingleFieldFormType
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string
  submitFunction: (e: React.SyntheticEvent) => Promise<string>
  onEditStart: () => void
  onEditEnd: () => void
  passwordConfirmation?: boolean
  name: string
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
  flex-wrap: wrap;
  align-items: center;
  width: 330px;
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
      border-color: var(--white);
    }
    :valid {
      border-color: var(--green);
    }
    :invalid {
      border-color: var(--red);
    }
    :read-only {
      border-color: var(--blackShade);
      text-transform: capitalize;
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
    :disabled {
      cursor: no-drop;
      background: transparent !important;
    }
  }
  ${mqMax.s} {
    width: 268px;
    input {
      width: 258px;
    }
  }
  ${mqMax.xs} {
    width: 212px;
    input {
      width: 202px;
    }
  }
  ${mqMax.s} {
    width: 268px;
    input {
      width: 258px;
    }
  }
  ${mqMax.xs} {
    width: 212px;
    input {
      width: 202px;
    }
  }
`

function SingleFieldForm({
  submitFunction,
  name,
  id,
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
          <$Label htmlFor={id ?? name}>
            <FormattedMessage id={label} defaultMessage={label} />
          </$Label>
          <$EditFormContainer successful={isSuccess}>
            <input name={name} id={id ?? name} {...inputOverrides} />
            <Button
              disabled={isPending}
              type="submit"
              style={{
                color: 'var(--green)',
                position: 'relative',
                zIndex: 1000,
                display: 'block',
                minHeight: 0,
                minWidth: 0,
              }}
            >
              {isPending ? (
                <Spinner
                  mount={isPending}
                  size={28}
                  styling={{
                    position: 'relative',
                    zIndex: 1000,
                    color: 'var(--white)',
                  }}
                />
              ) : (
                <CheckCircleOutlineRoundedIcon />
              )}
            </Button>
          </$EditFormContainer>
        </form>
      ) : (
        <>
          <$Label htmlFor={id ?? name}>
            <FormattedMessage id={label} defaultMessage={label} />
          </$Label>
          <$EditFormContainer successful={isSuccess}>
            <input name={name} id={id ?? name} readOnly {...inputOverrides} />
            <Button
              disabled={isPending}
              aria-label="Edit"
              type="button"
              style={{
                gridArea: 'edit',
                position: 'relative',
                zIndex: 1000,
                display: 'block',
                minHeight: 0,
                minWidth: 0,
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
        </>
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
    </>
  )
}

export default SingleFieldForm
