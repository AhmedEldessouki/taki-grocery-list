import React from 'react'
import ReactDOM from 'react-dom'
import {QueryClient, QueryClientProvider} from 'react-query'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import {AuthProvider} from './context/auth'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()
