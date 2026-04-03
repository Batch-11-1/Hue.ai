
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const navigate = useNavigate()
  
  const backendBaseUrl = useMemo(() => {
    const fromEnv = import.meta.env.VITE_BACKEND_BASE_URL
    const base = fromEnv || 'http://localhost:3000'
    return String(base).replace(/\/$/, '')
  }, [])

  useEffect(() => {
    const WAKE_URL = `${backendBaseUrl}/wake`;
    axios.get(WAKE_URL);
  }, [])

  return (
    <div
      id="center"
    >
      <Header />
      <h1>StyleHub</h1>
      <p>
        Upload your HTML and describe your design preferences. StyleHub will help generate a polished,
        production-ready look utilizing AI.
      </p>

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
