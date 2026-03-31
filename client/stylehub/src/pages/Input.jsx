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
import '../App.css'

function Input() {
  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [selectedLayout, setSelectedLayout] = useState(null)
  const [colors, setColors] = useState(['#4f46e5', '#f97316'])
  const [selectedFont, setSelectedFont] = useState('Inter, system-ui, sans-serif')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const layoutOptions = [
    {
      id: 'single-column',
      title: 'Single Column',
      description: 'Centered content with one main column.',
    },
    {
      id: 'sidebar-left',
      title: 'Sidebar Left',
      description: 'Navigation/sidebar on the left, content on the right.',
    },
    {
      id: 'sidebar-right',
      title: 'Sidebar Right',
      description: 'Content on the left, sidebar on the right.',
    },
    {
      id: 'hero-grid',
      title: 'Hero + Grid',
      description: 'Large hero section with a grid of cards below.',
    },
  ]

  const fontOptions = [
    { id: 'inter', label: 'Inter', css: 'Inter, system-ui, sans-serif' },
    { id: 'roboto', label: 'Roboto', css: 'Roboto, system-ui, sans-serif' },
    { id: 'playfair', label: 'Playfair Display', css: '"Playfair Display", serif' },
    { id: 'poppins', label: 'Poppins', css: 'Poppins, system-ui, sans-serif' },
    { id: 'mono', label: 'JetBrains Mono', css: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
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
    <div>
      <h1>Upload your page & design preferences</h1>

      <form onSubmit={handleSubmit}>
        {/* File upload */}
        <section>
          <h2>1. Upload your file</h2>
          <p>Accepted formats: .html, .ejs, .jsx</p>

          <label>
            <div>
              <p>{file ? `Selected: ${file.name}` : 'Click to upload a file'}</p>
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
          <h2>2. Which layout do you want to use?</h2>
          <p>Choose the structure that best matches how you want your page arranged.</p>

          {layoutOptions.map((layout) => (
            <div key={layout.id}>
              <label>
                <input
                  type="radio"
                  name="layout"
                  value={layout.id}
                  checked={selectedLayout === layout.id}
                  onChange={() => setSelectedLayout(layout.id)}
                />
                <strong>{layout.title}</strong> - {layout.description}
              </label>
            </div>
          ))}
        </section>

        {/* Color scheme */}
        <section>
          <h2>3. Which color scheme should we use?</h2>
          <p>Pick up to 4 key colors for your brand or page.</p>

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

          <button
            type="button"
            onClick={handleAddColor}
            disabled={colors.length >= 4}
          >
            Add color
          </button>
        </section>

        {/* Font selection */}
        <section>
          <h2>4. Which font style should we use?</h2>
          <p>Choose a primary font.</p>

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

          <p>Font preview:</p>
          <p style={{ fontFamily: selectedFont }}>
            The quick brown fox jumps over the lazy dog.
          </p>
        </section>

        {error && <p>{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Processing with AI…' : 'Generate output'}
        </button>

        {isSubmitting && <p>Loading... The AI is analyzing your layout and design choices.</p>}
      </form>
    </div>
  )
}

export default Input
