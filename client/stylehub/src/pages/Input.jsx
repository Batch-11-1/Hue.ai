
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DottedSurface from '../components/DottedSurface'

function Input() {
  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [selectedLayout, setSelectedLayout] = useState(null)
  const [colors, setColors] = useState(['#323233', '#eeeeee'])
  const [selectedFont, setSelectedFont] = useState('Inter, system-ui, sans-serif')
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
    { id: 'serif', label: 'Serif', css: 'serif' },
    { id: 'sans-serif', label: 'Sans Serif', css: 'system-ui, sans-serif' },
    { id: 'monospace', label: 'Monospace', css: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
    { id: 'script', label: 'Script', css: '"Brush Script MT", "Lucida Handwriting", cursive' },
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

    if (!file) {
      setError('Please upload a file before continuing.')
      return
    }

    if (!selectedLayout) {
      setError('Please choose a layout.')
      return
    }

    if (!selectedFont) {
      setError('Please choose a font.')
      return
    }

    try {
      setIsSubmitting(true)

      // Read the file content
      const htmlContent = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsText(file)
      })

      const payload = {
        html: htmlContent,
        layout: selectedLayout,
        colorScheme: colors,
        fontStyle: selectedFont,
      }

      const response = await axios.post(`${backendBaseUrl}/initiate`, payload)

      navigate('/output', {
        state: {
          result: response.data
        },
      })
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
      <div>
        <form onSubmit={handleSubmit}>
        <header>
          <p>
            Stylehub AI
          </p>
          <h1>
            Upload your page & design preferences
          </h1>
          <p>
            Provide your page file and a few quick choices so the AI can
            understand the layout, color system, and typography you have in
            mind.
          </p>
        </header>

        {/* File upload */}
        <section>
          <h2>
            1. Upload your file
          </h2>
          <p>
            Accepted formats: <code>.html</code>, <code>.ejs</code>,{' '}
            <code>.jsx</code>
          </p>

          <label>
            <div>
              <p>
                {file ? `Selected: ${file.name}` : 'Click to upload a page file'}
              </p>
              <p>
                The file is sent securely to the AI for analysis only when you
                submit.
              </p>
            </div>
            <div>
              Browse file
            </div>
            <input
              type="file"
              accept=".html,.ejs,.jsx"
              onChange={handleFileChange}
            />
          </label>
        </section>

        {/* Layout selection */}
        <section>
          <h2>
            2. Which layout do you want to use?
          </h2>
          <p>
            Choose the structure that best matches how you want your page
            arranged.
          </p>

          <div>
            {layoutOptions.map((layout) => {
              const isActive = selectedLayout === layout.id
              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => setSelectedLayout(layout.id)}
                  aria-pressed={isActive}
                >
                  <img src={layout.image} alt={layout.title} />
                  <p>{layout.title}</p>
                </button>
              )
            })}
          </div>
        </section>

        {/* Color scheme */}
        <section>
          <h2>
            3. Which color scheme should we use?
          </h2>
          <p>
            Pick up to four key colors for your brand or page.
          </p>

          <div>
            {colors.map((value, index) => (
              <div key={index}>
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddColor}
            disabled={colors.length >= 4}
          >
            <span>
              +
            </span>
            Add color
          </button>
        </section>

        {/* Font selection */}
        <section>
          <h2>
            4. Which font group should we use?
          </h2>
          <p>
            Choose a primary font group.
          </p>

          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
          >
            {fontOptions.map((font) => (
              <option key={font.id} value={font.css}>
                {font.label}
              </option>
            ))}
          </select>

          <div>
            {fontOptions.map((font) => {
              const isActive = selectedFont === font.css
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => setSelectedFont(font.css)}
                  aria-pressed={isActive}
                  style={{
                    fontFamily: font.css,
                    border: isActive ? '2px solid #007BFF' : '1px solid #ccc',
                    padding: '0.5rem',
                    margin: '0.25rem',
                    textAlign: 'left',
                    background: isActive ? '#e7f1ff' : '#fff'
                  }}
                >
                  <p>
                    {font.label}
                  </p>
                  <p>
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </button>
              )
            })}
          </div>
          
        </section>

        {error && (
          <p>
            {error}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span />
            )}
            {isSubmitting ? 'Processing with AI…' : 'Generate output'}
          </button>

          {isSubmitting && (
            <p>
              Processing your layout and design choices.
            </p>
          )}
        </div>
      </form>
      </div>
      <Footer />
      </DottedSurface>
    </>
  )
}

export default Input
