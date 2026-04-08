import DottedSurface from './components/DottedSurface';
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/App.css';
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
  <DottedSurface theme="dark">
    <div id="center" className="hero-wrapper">
      <h1 className="hero-title">HUE.AI</h1>
      <p className="hero-description">
        Upload your HTML and describe your design preferences. HUE.ai will help generate a polished,
        production-ready look UI with AI.
      </p>
      <div className="hero-actions">
        <button type="button" className="btn btn-primary" onClick={() => navigate('/input')}>
          Start Styling
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/aboutus')}>
          About Us
        </button>
      </div>
    </div>
  </DottedSurface>
);
}
export default App
