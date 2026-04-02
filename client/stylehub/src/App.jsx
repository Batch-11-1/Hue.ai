/* The App.jsx file is the main entry point for the React application. It renders the landing page of the application. The landing page will have a small intro and two buttons, one for starting the styling which redirects to the input page and another for viewing the about page which redirects to the about page.

At the beginning of the page loading, we will show a loading animation for few seconds before rendering the landing page. This is to give the user a better experience and to make the application look more polished. Also an axios reqeust is made to the backend to check if the server is running.
*/
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [serverStatus, setServerStatus] = useState('checking') // 'checking' | 'ready' | 'unavailable'
  const [serverError, setServerError] = useState('')

  const backendBaseUrl = useMemo(() => {
    const fromEnv = import.meta.env.VITE_BACKEND_BASE_URL
    const base = fromEnv || 'http://localhost:3000'
    return String(base).replace(/\/$/, '')
  }, [])

  useEffect(() => {
    let cancelled = false

    const MIN_LOADING_MS = 2500
    const WAKE_URL = `${backendBaseUrl}/wake`

    const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS))
    const healthCheck = axios.get(WAKE_URL, { timeout: 3000 })

    setIsLoading(true)
    setServerStatus('checking')
    setServerError('')

    Promise.allSettled([minDelay, healthCheck]).then((results) => {
      if (cancelled) return

      const health = results[1]
      if (health.status === 'fulfilled') {
        setServerStatus('ready')
      } else {
        setServerStatus('unavailable')
        const msg = health.reason?.message || 'Backend server is unreachable.'
        setServerError(msg)
      }
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [backendBaseUrl])

  if (isLoading) {
    return (
      <div>
        <div>Preparing StyleHub…</div>
        <div>Checking backend and warming up.</div>
      </div>
    )
  }

  return (
    <div
      id="center"
    >
      <Header />
      <h1>StyleHub</h1>
      <p>
        Upload your HTML and describe your design preferences. StyleHub will help generate a polished,
        production-ready look.
      </p>

      {serverStatus === 'unavailable' ? (
        <div>
          Backend not reachable. You may still explore the UI, but styling requests will fail.
          {serverError ? ` (${serverError})` : ''}
        </div>
      ) : (
        <div>Backend is ready.</div>
      )}

      <div>
        <button
          type="button"
          onClick={() => navigate('/input')}
        >
          Start Styling
        </button>
        <button
          type="button"
          onClick={() => navigate('/aboutus')}
        >
          About Us
        </button>
      </div>
      <Footer />
    </div>
  )
}

export default App
