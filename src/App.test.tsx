import React from 'react'
import App from './App'
import {render, screen} from './test/utils'

test('smoke test', async () => {
  await render(<App />)
  const signIn = screen.getByText(/Sign In/i)
  expect(signIn).toBeInTheDocument()
})
