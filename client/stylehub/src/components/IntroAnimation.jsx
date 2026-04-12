import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import halfpart from '../assets/halfpart.png'

export function IntroAnimation() {
  const imageRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  function handleImageLoad() {
    if (imageRef.current) {
      setDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      })
    }
  }

  const yDistance = dimensions.height * 0.1;

  return (
    <div
      className="intro-animation-wrapper"
      style={{
        position: 'relative',
        overflow: 'visible',
        width: dimensions.width || 'auto',
        height: dimensions.height || 'auto',
        marginBottom: '1rem',
        display: 'inline-block',
        top: '-50px',
      }}
    >
        <motion.div
        initial={{ rotateZ: 0 }}
        animate={{ rotateZ: [0, 0, 720, 900], scale: [0, 0.1, 0.9, 0.9]}}
        transition={{duration: 5, times: [0, 0.05, 0.6, 1], ease: 'easeInOut'}}
        style={{position: 'absolute', transformOrigin: "25% 30%", height: '200px', width: '200px', left: '38%', transform: 'translateX(-50%)', margin: '0px'}}
        >
      <motion.img
        ref={imageRef}
        src={halfpart}
        alt="Animated half part"
        onLoad={handleImageLoad}
        initial={{ y: yDistance, rotateZ: 0 }}
        animate={{y: [yDistance, yDistance, yDistance, 0], rotateZ: [0, 0, 0, 360]}}
        transition={{
          duration: 5,
          ease: 'easeInOut',
          times: [0, 0.05, 0.6, 1]
        }}
        style={{
          display: 'block',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100px',
          height: 'auto',
          scaleY: -1,
        }}
      />

      <motion.img
        ref={imageRef}
        src={halfpart}
        alt="Upside-down animated half part"
        initial={{ y: -yDistance, rotateZ: 0 }}
        animate={{y: [-yDistance, -yDistance, -yDistance, 0], rotateZ: [0, 0, 0, -360]}}
        transition={{
          duration: 5,
          ease: 'easeInOut',
          times: [0, 0.05, 0.6, 1]
        }}
        style={{
          display: 'block',
          position: 'absolute',
          left: 0,
          top: 40,
          width: '100px',
          height: 'auto',
          opacity: 0.8,
        }}
      />
      </motion.div>
    </div>
  )
}
