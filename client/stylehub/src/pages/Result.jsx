/*
This page will have 4 main actions.
1-This page will recieve a final html code as a prop and should have a button to download the html file.
2-There should be another button to download the css file seperately.
3-The next section should have another file upload option to repeat the styling with a submit button to send a new html file along with the current html code to the server to generate a new styled webpage. The response data should be passed to the Output page as a prop to update the preview and the html code.
4-There should be a button to start over the styling by redirecting the user to the home page and clearing all the data.
*/
import '../App.css'
import axios from 'axios'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const RESTYLE_ENDPOINT = 'http://localhost:3001/api/restyle' // TODO: change to your backend route

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

function Result() {
  const navigate = useNavigate()
  const location = useLocation()

  const finalHtmlFromState = location.state?.finalHtml || location.state?.html || location.state?.htmlCode
  const finalCssFromState = location.state?.finalCss || location.state?.css

  const [uploadFile, setUploadFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const finalCss = useMemo(() => {
    if (finalCssFromState) return finalCssFromState
    return extractCssFromHtml(finalHtmlFromState)
  }, [finalCssFromState, finalHtmlFromState])

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
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('htmlCode', finalHtmlFromState)

      const response = await axios.post(RESTYLE_ENDPOINT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const data = response.data || {}
      const newHtml =
        data.finalHtml ||
        data.html ||
        data.htmlCode ||
        data.updatedHtml ||
        data.resultHtml ||
        data.newHtml ||
        ''
      const newCss = data.finalCss || data.css || data.updatedCss || ''

      if (!newHtml) {
        throw new Error('Server response did not include updated HTML.')
      }

      navigate('/output', {
        replace: true,
        state: {
          finalHtml: newHtml,
          finalCss: newCss,
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
    downloadTextFile('final.html', finalHtmlFromState, 'text/html;charset=utf-8')
  }

  function handleDownloadCss() {
    const css = (finalCss || '').trim()
    if (!css) {
      setError('No CSS found to download (expected <style> blocks or `finalCss` from the server).')
      return
    }
    downloadTextFile('styles.css', css, 'text/css;charset=utf-8')
  }

  function handleStartOver() {
    // “Clearing all data” here means: return to the home route without passing any state.
    navigate('/', { replace: true })
  }

  return (
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
          <button type="button" onClick={handleDownloadHtml} disabled={!canDownload}>
            Download HTML
          </button>
          <button type="button" onClick={handleDownloadCss} disabled={!canDownload}>
            Download CSS
          </button>
        </div>
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
  )
}

export default Result
