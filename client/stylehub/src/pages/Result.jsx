/*
 * Result.jsx
 * Displays the finalized layout, allows downloading the HTML/CSS code, and provides an option to iterate with further styles.
 */
import axios from 'axios'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Navbar.jsx'
import Footer from '../components/Footer'
import DottedSurface from '../components/DottedSurface'
import { WaitAnimation } from '../components/WaitAnimation'
import '../styles/Result.css'
import config from '../utils/config.js'

// Helper function to extract CSS styles from an HTML string
function extractCssFromHtml(html) {
  if (!html) return ''
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []
  const extracted = styleMatches
    .map((block) => block.replace(/^[\s\S]*?<style[^>]*>/i, '').replace(/<\/style>[\s\S]*?$/i, ''))
    .map((s) => s.trim())
    .filter(Boolean)
  return extracted.join('\n\n')
}

// Utility function to trigger a browser download for a generic string payload
function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// Reusable inline loading spinner component
function Spinner() {
  return <span className="spinner" aria-label="Loading"></span>
}

// Main component displaying download links and options for further iteration
function Result() {
  const navigate = useNavigate()
  const location = useLocation()

  const backendBaseUrl = config.backendBaseUrl;

  const getFinalHtml = () => {
    const fromState = location.state?.finalHtml || location.state?.html || location.state?.htmlCode;
    if (fromState) return fromState;
    try {
      const stored = sessionStorage.getItem("hueai_final_html");
      if (stored) return stored;
    } catch (e) {}
    return null;
  }

  const finalHtmlFromState = getFinalHtml()
  const finalCssFromState = location.state?.finalCss || location.state?.css

  const [uploadFile, setUploadFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [convertedHtml, setConvertedHtml] = useState('')
  const [convertedCss, setConvertedCss] = useState('')

  const finalCss = useMemo(() => {
    if (convertedCss) return convertedCss
    if (finalCssFromState) return finalCssFromState
    return extractCssFromHtml(finalHtmlFromState)
  }, [convertedCss, finalCssFromState, finalHtmlFromState])

  const canDownload = Boolean(finalHtmlFromState && typeof finalHtmlFromState === 'string' && finalHtmlFromState.trim().length > 0)

  // Submits the new base HTML and previously accepted styles to iterate again with AI
  async function handleRestyleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!canDownload) { setError('Missing final HTML. Please go back and generate a result first.'); return }
    if (!uploadFile) { setError('Please choose an HTML file to restyle.'); return }
    setIsSubmitting(true)
    try {
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(reader.error)
        reader.readAsText(uploadFile)
      })
      const response = await axios.post(`${backendBaseUrl}/repeat`, {
        styledHtml: finalHtmlFromState,
        targetHtml: fileContent,
      })
      const newHtml = typeof response.data === 'string' ? response.data : ''
      if (!newHtml || newHtml.trim().length === 0) throw new Error('Server response did not include updated HTML.')
      try {
        sessionStorage.setItem("hueai_result", JSON.stringify(newHtml))
      } catch(e) {}
      try {
        navigate('/output', { replace: true, state: { result: newHtml } })
      } catch (e) {
        navigate('/output', { replace: true })
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Restyle request failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Downloads the currently finalized layout HTML
  function handleDownloadHtml() {
    if (!canDownload) return
    const htmlToDownload = (convertedHtml || finalHtmlFromState || '').trim()
    if (!htmlToDownload) { setError('Final file is empty; cannot download.'); return }
    downloadTextFile('final.html', htmlToDownload, 'text/html;charset=utf-8')
  }

  const htmlButtonLabel = convertedHtml ? 'Download HTML or JSX' : 'Download as single file'

  // Connects to the backend to generate separate CSS representation and triggers download
  async function handleDownloadCss() {
    if (!canDownload) { setError('Final file is missing; cannot generate CSS.'); return }
    setError('')
    setIsSubmitting(true)
    try {
      const res = await axios.post(`${backendBaseUrl}/file`, { html: finalHtmlFromState })
      const { cssContent, htmlContent } = res.data || {}
      if (!cssContent) throw new Error('Backend /file did not return CSS content.')
      if (htmlContent) setConvertedHtml(htmlContent)
      setConvertedCss(cssContent)
      downloadTextFile('styles.css', cssContent, 'text/css;charset=utf-8')
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to generate CSS through backend.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Takes the user back to the first step of the application
  function handleStartOver() {
    navigate('/input', { replace: true })
  }

  return (
    <>
      <DottedSurface theme="dark">
        <Header />

        <div className="result-page">

          {isSubmitting && (
            <div className="loading-overlay">
              <div className="loading-spinner-container">
                <WaitAnimation />
                <p className="loading-text">Processing…</p>
              </div>
            </div>
          )}

          {/* Hero */}
          <div className="result-hero">
            <p className="result-eyebrow">HUE.AI</p>
            <h1 className="result-title">Final result</h1>
          </div>

          {/* Missing HTML warning */}
          {!canDownload ? (
            <div className="banner banner--error">
              Final file is missing. Generate a result first, then come back here.
            </div>
          ) : null}

          {/* Downloads section */}
          <section className="result-section">
            <div className="result-section-header">
              <span className="result-section-icon">↓</span>
              <h2 className="result-section-title">Downloads</h2>
            </div>

            <div className="download-btn-row">
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleDownloadHtml}
                disabled={!canDownload || isSubmitting}
              >
                {isSubmitting ? <><Spinner /> Downloading</> : htmlButtonLabel}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={handleDownloadCss}
                disabled={!canDownload || isSubmitting}
              >
                {isSubmitting ? <><Spinner /> Processing CSS</> : 'Download CSS separately'}
              </button>
            </div>

            {finalCss ? (
              <div className="css-preview-block">
                <h3 className="css-preview-title">Generated CSS Preview</h3>
                <pre className="css-preview-code">{finalCss}</pre>
              </div>
            ) : null}
          </section>

          {/* Restyle section */}
          <section className="result-section">
            <div className="result-section-header">
              <span className="result-section-icon">↺</span>
              <h2 className="result-section-title">Restyle again</h2>
            </div>
            <p className="result-section-desc">
              Upload a new file and submit it along with your current styling to repeat the styling.
            </p>

            <form className="restyle-form" onSubmit={handleRestyleSubmit}>
              <label className="file-upload-label">
                <div className="file-upload-text">
                  <p className="file-name">
                    {uploadFile ? `Selected: ${uploadFile.name}` : 'Upload new file'}
                  </p>
                  <p className="file-hint">Accepted: .html, .jsx</p>
                </div>
                <div className="file-browse-btn">Browse</div>
                <input
                  className="file-input-hidden"
                  type="file"
                  accept=".html,.jsx"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  disabled={isSubmitting}
                />
              </label>

              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting || !uploadFile || !canDownload}
              >
                {isSubmitting ? <><Spinner /> Generating…</> : 'Submit & Generate New Styling'}
              </button>
            </form>

            {error ? (
              <div className="banner banner--error">{error}</div>
            ) : null}
          </section>

          {/* Start over section */}
          <section className="result-section result-section--slim">
            <div className="result-section-header">
              <span className="result-section-icon">⟳</span>
              <h2 className="result-section-title">Start over</h2>
            </div>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={handleStartOver}
            >
              Restart Styling
            </button>
          </section>

        </div>

        <Footer />
      </DottedSurface>
    </>
  )
}

export default Result