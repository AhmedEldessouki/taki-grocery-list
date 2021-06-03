import React from 'react'
import styled from '@emotion/styled'

const $Spinner = styled.div<{size: number}>`
  @keyframes spinner {
    0% {
      transform: translate3d(-50%, -50%, 0) rotate(0deg);
    }
    100% {
      transform: translate3d(-50%, -50%, 0) rotate(360deg);
    }
  }
  animation: 1.5s linear infinite spinner;
  animation-play-state: inherit;
  border: 3px solid var(--green);
  border-bottom: 2.8px solid var(--mattGray);
  border-radius: 50%;
  content: '';
  ${({size}) => `
  height: ${size / 1.7}px;
  width: ${size / 1.7}px;
  `}
  position: relative;
  top: 12px;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  will-change: transform;
`

function Spinner({
  mount,
  size = 20,
  styling,
}: {
  mount: boolean
  size?: number
  styling?: React.CSSProperties
}) {
  return (
    <div
      hidden={!mount}
      style={{
        position: 'absolute',
        color: 'var(--green)',
        ...styling,
      }}
    >
      <$Spinner size={size ?? 20} />
    </div>
  )
}

export default Spinner
