import axios from 'axios'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Navbar.jsx'
import Footer from '../components/Footer'
import DottedSurface from '../components/DottedSurface'
import { WaitAnimation } from '../components/WaitAnimation'
import '../styles/Result.css'

function extractCssFromHtml(html) {
  if (!html) return ''
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []
  const extracted = styleMatches
    .map((block) => block.replace(/^[\s\S]*?<style[^>]*>/i, '').replace(/<\/style>[\s\S]*?$/i, ''))
    .map((s) => s.trim())
    .filter(Boolean)
  return extracted.join('\n\n')
}

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

function Spinner() {
  return <span className="spinner" aria-label="Loading"></span>
}

function Result() {
  const navigate = useNavigate()
  const location = useLocation()

  const backendBaseUrl = useMemo(() => {
    const fromEnv = import.meta.env.VITE_BACKEND_BASE_URL
    const base = fromEnv || 'http://localhost:3000'
    return String(base).replace(/\/$/, '')
  }, [])

  const finalHtmlFromState = location.state?.finalHtml || location.state?.html || location.state?.htmlCode
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
      navigate('/output', { replace: true, state: { result: newHtml } })
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Restyle request failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleDownloadHtml() {
    if (!canDownload) return
    const htmlToDownload = (convertedHtml || finalHtmlFromState || '').trim()
    if (!htmlToDownload) { setError('Final HTML is empty; cannot download.'); return }
    downloadTextFile('final.html', htmlToDownload, 'text/html;charset=utf-8')
  }

  const htmlButtonLabel = convertedHtml ? 'Download HTML' : 'Download as single file'

  async function handleDownloadCss() {
    if (!canDownload) { setError('Final HTML is missing; cannot generate CSS.'); return }
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
      setError(err?.response?.data?.error || err?.message || 'Failed to generate CSS through backend.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <p className="result-eyebrow">HUE.ai AI</p>
            <h1 className="result-title">Final result</h1>
          </div>

          {/* Missing HTML warning */}
          {!canDownload ? (
            <div className="banner banner--error">
              Final HTML is missing. Generate a result first, then come back here.
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
              Upload a new HTML file and submit it along with your current HTML to generate a new styled webpage.
            </p>

            <form className="restyle-form" onSubmit={handleRestyleSubmit}>
              <label className="file-upload-label">
                <div className="file-upload-text">
                  <p className="file-name">
                    {uploadFile ? `Selected: ${uploadFile.name}` : 'Upload HTML file'}
                  </p>
                  <p className="file-hint">Accepted: .html, .ejs, .jsx, .js, .txt</p>
                </div>
                <div className="file-browse-btn">Browse</div>
                <input
                  className="file-input-hidden"
                  type="file"
                  accept=".html,.ejs,.jsx,.js,.txt"
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