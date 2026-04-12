import { useState, useEffect, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import Header from "../components/Navbar.jsx"
import Footer from "../components/Footer"
import DottedSurface from '../components/DottedSurface'
import { WaitAnimation } from '../components/WaitAnimation'
import '../styles/Output.css'

function Output() {
  const location = useLocation()
  const navigate = useNavigate()
  const resultData = location?.state?.result

  const backendBaseUrl = useMemo(() => {
    const fromEnv = import.meta.env.VITE_BACKEND_BASE_URL
    const base = fromEnv || 'http://localhost:3000'
    return String(base).replace(/\/$/, '')
  }, [])

  const extractHtml = (data) => {
    if (!data) return ""
    if (typeof data === "string") return data
    if (typeof data?.html === "string") return data.html
    if (typeof data?.previewHtml === "string") return data.previewHtml
    if (typeof data?.result === "string") return data.result
    if (typeof data?.file === "string") return data.file
    if (typeof data?.data?.html === "string") return data.data.html
    if (typeof data?.data?.previewHtml === "string") return data.data.previewHtml
    return ""
  }

  const initialPreviewHtml = useMemo(() => extractHtml(resultData), [resultData])
  const [viewMode, setViewMode] = useState("laptop")
  const [previewHtml, setPreviewHtml] = useState(initialPreviewHtml)
  const [baseHtml, setBaseHtml] = useState(initialPreviewHtml)
  const [suggestions, setSuggestions] = useState("")
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [loadingAdjust, setLoadingAdjust] = useState(false)
  const [error, setError] = useState(null)
  const [statusMessage, setStatusMessage] = useState("")

  const previewDimensions = viewMode === "mobile"
    ? { width: 375, height: 667 }
    : { width: 1200, height: 700 }

  const loadPreview = async () => {
    setError(null)
    setStatusMessage("")
    setLoadingPreview(true)
    try {
      if (!baseHtml) throw new Error("No initial HTML to preview. Please submit input first.")
      setPreviewHtml(baseHtml)
      setStatusMessage("Preview loaded from provided result data.")
    } catch (e) {
      setError(e?.message || "Failed to load preview.")
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleAdjust = async () => {
    setError(null)
    setStatusMessage("")
    if (!previewHtml) return
    setLoadingAdjust(true)
    try {
      const adjustUrl = `${backendBaseUrl}/adjust`
      const res = await axios.post(adjustUrl, {
        html: previewHtml,
        suggestion: suggestions || "Make the design more visually appealing and modern, with improved typography, spacing, and color scheme. Keep the layout and content structure the same, but enhance the overall aesthetics."
      })
      const html = extractHtml(res.data)
      if (!html) throw new Error("Adjust endpoint did not return HTML.")
      setPreviewHtml(html)
      setBaseHtml(html)
      setStatusMessage("Adjustment applied.")
    } catch (e) {
      setError(e?.message || "Failed to adjust preview.")
    } finally {
      setLoadingAdjust(false)
    }
  }

  const handleConfirm = () => {
    if (!previewHtml) return
    setError(null)
    setStatusMessage("Finalized.")
    navigate('/result', { state: { html: previewHtml } })
  }

  useEffect(() => {
    if (!previewHtml) loadPreview()
  }, [])

  return (
    <>
      <DottedSurface theme="dark">
        <Header />

        <div className="output-page">

          {/* Page title */}
          <div className="output-hero">
            <p className="output-eyebrow">HUE.ai AI</p>
            <h1 className="output-title">Output page</h1>
          </div>

          {/* Toolbar */}
          <div className="output-toolbar" role="group" aria-label="Preview view mode">
            <div className="view-toggle">
              <button
                type="button"
                className={`btn-toggle ${viewMode === "laptop" ? "btn-toggle--active" : ""}`}
                onClick={() => setViewMode("laptop")}
              >
                Laptop
              </button>
              <button
                type="button"
                className={`btn-toggle ${viewMode === "mobile" ? "btn-toggle--active" : ""}`}
                onClick={() => setViewMode("mobile")}
              >
                Mobile
              </button>
            </div>

            <button
              type="button"
              className="btn-ghost"
              onClick={loadPreview}
              disabled={loadingPreview}
            >
              {loadingPreview ? <span className="spinner" /> : null}
              {loadingPreview ? "Loading..." : "Reset Preview"}
            </button>
          </div>

          {/* Status / Error banners */}
          {error
            ? <div className="banner banner--error">{error}</div>
            : null}
          {statusMessage
            ? <div className="banner banner--success">{statusMessage}</div>
            : null}

          {/* Preview frame */}
          <div className="preview-section">
            <div className="preview-header">
              <span className="preview-label">Preview</span>
              <span className="preview-viewport">
                {viewMode === "mobile" ? "Mobile viewport" : "Laptop viewport"}
              </span>
            </div>

            {(loadingPreview || loadingAdjust) && (
              <div className="loading-overlay">
                <div className="loading-spinner-container">
                  <WaitAnimation />
                  <p className="loading-text">{loadingPreview ? 'Loading preview…' : 'Improving design…'}</p>
                </div>
              </div>
            )}

            <div className="preview-shell">
              <div className="preview-bar">
                <span className="preview-dot" />
                <span className="preview-dot" />
                <span className="preview-dot" />
                <span className="preview-bar-label">
                  {viewMode === "mobile" ? "Phone preview" : "Laptop preview"}
                </span>
              </div>

              <iframe
                title="HTML Preview"
                srcDoc={previewHtml || "<!doctype html><html><body></body></html>"}
                width={Math.min(previewDimensions.width, 1200)}
                height={previewDimensions.height}
                className="preview-iframe"
                style={{
                  width: `${Math.min(previewDimensions.width, 1200)}px`,
                  height: `${previewDimensions.height}px`,
                }}
              />
            </div>
          </div>

          {/* Suggestions + actions */}
          <div className="adjust-section">
            <label className="adjust-label" htmlFor="output-suggestions">
              Further suggestions
            </label>
            <textarea
              id="output-suggestions"
              className="adjust-textarea"
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="Add extra styling or adjustments you'd like applied to the output."
            />

            <div className="adjust-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAdjust}
                disabled={loadingAdjust || !previewHtml}
              >
                {loadingAdjust ? <span className="spinner" /> : null}
                {loadingAdjust ? "Improving..." : "Improve"}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirm}
                disabled={!previewHtml}
              >
                Continue
              </button>
            </div>
          </div>

        </div>

        <Footer />
      </DottedSurface>
    </>
  )
}

export default Output