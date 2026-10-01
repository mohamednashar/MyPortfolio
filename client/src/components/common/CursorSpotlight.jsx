import React, { useEffect, useState } from 'react';

const CursorSpotlight = () => {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop devices that support fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-500"
      style={{
        background: `radial-gradient(650px circle at ${pos.x}px ${pos.y}px, rgba(6, 182, 212, 0.05), rgba(99, 102, 241, 0.02) 40%, transparent 80%)`,
      }}
    />
  );
};

export default CursorSpotlight;
