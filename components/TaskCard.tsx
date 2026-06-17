'use client';

import { useState, useCallback } from 'react';
import CountdownTimer from './CountdownTimer';
import AudioPlayer from './AudioPlayer';
import CompletionAnimation from './CompletionAnimation';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    time: string;
    timeRange?: string | null;
    type: 'checkbox' | 'timer' | 'prayer';
    description: string;
    buttonLabel?: string;
    prayerType?: 'morning' | 'night';
    duration?: number;
    prompt?: string;
    activeHour: number;
  };
  completed: boolean;
  isActive: boolean;
  pin: string;
  date: string;
  onComplete: (taskId: string, newPoints: number) => void;
}

export default function TaskCard({
  task,
  completed,
  isActive,
  pin,
  date,
  onComplete,
}: TaskCardProps) {
  const [loading, setLoading] = useState(false);
  const [showAnim, setShowAnim] = useState(false);

  // Prayer audio sources — replace with your actual prayer file paths
  const prayerSrc =
    task.prayerType === 'morning'
      ? '/audio/morning-prayer.mp3'
      : '/audio/night-prayer.mp3';

  const triggerComplete = useCallback(
    async (taskId: string) => {
      if (completed || loading) return;
      setLoading(true);
      try {
        const res = await fetch('/api/routine/toggle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-pin': pin,
          },
          body: JSON.stringify({ date, taskId, completed: true }),
        });
        const data = await res.json();
        if (data.success) {
          setShowAnim(true);
          onComplete(taskId, data.allTimePoints);
        }
      } finally {
        setLoading(false);
      }
    },
    [completed, loading, pin, date, onComplete]
  );

  const handleStudySave = useCallback(
    async (text: string) => {
      const res = await fetch('/api/routine/study-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-pin': pin,
        },
        body: JSON.stringify({ date, taskId: task.id, text }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAnim(true);
        onComplete(task.id, data.allTimePoints);
      }
    },
    [task.id, pin, date, onComplete]
  );

  return (
    <div
      className={`task-card relative overflow-hidden rounded-2xl border transition-all duration-500
        ${completed
          ? 'border-indigo-500/40 bg-indigo-900/20'
          : isActive
          ? 'border-indigo-400/60 bg-indigo-900/30 active-pulse'
          : 'border-white/10 bg-white/5 hover:border-white/20'
        }
      `}
    >
      {/* Active indicator strip */}
      {isActive && !completed && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-l-2xl" />
      )}

      {/* Completion animation overlay */}
      <CompletionAnimation show={showAnim} />

      <div className="p-5 pl-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                {task.timeRange ?? task.time}
              </span>
              {isActive && !completed && (
                <span className="text-xs text-purple-300 font-medium animate-pulse">● Now</span>
              )}
            </div>
            <h3 className={`text-base font-semibold ${completed ? 'text-indigo-300 line-through' : 'text-white'}`}>
              {task.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
          </div>

          {/* Completed badge */}
          {completed && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center">
              <span className="text-indigo-300 text-sm">✓</span>
            </div>
          )}
        </div>

        {/* Task type controls */}
        {!completed && (
          <div className="mt-4">
            {/* CHECKBOX */}
            {task.type === 'checkbox' && (
              <button
                onClick={() => triggerComplete(task.id)}
                disabled={loading}
                className="flex items-center gap-3 group"
              >
                <div className="w-6 h-6 rounded-md border-2 border-indigo-500/50 group-hover:border-indigo-400 transition-colors flex items-center justify-center bg-white/5">
                  {loading && (
                    <div className="w-3 h-3 border border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                <span className="text-sm text-indigo-300 group-hover:text-white transition-colors">
                  Mark as done
                </span>
              </button>
            )}

            {/* PRAYER */}
            {task.type === 'prayer' && (
              <div>
                <button
                  onClick={() => triggerComplete(task.id)}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    task.buttonLabel
                  )}
                </button>
                <AudioPlayer src={prayerSrc} maxDuration={30} />
              </div>
            )}

            {/* TIMER */}
            {task.type === 'timer' && task.duration && task.prompt && (
              <CountdownTimer
                durationMinutes={task.duration}
                prompt={task.prompt}
                onSave={handleStudySave}
                disabled={false}
              />
            )}
          </div>
        )}

        {/* Completed state */}
        {completed && (
          <div className="mt-2 text-xs text-indigo-400/70 font-medium">
            ✨ Completed — great work!
          </div>
        )}
      </div>
    </div>
  );
}
