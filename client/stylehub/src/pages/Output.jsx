import { useState, useEffect, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import Header from "../components/Header"
import Footer from "../components/Footer"

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
      if (!baseHtml) {
        throw new Error("No initial HTML to preview. Please submit input first.")
      }

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
    if (!previewHtml) {
      loadPreview()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Header />
      <div>
        <h1>Output page</h1>

      <div role="group" aria-label="Preview view mode">
        <button type="button" onClick={() => setViewMode("laptop")}>
          Laptop
        </button>
        <button type="button" onClick={() => setViewMode("mobile")}>
          Mobile
        </button>

        <button type="button" onClick={loadPreview} disabled={loadingPreview}>
          {loadingPreview ? "Loading..." : "Reset Preview"}
        </button>
      </div>

      {error ? <div>{error}</div> : null}
      {statusMessage ? <div>{statusMessage}</div> : null}

      <div>
        <div>
          <div>Preview</div>
          <div>{viewMode === "mobile" ? "Mobile viewport" : "Laptop viewport"}</div>
        </div>

        <div
          style={{
            display: "inline-block",
            padding: "16px",
            border: "2px solid #333",
            borderRadius: "12px",
            backgroundColor: "#f7f7f7",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              marginBottom: "8px",
              fontSize: "0.85rem",
              color: "#444",
              textAlign: "center",
            }}
          >
            {viewMode === "mobile" ? "Phone preview" : "Laptop preview"}
          </div>

          <iframe
            title="HTML Preview"
            srcDoc={previewHtml || "<!doctype html><html><body></body></html>"}
            width={Math.min(previewDimensions.width, 1200)}
            height={previewDimensions.height}
            style={{
              border: "1px solid #888",
              borderRadius: "8px",
              maxWidth: "100%",
              minWidth: "320px",
              width: `${previewDimensions.width}px`,
              transition: "width 0.2s ease, height 0.2s ease",
              background: "white",
            }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="output-suggestions">Further suggestions</label>
        <textarea
          id="output-suggestions"
          value={suggestions}
          onChange={(e) => setSuggestions(e.target.value)}
          placeholder="Add extra styling or adjustments you'd like applied to the output."
        />

        <div>
          <button
            type="button"
            onClick={handleAdjust}
            disabled={loadingAdjust || !previewHtml}
          >
            {loadingAdjust ? "Improving..." : "Improve"}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!previewHtml}
          >
            Continue
          </button>
        </div>
      </div>
      </div>
      <Footer />
    </>
  )
}

export default Output