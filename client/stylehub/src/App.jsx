import DottedSurface from './components/DottedSurface';
import { IntroAnimation } from './components/IntroAnimation';
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/App.css';
import logo from './assets/bm-logo.png'
import config from './utils/config';

function App() {
  const navigate = useNavigate()
  const [showContent, setShowContent] = useState(false)

  const backendBaseUrl = config.backendBaseUrl;

  useEffect(() => {
    const WAKE_URL = `${backendBaseUrl}/wake`;
    axios.get(WAKE_URL);
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])
  return (
    <DottedSurface theme="dark">
      <div id="center" className="hero-wrapper">
        {!showContent && <IntroAnimation />}
        {showContent && (
          <>
            <img src={logo} alt="HUE.AI Logo" className="hero-logo" />
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
          </>
        )}
      </div>
    </DottedSurface>
  );
}
export default App
