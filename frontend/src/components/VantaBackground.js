import { useEffect, useRef } from 'react';

/**
 * Vanta.js Net Effect Background Component
 * Creates an interactive WebGL background that responds to mouse movement
 */
export function VantaBackground() {
  const vantaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize Vanta.js Net effect
    if (window.VANTA) {
      vantaRef.current = window.VANTA.NET({
        el: containerRef.current,
        THREE: window.THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: window.innerWidth < 768 ? 0.5 : 1.00,
        points: 12.00,
        maxDistance: 22.00,
        spacing: 17.00,
        showLinks: true,
        color: 0x06b6d4,
        backgroundColor: 0x020617,
      });
    }

    // Cleanup on unmount
    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="vanta-bg"
      className="fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
