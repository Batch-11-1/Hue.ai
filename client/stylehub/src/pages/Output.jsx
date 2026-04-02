/*This page should display the html code passed to it and render the styled webpage as a preview. The preview should be resizeable. The page should have a text area to give further suggestions to the AI model with enough instructions alongside and a button to submit. The button should send the suggestion to server using axios along with the current html code. Once the response is received, the page should update the preview with the new html code.
There should also be a button to finalize the style that redirects the user to result page along with the final html code as a prop.
*/
import "../App.css"

function Output() {
  // Assumptions based on your description:
  // - `/preview` returns raw HTML (as a string) for iframe preview.
  // - `/adjust` returns updated raw HTML based on user suggestions.
  // - `/file` confirms/saves the current HTML.
  //
  // Current backend controllers are placeholders in this repo; the UI is
  // implemented to match the intended behavior.

  const location = useLocation()
  const initialHtml = typeof location?.state?.html === "string" ? location.state.html : ""

  const API_BASE_URL =
    (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim()) ||
    "http://localhost:3000"

  const [viewMode, setViewMode] = useState("laptop")
  const [previewHtml, setPreviewHtml] = useState(initialHtml)
  const [suggestions, setSuggestions] = useState("")

  const [loadingPreview, setLoadingPreview] = useState(false)
  const [loadingAdjust, setLoadingAdjust] = useState(false)
  const [loadingConfirm, setLoadingConfirm] = useState(false)

  const [error, setError] = useState(null)
  const [statusMessage, setStatusMessage] = useState("")

  const extractHtml = (data) => {
    if (!data) return ""
    if (typeof data === "string") return data
    if (typeof data?.html === "string") return data.html
    if (typeof data?.previewHtml === "string") return data.previewHtml
    if (typeof data?.file === "string") return data.file
    return ""
  }

  const previewHeight = viewMode === "mobile" ? 667 : 700

  const loadPreview = async () => {
    setError(null)
    setStatusMessage("")
    setLoadingPreview(true)

    try {
      const previewUrl = `${API_BASE_URL}/preview`

      let res
      // Your description says "axios get request"; backend route is `post`.
      // Try GET first, then fallback to POST.
      try {
        res = await axios.get(previewUrl)
      } catch {
        res = await axios.post(previewUrl, {})
      }

      const html = extractHtml(res.data)
      if (!html) throw new Error("Preview endpoint did not return HTML.")
      setPreviewHtml(html)
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
      const adjustUrl = `${API_BASE_URL}/adjust`
      const res = await axios.post(adjustUrl, {
        html: previewHtml,
        suggestions,
        adjustment: suggestions, // extra key for compatibility
      })

      const html = extractHtml(res.data)
      if (!html) throw new Error("Adjust endpoint did not return HTML.")
      setPreviewHtml(html)
      setStatusMessage("Adjustment applied.")
    } catch (e) {
      setError(e?.message || "Failed to adjust preview.")
    } finally {
      setLoadingAdjust(false)
    }
  }

  const handleConfirm = async () => {
    setError(null)
    setStatusMessage("")
    if (!previewHtml) return

    setLoadingConfirm(true)
    try {
      const fileUrl = `${API_BASE_URL}/file`
      const res = await axios.post(fileUrl, { html: previewHtml })
      const msg =
        typeof res.data === "string" ? res.data : res.data?.message || "Confirmed."
      setStatusMessage(msg)
    } catch (e) {
      setError(e?.message || "Failed to confirm file.")
    } finally {
      setLoadingConfirm(false)
    }
  }

  useEffect(() => {
    if (initialHtml) return
    loadPreview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
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
          {loadingPreview ? "Loading..." : "Refresh Preview"}
        </button>
      </div>

      {error ? <div>{error}</div> : null}
      {statusMessage ? <div>{statusMessage}</div> : null}

      <div>
        <div>
          <div>Preview</div>
          <div>{viewMode === "mobile" ? "Mobile viewport" : "Laptop viewport"}</div>
        </div>

        <iframe
          title="HTML Preview"
          srcDoc={previewHtml || "<!doctype html><html><body></body></html>"}
          width="100%"
          height={previewHeight}
          frameBorder="0"
        />
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
            {loadingAdjust ? "Adjusting..." : "Adjust"}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loadingConfirm || !previewHtml}
          >
            {loadingConfirm ? "Confirming..." : "Confirm"}
          </button>
        </div>

        <div>
          Tip: use the mobile/laptop toggle to preview layout changes at different sizes.
        </div>
      </div>
    </div>
  )
}

export default Output