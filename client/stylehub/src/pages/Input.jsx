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

  const renderLayoutDiagram = (layoutId) => {
    switch (layoutId) {
      case 'single-column':
        return (
          <div
            style={{
              width: '100%',
              height: '72px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background:
                'linear-gradient(to bottom, #e5e7eb 24px, #ffffff 24px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div style={{ flex: '0 0 24px', backgroundColor: '#e5e7eb' }} />
            <div style={{ flex: 1, padding: '8px 10px' }}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '6px',
                  border: '1px dashed #cbd5f5',
                  background:
                    'repeating-linear-gradient(135deg,#e0e7ff,#e0e7ff 4px,#eef2ff 4px,#eef2ff 8px)',
                }}
              />
            </div>
          </div>
        )
      case 'sidebar-left':
        return (
          <div
            style={{
              width: '100%',
              height: '72px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '28%',
                background:
                  'repeating-linear-gradient(135deg,#e5e7eb,#e5e7eb 4px,#f3f4f6 4px,#f3f4f6 8px)',
              }}
            />
            <div style={{ flex: 1, padding: '8px 10px' }}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '6px',
                  border: '1px dashed #cbd5f5',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
          </div>
        )
      case 'sidebar-right':
        return (
          <div
            style={{
              width: '100%',
              height: '72px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            <div style={{ flex: 1, padding: '8px 10px' }}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '6px',
                  border: '1px dashed #cbd5f5',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
            <div
              style={{
                width: '28%',
                background:
                  'repeating-linear-gradient(135deg,#e5e7eb,#e5e7eb 4px,#f3f4f6 4px,#f3f4f6 8px)',
              }}
            />
          </div>
        )
      case 'hero-grid':
      default:
        return (
          <div
            style={{
              width: '100%',
              height: '72px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              padding: '6px 8px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '24px',
                borderRadius: '5px',
                background:
                  'repeating-linear-gradient(135deg,#e0e7ff,#e0e7ff 4px,#eef2ff 4px,#eef2ff 8px)',
              }}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                gap: '4px',
                flex: 1,
              }}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  style={{
                    borderRadius: '4px',
                    border: '1px dashed #cbd5f5',
                    backgroundColor: '#ffffff',
                  }}
                />
              ))}
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '2.5rem 1.5rem',
          background:
            'radial-gradient(circle at top left, #eef2ff 0, #ffffff 45%), radial-gradient(circle at bottom right, #fef3c7 0, #ffffff 55%)',
        }}
      >
        <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '960px',
          backgroundColor: '#ffffff',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow:
            '0 24px 60px rgba(15,23,42,0.12), 0 0 0 1px rgba(148,163,184,0.08)',
          boxSizing: 'border-box',
        }}
      >
        <header style={{ marginBottom: '1.75rem' }}>
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#6366f1',
              marginBottom: '0.4rem',
            }}
          >
            Stylehub AI
          </p>
          <h1
            style={{
              fontSize: '1.9rem',
              fontWeight: 650,
              color: '#0f172a',
              marginBottom: '0.35rem',
            }}
          >
            Upload your page & design preferences
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
            Provide your page file and a few quick choices so the AI can
            understand the layout, color system, and typography you have in
            mind.
          </p>
        </header>

        {/* File upload */}
        <section
          style={{
            borderRadius: '1rem',
            border: '1px solid #e5e7eb',
            padding: '1.25rem 1.4rem',
            marginBottom: '1.5rem',
            background:
              'linear-gradient(to right, rgba(239,246,255,0.9), #ffffff)',
          }}
        >
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '0.25rem',
            }}
          >
            1. Upload your file
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.9rem' }}>
            Accepted formats: <code>.html</code>, <code>.ejs</code>,{' '}
            <code>.jsx</code>
          </p>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '0.9rem 1rem',
              borderRadius: '0.9rem',
              border: '1px dashed #a5b4fc',
              backgroundColor: '#eef2ff',
              cursor: 'pointer',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#111827',
                  marginBottom: '0.15rem',
                }}
              >
                {file ? `Selected: ${file.name}` : 'Click to upload a page file'}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                The file is sent securely to the AI for analysis only when you
                submit.
              </p>
            </div>
            <div
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '999px',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              Browse file
            </div>
            <input
              type="file"
              accept=".html,.ejs,.jsx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
        </section>

        {/* Layout selection */}
        <section
          style={{
            borderRadius: '1rem',
            border: '1px solid #e5e7eb',
            padding: '1.25rem 1.4rem',
            marginBottom: '1.5rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '0.25rem',
            }}
          >
            2. Which layout do you want to use?
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
            Choose the structure that best matches how you want your page
            arranged.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {layoutOptions.map((layout) => {
              const isActive = selectedLayout === layout.id
              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => setSelectedLayout(layout.id)}
                  style={{
                    textAlign: 'left',
                    padding: '0.9rem',
                    borderRadius: '0.9rem',
                    border: isActive
                      ? '1.5px solid #4f46e5'
                      : '1px solid #e5e7eb',
                    backgroundColor: isActive ? '#eef2ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.55rem',
                    transition: 'box-shadow 0.12s ease, transform 0.12s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: '#111827',
                          marginBottom: '0.1rem',
                        }}
                      >
                        {layout.title}
                      </p>
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: '#6b7280',
                        }}
                      >
                        {layout.description}
                      </p>
                    </div>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '999px',
                        border: isActive
                          ? '4px solid #4f46e5'
                          : '1px solid #d1d5db',
                        backgroundColor: isActive ? '#eef2ff' : '#ffffff',
                      }}
                    />
                  </div>

                  {renderLayoutDiagram(layout.id)}
                </button>
              )
            })}
          </div>
        </section>

        {/* Color scheme */}
        <section
          style={{
            borderRadius: '1rem',
            border: '1px solid #e5e7eb',
            padding: '1.25rem 1.4rem',
            marginBottom: '1.5rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '0.25rem',
            }}
          >
            3. Which color scheme should we use?
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
            Pick up to four key colors for your brand or page.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.9rem',
              marginBottom: '0.75rem',
            }}
          >
            {colors.map((value, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.55rem 0.7rem',
                  borderRadius: '999px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                }}
              >
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '999px',
                    border: 'none',
                    padding: 0,
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                  }}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  style={{
                    width: '96px',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.85rem',
                    backgroundColor: 'transparent',
                    color: '#374151',
                  }}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddColor}
            disabled={colors.length >= 4}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '999px',
              border: '1px solid #e5e7eb',
              backgroundColor: colors.length >= 4 ? '#f9fafb' : '#ffffff',
              color: '#4f46e5',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: colors.length >= 4 ? 'not-allowed' : 'pointer',
            }}
          >
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '999px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
              }}
            >
              +
            </span>
            Add color
          </button>
        </section>

        {/* Font selection */}
        <section
          style={{
            borderRadius: '1rem',
            border: '1px solid #e5e7eb',
            padding: '1.25rem 1.4rem',
            marginBottom: '1.5rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '0.25rem',
            }}
          >
            4. Which font style should we use?
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.85rem' }}>
            Choose a primary font. Preview each style below before you commit.
          </p>

          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '260px',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              padding: '0.5rem 0.75rem',
              fontSize: '0.9rem',
              color: '#111827',
              marginBottom: '0.75rem',
            }}
          >
            {fontOptions.map((font) => (
              <option key={font.id} value={font.css}>
                {font.label}
              </option>
            ))}
          </select>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.6rem',
            }}
          >
            {fontOptions.map((font) => {
              const isActive = selectedFont === font.css
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => setSelectedFont(font.css)}
                  style={{
                    textAlign: 'left',
                    padding: '0.6rem 0.7rem',
                    borderRadius: '0.9rem',
                    border: isActive
                      ? '1.5px solid #4f46e5'
                      : '1px solid #e5e7eb',
                    backgroundColor: isActive ? '#eef2ff' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#111827',
                      marginBottom: '0.2rem',
                    }}
                  >
                    {font.label}
                  </p>
                  <p
                    style={{
                      fontFamily: font.css,
                      fontSize: '0.8rem',
                      color: '#4b5563',
                    }}
                  >
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        {error && (
          <p
            style={{
              marginTop: '0.25rem',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              color: '#b91c1c',
            }}
          >
            {error}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '0.5rem',
          }}
        >
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '0.6rem 1.35rem',
              borderRadius: '999px',
              border: 'none',
              background:
                'linear-gradient(135deg, #4f46e5, #6366f1, #ec4899)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow:
                '0 18px 38px rgba(79,70,229,0.35), 0 0 0 1px rgba(129,140,248,0.55)',
              opacity: isSubmitting ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
            }}
          >
            {isSubmitting && (
              <span
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '999px',
                  border: '2px solid rgba(239,246,255,0.8)',
                  borderTopColor: 'rgba(239,246,255,0.1)',
                  animation: 'stylehub-spin 0.7s linear infinite',
                }}
              />
            )}
            {isSubmitting ? 'Processing with AI…' : 'Generate output'}
          </button>

          {isSubmitting && (
            <p
              style={{
                fontSize: '0.85rem',
                color: '#4b5563',
              }}
            >
              The AI is analyzing your layout and design choices.
            </p>
          )}
        </div>

        <style>
          {`
            @keyframes stylehub-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </form>
      </div>
      <Footer />
    </>
  )
}

export default Input
