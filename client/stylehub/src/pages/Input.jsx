import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Navbar.jsx'
import Footer from '../components/Footer'
import DottedSurface from '../components/DottedSurface'
import { WaitAnimation } from '../components/WaitAnimation'
import '../styles/Input.css'

function Input() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [selectedLayout, setSelectedLayout] = useState(null)
  const [colors, setColors] = useState(['#323233', '#eeeeee'])
  const [selectedFont, setSelectedFont] = useState(
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const backendBaseUrl = useMemo(() => {
    const fromEnv = import.meta.env.VITE_BACKEND_BASE_URL
    const base = fromEnv || 'http://localhost:3000'
    return String(base).replace(/\/$/, '')
  }, [])

  const layoutOptions = [
    { id: 'assymetricallayout', title: 'assymetricallayout', image: new URL('../assets/pagelayouts/assymetricallayout.jpeg', import.meta.url).href },
    { id: 'cardlayout', title: 'cardlayout', image: new URL('../assets/pagelayouts/cardlayout.jpeg', import.meta.url).href },
    { id: 'f-shapelayout', title: 'f-shapelayout', image: new URL('../assets/pagelayouts/f-shapelayout.jpeg', import.meta.url).href },
    { id: 'featuredimagelayout', title: 'featuredimagelayout', image: new URL('../assets/pagelayouts/featuredimagelayout.jpeg', import.meta.url).href },
    { id: 'interactivelayout', title: 'interactivelayout', image: new URL('../assets/pagelayouts/interactivelayout.jpeg', import.meta.url).href },
    { id: 'magazinelayout', title: 'magazinelayout', image: new URL('../assets/pagelayouts/magazinelayout.jpeg', import.meta.url).href },
    { id: 'masonrylayout', title: 'masonrylayout', image: new URL('../assets/pagelayouts/masonrylayout.jpeg', import.meta.url).href },
    { id: 'splitscreenlayout', title: 'splitscreenlayout', image: new URL('../assets/pagelayouts/splitscreenlayout.jpeg', import.meta.url).href },
    { id: 'twocolumnlayout', title: 'twocolumnlayout', image: new URL('../assets/pagelayouts/twocolumnlayout.jpeg', import.meta.url).href },
    { id: 'z-shapelayout', title: 'z-shapelayout', image: new URL('../assets/pagelayouts/z-shapelayout.jpeg', import.meta.url).href },
  ]

  const fontOptions = [
    { id: 'system-sans', label: 'System sans', css: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
    { id: 'arial-sans', label: 'Arial / Helvetica', css: 'Arial, Helvetica, sans-serif' },
    { id: 'georgia-serif', label: 'Georgia / Times', css: 'Georgia, Cambria, "Times New Roman", Times, serif' },
    { id: 'verdana', label: 'Verdana / Geneva', css: 'Verdana, Geneva, sans-serif' },
    { id: 'trebuchet', label: 'Trebuchet MS', css: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", sans-serif' },
    { id: 'monospace', label: 'Monospace', css: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
    { id: 'inter', label: 'Inter', css: '"Inter", system-ui, sans-serif' },
    { id: 'roboto', label: 'Roboto', css: '"Roboto", sans-serif' },
    { id: 'open-sans', label: 'Open Sans', css: '"Open Sans", sans-serif' },
    { id: 'lato', label: 'Lato', css: '"Lato", sans-serif' },
    { id: 'poppins', label: 'Poppins', css: '"Poppins", sans-serif' },
    { id: 'dm-sans', label: 'DM Sans', css: '"DM Sans", sans-serif' },
    { id: 'merriweather', label: 'Merriweather', css: '"Merriweather", Georgia, serif' },
    { id: 'playfair', label: 'Playfair Display', css: '"Playfair Display", Georgia, serif' },
    { id: 'libre-baskerville', label: 'Libre Baskerville', css: '"Libre Baskerville", Georgia, serif' },
  ]

  const handleFileChange = (e) => {
    const uploaded = e.target.files?.[0]
    setFile(uploaded || null)
    setError('')
  }

  const handleAddColor = () => {
    if (colors.length >= 4) return
    setColors([...colors, '#ff11d7'])
  }

  const handleColorChange = (index, value) => {
    const next = [...colors]
    next[index] = value
    setColors(next)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!file) { setError('Please upload a file before continuing.'); return }
    if (!selectedLayout) { setError('Please choose a layout.'); return }
    if (!selectedFont) { setError('Please choose a font.'); return }
    try {
      setIsSubmitting(true)
      const htmlContent = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsText(file)
      })
      const payload = { html: htmlContent, layout: selectedLayout, colorScheme: colors, fontStyle: selectedFont }
      const response = await axios.post(`${backendBaseUrl}/initiate`, payload)
      navigate('/output', { state: { result: response.data } })
    } catch (err) {
      console.error(err)
      setError('Something went wrong while processing your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <DottedSurface theme="dark">
        <Header />
        <div className="input-page">
          <form className="input-form" onSubmit={handleSubmit}>

            <header className="input-hero">
              <p className="input-eyebrow">HUE.ai AI</p>
              <h1 className="input-title">Upload your page & design preferences</h1>
              <p className="input-subtitle">
                Provide your page file and a few quick choices so the AI can
                understand the layout, color system, and typography you have in mind.
              </p>
            </header>

            {/* File upload */}
            <section className="input-section">
              <h2 className="section-title">1. Upload your file</h2>
              <p className="section-desc">
                Accepted formats: <code className="code-tag">.html</code>, <code className="code-tag">.ejs</code>, <code className="code-tag">.jsx</code>
              </p>
              <label className="file-upload-label">
                <div className="file-upload-text">
                  <p className="file-name">{file ? `Selected: ${file.name}` : 'Click to upload a page file'}</p>
                  <p className="file-hint">The file is sent securely to the AI for analysis only when you submit.</p>
                </div>
                <div className="file-browse-btn">Browse file</div>
                <input className="file-input-hidden" type="file" accept=".html,.ejs,.jsx" onChange={handleFileChange} />
              </label>
            </section>

            {/* Layout selection */}
            <section className="input-section">
              <h2 className="section-title">2. Which layout do you want to use?</h2>
              <p className="section-desc">Choose the structure that best matches how you want your page arranged.</p>
              <div className="layout-grid">
                {layoutOptions.map((layout) => {
                  const isActive = selectedLayout === layout.id
                  return (
                    <button
                      key={layout.id}
                      type="button"
                      className={`layout-card ${isActive ? 'layout-card--active' : ''}`}
                      onClick={() => setSelectedLayout(layout.id)}
                      aria-pressed={isActive}
                    >
                      <img className="layout-img" src={layout.image} alt={layout.title} />
                      <p className="layout-label">{layout.title}</p>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Color scheme */}
            <section className="input-section">
              <h2 className="section-title">3. Which color scheme should we use?</h2>
              <p className="section-desc">Pick up to four key colors for your brand or page.</p>
              <div className="color-row">
                {colors.map((value, index) => (
                  <div className="color-swatch" key={index}>
                    <input className="color-picker" type="color" value={value} onChange={(e) => handleColorChange(index, e.target.value)} />
                    <input className="color-hex" type="text" value={value} onChange={(e) => handleColorChange(index, e.target.value)} />
                  </div>
                ))}
              </div>
              <button className="btn-add-color" type="button" onClick={handleAddColor} disabled={colors.length >= 4}>
                <span>+</span> Add color
              </button>
            </section>

            {/* Font selection */}
            <section className="input-section">
              <h2 className="section-title">4. Which font group should we use?</h2>
              <p className="section-desc">Choose a primary font group.</p>
              <select className="font-select" value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
                {fontOptions.map((font) => (
                  <option key={font.id} value={font.css}>{font.label}</option>
                ))}
              </select>
              <div className="font-grid">
                {fontOptions.map((font) => {
                  const isActive = selectedFont === font.css
                  return (
                    <button
                      key={font.id}
                      type="button"
                      className={`font-card ${isActive ? 'font-card--active' : ''}`}
                      onClick={() => setSelectedFont(font.css)}
                      aria-pressed={isActive}
                      style={{ fontFamily: font.css }}
                    >
                      <p className="font-card-label">{font.label}</p>
                      <p className="font-card-preview">The quick brown fox jumps over the lazy dog.</p>
                    </button>
                  )
                })}
              </div>
            </section>

            {error && <p className="error-msg">{error}</p>}

            {isSubmitting && (
              <div className="loading-overlay">
                <div className="loading-spinner-container">
                  <WaitAnimation />
                  <p className="loading-text">Processing with AI…</p>
                  <p className="loading-hint">Processing your layout and design choices.</p>
                </div>
              </div>
            )}

            <div className="submit-row">
              <button className="btn-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing with AI…' : 'Generate output'}
              </button>
            </div>

          </form>
        </div>
        <Footer />
      </DottedSurface>
    </>
  )
}

export default Input