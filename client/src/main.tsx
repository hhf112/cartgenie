import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SessionContextProvider } from './contexts/SessionContextProvider.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionContextProvider>
      <App />
    </SessionContextProvider>
  </StrictMode>,
)
