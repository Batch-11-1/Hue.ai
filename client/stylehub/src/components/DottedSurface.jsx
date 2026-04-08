import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// theme prop: "light" | "dark" (defaults to "dark")
function DottedSurface({ children, style, theme = 'dark', ...props }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 600, 900);
    camera.lookAt(0, 0, -1500);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Geometry
    const numPoints = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);

    const [r, g, b] =
      theme === 'light'
        ? [59 / 255, 130 / 255, 246 / 255]
        : [112 / 255, 60 / 255, 228 / 255];

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i * 3]     = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        colors[i * 3]     = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage); // tell GPU positions change every frame
    geometry.setAttribute('position', posAttr);
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 13,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Animation loop
    let count = 0;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      let idx = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          positions[idx * 3 + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          idx++;
        }
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.1;
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    // Outer div — add background
<div style={{ position: 'relative', minHeight: '100vh', background: '#0F0B0A', ...style }} {...props}>

  <div
    ref={containerRef}
    style={{
      pointerEvents: 'none',
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 0,          // ← was -10, now 0
    }}
  />

  {/* Wrap children so they sit ABOVE the canvas */}
  <div style={{ position: 'relative', zIndex: 1 }}>
    {children}
  </div>

</div>
  );
}

export default DottedSurface;