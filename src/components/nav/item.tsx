import React from 'react'
import styled from '@emotion/styled'

const $ItemContainer = styled.div`
  a {
    font-size: var(--fontS);
    padding: 0 4px;
  }
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
function Item({
  onClick,
  href = '/',
  title,
}: {
  onClick?: () => void
  href?: string
  title?: string
}) {
  // Checks If It's a Button
  return (
    <$ItemContainer>
      {!!onClick ? (
        <button onClick={onClick}>{title}</button>
      ) : (
        <a href={href}>{title}</a>
      )}
    </$ItemContainer>
  )
}

export default Item
