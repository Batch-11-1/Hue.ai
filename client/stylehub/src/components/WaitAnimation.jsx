import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import halfpart from '../assets/halfpart.png'

export function WaitAnimation() {
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
      className="wait-animation-wrapper"
      style={{
        position: 'relative',
        overflow: 'visible',
        width: dimensions.width || 'auto',
        height: dimensions.height || 'auto',
        marginBottom: '1rem',
        display: 'inline-block',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <motion.img
        ref={imageRef}
        src={halfpart}
        alt="Animated half part"
        onLoad={handleImageLoad}
        initial={{ y: 0, rotateZ: 0 }}
        animate={[
          { y: 0, rotateZ: 0 },
          { y: yDistance, rotateZ: 0 },
          { y: yDistance, rotateZ: 360 },
          { y: -yDistance, rotateZ: 720 },
          { y: 0, rotateZ: 720 },
        ]}
        transition={{
          duration: 4,
          ease: 'easeInOut',
          times: [0, 0.2, 0.3, 0.8, 1],
          repeat: Infinity,
        }}
        style={{
          display: 'block',
          position: 'absolute',
          left: '40%',
          top: '37%',
          width: '100px',
          height: 'auto',
          scaleY: -1,
        }}
      />

      <motion.img
        src={halfpart}
        alt="Upside-down animated half part"
        initial={{ y: 0, rotateZ: 0 }}
        animate={[
          { y: 0, rotateZ: 0 },
          { y: -yDistance, rotateZ: 0 },
          { y: -yDistance, rotateZ: 360 },
          { y: yDistance, rotateZ: 720 },
          { y: 0, rotateZ: 720 },
        ]}
        transition={{
          duration: 4,
          ease: 'easeInOut',
          times: [0, 0.2, 0.3, 0.8, 1],
          repeat: Infinity,
        }}
        style={{
          display: 'block',
          position: 'absolute',
          left: '40%',
          top: '50%',
          width: '100px',
          height: 'auto',
          opacity: 0.8,
        }}
      />
    </div>
  )
}
