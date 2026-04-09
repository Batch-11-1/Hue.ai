import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const linkBaseStyle = {
    color: '#F0F4F5',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 500,
    padding: '10px 24px',
    borderRadius: '9999px',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    transition:
      'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), ' +
      'box-shadow 0.25s ease, ' +
      'border-color 0.25s ease, ' +
      'background-color 0.25s ease, ' +
      'color 0.25s ease',
    cursor: 'pointer',
    display: 'block',
  };

  const applyHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
    e.currentTarget.style.borderColor = '#7e3bed';
    e.currentTarget.style.backgroundColor = 'rgba(126, 59, 237, 0.08)';
    e.currentTarget.style.boxShadow = '0 10px 25px rgba(126, 59, 237, 0.35)';
    e.currentTarget.style.color = '#7e3bed';
  };

  const resetHover = (e) => {
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    e.currentTarget.style.borderColor = 'transparent';
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
    e.currentTarget.style.color = '#F0F4F5';
  };

  const handleMouseDown = (e) => { e.currentTarget.style.transform = 'scale(0.95)'; };
  const handleMouseUp   = (e) => { if (e.currentTarget.matches(':hover')) applyHover(e); else resetHover(e); };

  const navLinks = [
    { to: '/',        label: 'Home'     },
    { to: '/input',   label: 'Input'    },
    { to: '/aboutus', label: 'About Us' },
  ];

  return (
    <>
      <motion.nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 36px',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          background: 'rgba(15, 11, 10, 0.35)',
          borderBottom: '1px solid rgba(240, 244, 245, 0.25)',
          boxShadow: `
            0 8px 30px rgba(0,0,0,0.6),
            inset 0 2px 4px rgba(126, 59, 237, 0.25),
            inset 0 -2px 4px rgba(0,0,0,0.4)
          `,
          width: '100%',
          borderRadius: '0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxSizing: 'border-box',
        }}
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      >
        <p style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.5px', color: '#F0F4F5' }}>
          HUE.Ai
        </p>

        {/* Desktop links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="navbar-desktop">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{ ...linkBaseStyle }}
              onMouseOver={applyHover}
              onMouseOut={resetHover}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5px',
            background: 'transparent',
            border: '1px solid rgba(240,244,245,0.2)',
            borderRadius: '8px',
            padding: '8px 10px',
            cursor: 'pointer',
            zIndex: 110,
          }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              display: 'block',
              width: '22px',
              height: '2px',
              background: '#F0F4F5',
              borderRadius: '2px',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              transform:
                menuOpen
                  ? i === 0 ? 'translateY(7px) rotate(45deg)'
                  : i === 2 ? 'translateY(-7px) rotate(-45deg)'
                  : 'none'
                  : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'sticky',
              top: '53px',
              zIndex: 99,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '12px 16px',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              background: 'rgba(15, 11, 10, 0.92)',
              borderBottom: '1px solid rgba(240, 244, 245, 0.15)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
            }}
          >
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                style={{ ...linkBaseStyle, borderRadius: '8px', padding: '12px 18px' }}
                onMouseOver={applyHover}
                onMouseOut={resetHover}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .navbar-desktop { display: none !important; }
          .navbar-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

export default Navbar;