'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  src: string;
  maxDuration?: number; // seconds, default 30
  onEnd?: () => void;
}

export default function AudioPlayer({ src, maxDuration = 30, onEnd }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setPlaying(false);
    setProgress(0);
    setElapsed(0);
    onEnd?.();
  };

  const play = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    setPlaying(true);
    setElapsed(0);

    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        setProgress((next / maxDuration) * 100);
        if (next >= maxDuration) {
          stop();
        }
        return next;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const remaining = Math.max(0, maxDuration - elapsed);

  return (
    <div className="w-full mt-3">
      <audio ref={audioRef} src={src} preload="none" />

      {/* Waveform visualizer bars (decorative) */}
      {playing && (
        <div className="flex items-end justify-center gap-0.5 h-8 mb-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-full audio-bar"
              style={{
                animationDelay: `${(i * 0.08).toFixed(2)}s`,
                height: `${Math.random() * 60 + 20}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-indigo-400 mb-3">
        <span>{formatTime(elapsed)}</span>
        <span className="text-indigo-300">-{formatTime(remaining)}</span>
      </div>

      <button
        onClick={playing ? stop : play}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
          playing
            ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
        }`}
      >
        {playing ? '⏹ Stop Prayer' : '▶ Play Prayer'}
      </button>
    </div>
  );
}
