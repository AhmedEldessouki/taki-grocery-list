import React, {useEffect, useState} from 'react'

// import {Twitter} from '@material-ui/icons'

function Arrow({
  direction = 'right',
}: {
  direction: 'left' | 'right' | 'down' | 'up'
}) {
  const [arrow, setArrow] = useState(() => {
    if (direction === 'left') return 'rotate(90deg)'
    else if (direction === 'right') return 'rotate(270deg)'
    else if (direction === 'up') return 'rotate(180deg)'
    return 'rotate(0deg)'
  })
  useEffect(() => {
    setArrow(() => {
      if (direction === 'left') return 'rotate(90deg)'
      else if (direction === 'right') return 'rotate(270deg)'
      else if (direction === 'up') return 'rotate(180deg)'
      return 'rotate(0deg)'
    })
  }, [direction])
  return (
    <div
      style={{
        width: '18px',
        transform: arrow,
        transition: `transform 200ms linear`,
      }}
    >
      <svg viewBox="0 0 320 512">
        <path
          d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
          fill="var(--lightGray)"
          className=""
          rotate="180deg"
        />
      </svg>
    </div>
  )
}

function XIcon() {
  return (
    <svg width="14" height="15" xmlns="http://www.w3.org/2000/svg">
      <g fill="var(--lightGray)" fillRule="evenodd">
        <path d="M2.404.782l11.314 11.314-2.122 2.122L.282 2.904z" />
        <path d="M.282 12.096L11.596.782l2.122 2.122L2.404 14.218z" />
      </g>
    </svg>
  )
}

export {Arrow, XIcon}
