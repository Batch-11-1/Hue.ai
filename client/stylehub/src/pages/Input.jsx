/*In this page the user should be able to upload an html/ejs/jsx file.
Then there should be 3 questions that the user should answer to help the AI understand the design of the page. The questions are:
1. which layout want to use? There should be cards that the user can choose from. The cards should have a title and a diagram of the layout.
2. which color scheme to use? There should be option to choose upto 4 colors as the color scheme of the site. There should be a color selector and a plus button if the user wants to add more colors.
3. which font to use? There should be a dropdown menu with different font options. The user should be able to see a preview of the font before selecting it.
The layout images are in src/assets/pagelayouts folder

Once selected there should be an axios request to backend(for now use a dummy endpoint) to send the file and the answers to the questions. Once the response is received the user should be redirected to the output page along with the response data.

While waiting for the response there should be a loading animation to indicate that the AI is processing the request.
*/
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Input() {
  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [selectedLayout, setSelectedLayout] = useState(null)
  const [colors, setColors] = useState(['#4f46e5', '#f97316'])
  const [selectedFont, setSelectedFont] = useState('Inter, system-ui, sans-serif')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

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
    setColors([...colors, '#22c55e'])
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

      const formData = new FormData()
      formData.append('file', file)
      formData.append('layout', selectedLayout)
      formData.append('colors', JSON.stringify(colors))
      formData.append('font', selectedFont)

      // TODO: replace with real backend endpoint
      const response = await axios.post('/api/analyze-layout', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      navigate('/output', {
        state: {
          result: response.data,
          layout: selectedLayout,
          colors,
          font: selectedFont,
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
            4. Which font style should we use?
          </h2>
          <p>
            Choose a primary font. Preview each style below before you commit.
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
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => setSelectedFont(font.css)}
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
              The AI is analyzing your layout and design choices.
            </p>
          )}
        </div>
      </form>
      </div>
      <Footer />
    </>
  )
}

export default Input
