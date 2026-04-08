function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        padding: '18px 36px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(4px) saturate(200%)',
        WebkitBackdropFilter: 'blur(4px) saturate(200%)',
        background: 'rgba(15, 11, 10, 0.35)',
        borderTop: '1px solid rgba(240, 244, 245, 0.25)',
        boxShadow: `
          0 -8px 30px rgba(0,0,0,0.6),
          inset 0 2px 4px rgba(126, 59, 237, 0.25),
          inset 0 -2px 4px rgba(0,0,0,0.4)
        `,
      }}
    >
      <p
        style={{
          fontFamily: "'Sora', 'Inter', sans-serif",
          fontSize: '0.78rem',
          fontWeight: 300,
          letterSpacing: '0.06em',
          color: 'rgba(240, 244, 245, 0.5)',
          margin: 0,
        }}
      >
        &copy; 2026 HUE.AI All rights reserved.
      </p>
    </footer>
  )
}

export default Footer