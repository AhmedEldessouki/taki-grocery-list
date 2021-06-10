import React from 'react'
import styled from '@emotion/styled'
import Button from '../button'

const $ItemContainer = styled.div`
  a {
    font-size: var(--fontS);
    padding: 0 4px;
  }
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
      {onClick ? (
        <Button type="button" onClick={onClick}>
          {title ?? ''}
        </Button>
      ) : (
        <a href={href}>{title}</a>
      )}
    </$ItemContainer>
  )
}

export default Item
