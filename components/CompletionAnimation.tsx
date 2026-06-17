'use client';

import { useEffect, useState } from 'react';

interface CompletionAnimationProps {
  show: boolean;
}

export default function CompletionAnimation({ show }: CompletionAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
      {/* Check burst */}
      <div className="check-burst text-5xl animate-check-pop select-none">✅</div>

      {/* Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="particle absolute w-2 h-2 rounded-full"
          style={{
            background: `hsl(${240 + i * 10}, 80%, 65%)`,
            animationDelay: `${i * 0.04}s`,
            '--angle': `${i * 30}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
