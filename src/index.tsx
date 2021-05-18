import React from 'react'
import ReactDOM from 'react-dom'
import {QueryClient, QueryClientProvider} from 'react-query'
import App from './App'
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
