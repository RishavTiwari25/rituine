'use client';

import { useEffect, useState } from 'react';

export default function LiveClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    function update() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-center">
      <div className="text-5xl font-mono font-bold text-white tracking-widest clock-glow">
        {time || '00:00:00 AM'}
      </div>
      <div className="text-indigo-300 text-sm mt-2 tracking-wider uppercase font-medium">
        {date}
      </div>
    </div>
  );
}
