'use client';

import { useEffect, useState, useCallback } from 'react';
import LiveClock from '@/components/LiveClock';
import ProgressRing from '@/components/ProgressRing';
import TaskCard from '@/components/TaskCard';
import { TASKS } from '@/lib/tasks';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTodayDate() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

function getActiveTaskId(): string | null {
  const hour = new Date().getHours();
  // Find the closest task for the current hour
  let best: string | null = null;
  let bestDiff = Infinity;
  for (const task of TASKS) {
    const diff = Math.abs(task.activeHour - hour);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = task.id;
    }
  }
  return best;
}

const PIN = process.env.NEXT_PUBLIC_AUTH_PIN ?? '';

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  const [date, setDate] = useState(getTodayDate());
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [allTimePoints, setAllTimePoints] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Keep active task updated every minute
  useEffect(() => {
    setActiveTaskId(getActiveTaskId());
    const id = setInterval(() => {
      setActiveTaskId(getActiveTaskId());
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  // Detect date change (midnight reset)
  useEffect(() => {
    const id = setInterval(() => {
      const today = getTodayDate();
      if (today !== date) {
        setDate(today);
        setCompletedMap({});
      }
    }, 30_000);
    return () => clearInterval(id);
  }, [date]);

  // Fetch daily data
  const fetchData = useCallback(async (d: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/routine?date=${d}`);
      if (!res.ok) throw new Error('Failed to load data');
      const data = await res.json();

      const map: Record<string, boolean> = {};
      for (const task of data.dailyLog.tasks) {
        map[task.id] = task.completed;
      }
      setCompletedMap(map);
      setAllTimePoints(data.allTimePoints ?? 0);
    } catch {
      setError('Could not connect to database. Check your MONGODB_URI.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(date);
  }, [date, fetchData]);

  // Called when a task is completed
  const handleComplete = useCallback((taskId: string, newPoints: number) => {
    setCompletedMap((prev) => ({ ...prev, [taskId]: true }));
    setAllTimePoints(newPoints);
  }, []);

  // Stats
  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const totalCount = TASKS.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            ritu<span className="text-indigo-400">ine</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">
            Daily Discipline Dashboard
          </p>
        </div>

        {/* ── Hero card: Clock + Stats ────────────────────────── */}
        <div className="glass rounded-3xl p-6 space-y-6">
          <LiveClock />

          <div className="gradient-divider" />

          {/* Stats row */}
          <div className="flex items-center justify-between gap-4">
            {/* Progress ring */}
            <div className="flex flex-col items-center gap-2">
              {loading ? (
                <div className="w-40 h-40 rounded-full border border-indigo-500/20 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <ProgressRing percentage={progressPercent} size={160} />
              )}
              <span className="section-label">Today&apos;s Progress</span>
            </div>

            {/* Right stats */}
            <div className="flex flex-col gap-3 flex-1">
              <div className="stat-badge">
                <span className="text-2xl font-bold font-mono points-glow text-purple-300">
                  {allTimePoints.toLocaleString()}
                </span>
                <span className="section-label">Lifetime Points</span>
              </div>

              <div className="stat-badge">
                <span className="text-2xl font-bold font-mono text-indigo-300">
                  {completedCount}/{totalCount}
                </span>
                <span className="section-label">Tasks Done</span>
              </div>

              <div className="stat-badge">
                <span className="text-sm font-mono text-emerald-400 font-semibold">
                  {date}
                </span>
                <span className="section-label">Current Date</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Error banner ─────────────────────────────────────── */}
        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-rose-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* ── Task Cards ───────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="section-label">Your Routine</span>
            {!loading && completedCount === totalCount && (
              <span className="text-xs text-emerald-400 font-semibold animate-pulse">
                🏆 Full day complete!
              </span>
            )}
          </div>

          {loading ? (
            // Skeleton loading cards
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            ))
          ) : (
            TASKS.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                completed={completedMap[task.id] ?? false}
                isActive={activeTaskId === task.id}
                pin={PIN}
                date={date}
                onComplete={handleComplete}
              />
            ))
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="text-center text-slate-600 text-xs pt-4 pb-8">
          <span>rituine · stay consistent, every single day</span>
        </footer>

      </div>
    </main>
  );
}
