export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import DailyLog from '@/lib/models/DailyLog';
import UserStats from '@/lib/models/UserStats';
import { POINTS_PER_TASK } from '@/lib/tasks';

function verifyPin(request: NextRequest) {
  const pin = request.headers.get('x-pin');
  return pin === process.env.AUTH_PIN;
}

export async function POST(request: NextRequest) {
  if (!verifyPin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, taskId, completed } = body as {
      date: string;
      taskId: string;
      completed: boolean;
    };

    if (!date || !taskId) {
      return NextResponse.json({ error: 'Missing date or taskId' }, { status: 400 });
    }

    await connectDB();

    const dailyLog = await DailyLog.findOne({ date });
    if (!dailyLog) {
      return NextResponse.json({ error: 'Daily log not found' }, { status: 404 });
    }

    const taskIndex = dailyLog.tasks.findIndex((t: { id: string }) => t.id === taskId);
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const wasCompleted = dailyLog.tasks[taskIndex].completed;
    dailyLog.tasks[taskIndex].completed = completed;
    dailyLog.tasks[taskIndex].completedAt = completed ? new Date().toISOString() : null;

    await dailyLog.save();

    // Update all-time points
    let pointsDelta = 0;
    if (completed && !wasCompleted) {
      pointsDelta = POINTS_PER_TASK;
    } else if (!completed && wasCompleted) {
      pointsDelta = -POINTS_PER_TASK;
    }

    let userStats = await UserStats.findOne({ userId: 'single-user' });
    if (!userStats) {
      userStats = await UserStats.create({ userId: 'single-user', allTimePoints: 0 });
    }

    if (pointsDelta !== 0) {
      userStats.allTimePoints = Math.max(0, userStats.allTimePoints + pointsDelta);
      userStats.lastUpdated = new Date();
      await userStats.save();
    }

    return NextResponse.json({
      success: true,
      task: dailyLog.tasks[taskIndex],
      allTimePoints: userStats.allTimePoints,
    });
  } catch (error) {
    console.error('POST /api/routine/toggle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
