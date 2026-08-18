import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider, useAuth } from '@clerk/react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import './index.css'
import App from './App.jsx'

const convexUrl = import.meta.env.VITE_CONVEX_URL
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!convexUrl) {
  console.error(
    'Missing VITE_CONVEX_URL. Run `npx convex dev` and set it in .env.local (see .env.example).'
  )
}
if (!clerkPublishableKey) {
  console.error(
    'Missing VITE_CLERK_PUBLISHABLE_KEY. Set it in .env.local (see .env.example).'
  )
}

const convex = new ConvexReactClient(convexUrl ?? '')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey ?? ''}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
)
