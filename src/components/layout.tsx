import {useEffect, useState} from 'react'
import Nav from './nav/nav'

export default function Layout({children}: {children: React.ReactNode}) {
  const [isEmulatorActive, setIsEmulatorActive] = useState('')
  useEffect(() => {
    setIsEmulatorActive(window.localStorage.getItem('isEmulatorActive') ?? '')
  }, [])

  return (
    <>
      <Nav />
      <main style={{background: 'var(--lightGray)'}}>
        {process.env.NODE_ENV !== 'production' && (
          <div>
            <button
              style={{
                background:
                  isEmulatorActive === 'true' ? `green` : 'var(--lightGray)',
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
            </button>
            <button
              style={{
                background:
                  isEmulatorActive === 'false' ? `red` : 'var(--lightGray)',
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
            </button>
          </div>
        )}
        {children}
      </main>
    </>
  )
}
