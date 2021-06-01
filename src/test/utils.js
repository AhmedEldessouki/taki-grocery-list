/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {QueryClient, QueryClientProvider} from 'react-query'
import {AuthProvider} from '../context/auth'

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    {timeout: 4000},
  )
const queryClient = new QueryClient()

function AllProviders({children}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}

async function render(ui, {doWait = false, ...renderOptions} = {}) {
  // if you want to render the app unauthenticated then pass "null" as the user

  const returnValue = {
    ...rtlRender(ui, {
      wrapper: AllProviders,
      ...renderOptions,
    }),
  }

  // wait for react-query to settle before allowing the test to continue
  if (doWait) {
    await waitForLoadingToFinish()
  }
  return returnValue
}

export * from '@testing-library/react'
export {render, userEvent, waitForLoadingToFinish}
