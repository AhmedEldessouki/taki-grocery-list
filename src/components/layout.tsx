import React, {useEffect, useState} from 'react'
import Button from './button'
import Nav from './nav/nav'

export default function Layout({children}: {children: React.ReactNode}) {
  const [isEmulatorActive, setIsEmulatorActive] = useState('')
  useEffect(() => {
    setIsEmulatorActive(window.localStorage.getItem('isEmulatorActive') ?? '')
  }, [])

  return (
    <>
      <Nav />
      <main style={{background: 'var(--white)'}}>
        {process.env.NODE_ENV !== 'production' && (
          <div>
            <Button
              type="button"
              style={{
                background:
                  isEmulatorActive === 'true' ? `green` : 'var(--white)',
                color: isEmulatorActive === 'true' ? `white` : 'var(--black)',
              }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.localStorage.setItem('isEmulatorActive', 'true')
                }
              }}
              disabled={isEmulatorActive === 'true'}
            >
              Activate Emulator
            </Button>
            <Button
              type="button"
              style={{
                background:
                  isEmulatorActive === 'false' ? `red` : 'var(--white)',
                color: isEmulatorActive === 'false' ? `white` : 'var(--black)',
              }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.localStorage.setItem('isEmulatorActive', 'false')
                }
              }}
              disabled={isEmulatorActive === 'false'}
            >
              deactivate Emulator
            </Button>
          </div>
        )}
        {children}
      </main>
    </>
  )
}
