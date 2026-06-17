'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface CountdownTimerProps {
  durationMinutes: number;
  prompt: string;
  onSave: (text: string) => Promise<void>;
  disabled?: boolean;
}

type TimerState = 'idle' | 'running' | 'paused' | 'done';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function CountdownTimer({
  durationMinutes,
  prompt,
  onSave,
  disabled = false,
}: CountdownTimerProps) {
  const totalSeconds = durationMinutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [state, setState] = useState<TimerState>('idle');
  const [logText, setLogText] = useState('');
  const [saving, setSaving] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleDone = useCallback(() => {
    clearTimer();
    setState('done');
    setRemaining(0);
  }, []);

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            handleDone();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [state, handleDone]);

  const handleStart = () => {
    if (disabled) return;
    setState('running');
  };

  const handlePause = () => {
    clearTimer();
    setState('paused');
  };

  const handleResume = () => setState('running');

  const handleStop = () => {
    clearTimer();
    setState('done');
  };

  const handleReset = () => {
    clearTimer();
    setRemaining(totalSeconds);
    setState('idle');
    setLogText('');
  };

  const handleSave = async () => {
    if (!logText.trim()) return;
    setSaving(true);
    try {
      await onSave(logText.trim());
    } finally {
      setSaving(false);
    }
  };

  const progress = ((totalSeconds - remaining) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Ring timer */}
      <div className="relative flex items-center justify-center">
        <svg width={128} height={128} className="-rotate-90">
          <circle
            cx={64} cy={64} r={54}
            fill="none"
            stroke="rgba(99,102,241,0.12)"
            strokeWidth={8}
          />
          <circle
            cx={64} cy={64} r={54}
            fill="none"
            stroke="url(#timerGrad)"
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-mono font-bold text-white">
            {formatTime(remaining)}
          </span>
          <span className="text-xs text-indigo-400 uppercase tracking-widest mt-0.5">
            {state === 'done' ? 'done' : state === 'idle' ? 'ready' : state}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap justify-center">
        {state === 'idle' && (
          <button
            onClick={handleStart}
            disabled={disabled}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-40"
          >
            ▶ Start Session
          </button>
        )}
        {state === 'running' && (
          <>
            <button
              onClick={handlePause}
              className="px-4 py-2 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-sm font-semibold transition-all border border-yellow-500/30"
            >
              ⏸ Pause
            </button>
            <button
              onClick={handleStop}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-sm font-semibold transition-all border border-rose-500/30"
            >
              ⏹ Stop & Log
            </button>
          </>
        )}
        {state === 'paused' && (
          <>
            <button
              onClick={handleResume}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all"
            >
              ▶ Resume
            </button>
            <button
              onClick={handleStop}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-sm font-semibold transition-all border border-rose-500/30"
            >
              ⏹ Stop & Log
            </button>
          </>
        )}
        {state === 'done' && (
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-all"
          >
            ↺ Reset
          </button>
        )}
      </div>

      {/* Study log input — fades in when done */}
      {state === 'done' && (
        <div className="w-full fade-slide-in">
          <p className="text-indigo-300 text-sm font-medium mb-2">✍️ {prompt}</p>
          <textarea
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
            rows={3}
            placeholder="Type your summary here..."
            className="w-full bg-white/5 border border-indigo-500/30 rounded-xl px-4 py-3 text-white text-sm placeholder-indigo-400/50 focus:outline-none focus:border-indigo-400 resize-none"
          />
          <button
            onClick={handleSave}
            disabled={!logText.trim() || saving}
            className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-40"
          >
            {saving ? 'Saving...' : '✓ Save & Complete'}
          </button>
        </div>
      )}
    </div>
  );
}
