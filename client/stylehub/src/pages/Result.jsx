import axios from 'axios'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DottedSurface from '../components/DottedSurface'

function extractCssFromHtml(html) {
  if (!html) return ''

  // Collect inline <style> blocks. If your backend returns CSS separately,
  // prefer using that instead of extracting.
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

    if (!canDownload) {
      setError('Missing final HTML. Please go back and generate a result first.')
      return
    }

    if (!uploadFile) {
      setError('Please choose an HTML file to restyle.')
      return
    }

    setIsSubmitting(true)
    try {
      // Read the uploaded file as text
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

      // The /repeat endpoint returns plain HTML text, not JSON
      const newHtml = typeof response.data === 'string' ? response.data : ''

      if (!newHtml || newHtml.trim().length === 0) {
        throw new Error('Server response did not include updated HTML.')
      }

      navigate('/output', {
        replace: true,
        state: {
          result: newHtml
        },
      })
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Restyle request failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleDownloadHtml() {
    if (!canDownload) return
    const htmlToDownload = (convertedHtml || finalHtmlFromState || '').trim()
    if (!htmlToDownload) {
      setError('Final HTML is empty; cannot download.')
      return
    }
    downloadTextFile('final.html', htmlToDownload, 'text/html;charset=utf-8')
  }

  const htmlButtonLabel = convertedHtml ? 'Download HTML' : 'Download as single file'

  async function handleDownloadCss() {
    if (!canDownload) {
      setError('Final HTML is missing; cannot generate CSS.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const res = await axios.post(`${backendBaseUrl}/file`, {
        html: finalHtmlFromState,
      })

      const { cssContent, htmlContent } = res.data || {}

      if (!cssContent) {
        throw new Error('Backend /file did not return CSS content.')
      }

      if (htmlContent) {
        setConvertedHtml(htmlContent)
      }
      setConvertedCss(cssContent)

      downloadTextFile('styles.css', cssContent, 'text/css;charset=utf-8')
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to generate CSS through backend.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleStartOver() {
    // “Clearing all data” here means: return to the home route without passing any state.
    navigate('/input', { replace: true })
  }

  return (
    <>
    <DottedSurface theme="dark">
      <Header />
      <div style={{ padding: 20 }}>
        <h1>Final result</h1>

      {!canDownload ? (
        <div style={{ color: 'crimson' }}>
          Final HTML is missing. Generate a result first, then come back here.
        </div>
      ) : null}

      <section style={{ marginTop: 16 }}>
        <h2>Downloads</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" onClick={handleDownloadHtml} disabled={!canDownload || isSubmitting}>
            {isSubmitting ? <><Spinner />Downloading</> : htmlButtonLabel}
          </button>
          <button type="button" onClick={handleDownloadCss} disabled={!canDownload || isSubmitting}>
            {isSubmitting ? <><Spinner />Processing CSS</> : 'Download CSS separately'}
          </button>
        </div>
        {finalCss ? (
          <div style={{ marginTop: 16 }}>
            <h3>Generated CSS Preview</h3>
            <pre style={{ maxHeight: 220, overflow: 'auto', background: '#f6f6f6', padding: 12 }}>
              {finalCss}
            </pre>
          </div>
        ) : null}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Restyle again</h2>
        <p style={{ marginTop: 6 }}>
          Upload a new HTML file and submit it along with your current HTML to generate a new styled webpage.
        </p>

        <form onSubmit={handleRestyleSubmit} style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520 }}>
            <label>
              Upload HTML file
              <input
                style={{ display: 'block', marginTop: 6 }}
                type="file"
                accept=".html,.ejs,.jsx,.js,.txt"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                disabled={isSubmitting}
              />
            </label>

            <button type="submit" disabled={isSubmitting || !uploadFile || !canDownload}>
              {isSubmitting ? 'Generating…' : 'Submit & Generate New Styling'}
            </button>
          </div>
        </form>

        {error ? (
          <div style={{ color: 'crimson', marginTop: 10 }}>
            {error}
          </div>
        ) : null}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Start over</h2>
        <button type="button" onClick={handleStartOver}>
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
