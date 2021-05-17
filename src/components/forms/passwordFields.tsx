import {css} from '@emotion/react'
import React, {useEffect, useState} from 'react'
import styled from '@emotion/styled'

import {$Warning, mqMax} from '../../shared/utils'
import {$Field} from './sharedCss/field'

const $Bars = styled.div`
  display: flex;
  height: 20px;
  width: 100%;
  justify-content: center;
  padding-top: 10px;
  span {
    display: block;
    margin-right: 5px;
    height: 100%;
    width: 22%;
    transition: box-shadow 500ms;
    box-shadow: inset 0px 20px black;
}
  }
`
type ValidationType = {hasPassed: boolean}

const passedBox = css`
  box-shadow: none !important;
`
const $Bar1 = styled.span<ValidationType>`
  ${({hasPassed}) => (hasPassed ? passedBox : null)}
  background: linear-gradient(to right, red, tomato);
`
const $Bar2 = styled.span<ValidationType>`
  ${({hasPassed}) => (hasPassed ? passedBox : null)}
  background: linear-gradient(to right, tomato, yellow);
`
const $Bar3 = styled.span<ValidationType>`
  ${({hasPassed}) => (hasPassed ? passedBox : null)}
  background: linear-gradient(to right, yellow, greenyellow);
`
const $Bar4 = styled.span<ValidationType>`
  ${({hasPassed}) => (hasPassed ? passedBox : null)}
  background: linear-gradient(to right, greenyellow, green);
`
const passed = css`
  ::before {
    display: contents !important;
    content: '✅';
    margin-left: -22px;
    position: relative;
    left: -10px;
  }
`
const $ValidationContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`

const $Validation = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px auto;
  font-size: 1.4rem;
  letter-spacing: 0.3px;
  ${mqMax.s} {
    font-size: 1rem;
  }
  ${mqMax.xs} {
    font-size: 0.9rem;
  }
`
const $Validation1 = styled.li<ValidationType>`
  ${({hasPassed}) => (hasPassed ? passed : null)}
`
const $Validation2 = styled.li<ValidationType>`
  ${({hasPassed}) => (hasPassed ? passed : null)}
`
const $Validation3 = styled.li<ValidationType>`
  ${({hasPassed}) => (hasPassed ? passed : null)}
`
const $Validation4 = styled.li<ValidationType>`
  ${({hasPassed}) => (hasPassed ? passed : null)}
`

function PasswordFields({
  setIsPasswordConfirmed,
}: {
  setIsPasswordConfirmed: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<Array<boolean>>(
    Array(4).fill(false),
  )
  const [passwordValidation, setPasswordValidation] = useState<Array<boolean>>(
    Array(4).fill(false),
  )
  function validatePasswordStrength(pass: string) {
    return [
      pass.length > 5,
      pass.search(/[A-Z]/) > -1,
      pass.search(/[0-9]/) > -1,
      pass.search(/[^0-9a-z]/i) > -1,
    ]
  }

  useEffect(() => {
    return () => {
      setPassword('')
      setConfirmPassword('')
      setPasswordStrength(Array(4).fill(false))
      setPasswordValidation(Array(4).fill(false))
    }
  }, [])

  return (
    <>
      <$Field>
        <input
          name="password"
          id="password"
          type="password"
          placeholder="Enter Password"
          minLength={6}
          required
          value={password}
          onChange={e => {
            setPassword(e.target.value)
            const validation: boolean[] = validatePasswordStrength(
              e.target.value,
            )
            setPasswordValidation([
              ...validation.map((item: boolean) => {
                return item
              }),
            ])
            setPasswordStrength([
              ...validation.filter(item => {
                return item && item
              }),
            ])
            setIsPasswordConfirmed(e.target.value === confirmPassword)
          }}
        />
        <label htmlFor="password">Password</label>
      </$Field>
      <$Field>
        <input
          autoComplete="false"
          name="confirmPassword"
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => {
            setConfirmPassword(e.target.value)
            setIsPasswordConfirmed(e.target.value === password)
          }}
          minLength={6}
          required
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
      </$Field>
      {password !== confirmPassword &&
      password.length > 5 &&
      confirmPassword.length > 5 ? (
        <$Warning role="alert" marginBottom="2px">
          Password Don&apos;t Match
        </$Warning>
      ) : null}
      <$Bars>
        <$Bar1 hasPassed={passwordStrength[0]} />
        <$Bar2 hasPassed={passwordStrength[0] && passwordStrength[1]} />
        <$Bar3
          hasPassed={
            passwordStrength[0] && passwordStrength[1] && passwordStrength[2]
          }
        />
        <$Bar4
          hasPassed={
            passwordStrength[0] &&
            passwordStrength[1] &&
            passwordStrength[2] &&
            passwordStrength[3]
          }
        />
      </$Bars>
      <$ValidationContainer>
        <$Validation>
          <$Validation1 hasPassed={passwordValidation[0]}>
            Must be at least 6 characters
          </$Validation1>
          <$Validation2 hasPassed={passwordValidation[1]}>
            Must contain a capital letter
          </$Validation2>
          <$Validation3 hasPassed={passwordValidation[2]}>
            Must contain a number
          </$Validation3>
          <$Validation4 hasPassed={passwordValidation[3]}>
            Must contain a special character
          </$Validation4>
        </$Validation>
      </$ValidationContainer>
    </>
  )
}

export default PasswordFields
