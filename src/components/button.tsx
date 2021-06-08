/* eslint-disable react/jsx-props-no-spreading */
import styled from '@emotion/styled'
import React from 'react'

const $Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--roundness);
  min-height: 40px;
  min-width: 40px;
  background: var(--white);
  border: 0.1em solid #d9d9d9;
  padding: 0 15px;
  cursor: pointer;
  letter-space: 0.4px;
`
function Button({
  children,
  ...overRide
}: {
  children: string | JSX.Element
  overRide?: React.ButtonHTMLAttributes<HTMLButtonElement>
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <$Button {...overRide}>{children}</$Button>
}

export default Button
