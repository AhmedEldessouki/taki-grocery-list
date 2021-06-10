/* eslint-disable react/jsx-props-no-spreading */
import styled from '@emotion/styled'
import React from 'react'

const $Button = styled.button<{bgColor?: string}>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--roundness);
  min-height: 40px;
  min-width: 40px;
  background: ${({bgColor}) => bgColor ?? `var(--white)`};
  border: 0.125rem solid #b0b0b075;
  padding: 0 15px;
  cursor: pointer;
  font-size: 1.1rem;
  letter-spacing: 1px;
  line-height: 1.3;
  text-align: center;
  :hover {
    scale: 1.035;
  }
  :active {
    scale: 0.97;
  }
`
function Button({
  children,
  bgColor,
  ...overRide
}: {
  bgColor?: string
  children: string | JSX.Element
  overRide?: React.ButtonHTMLAttributes<HTMLButtonElement>
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <$Button bgColor={bgColor} {...overRide}>
      {children}
    </$Button>
  )
}

export default Button
