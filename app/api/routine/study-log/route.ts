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
    const { date, taskId, text } = body as {
      date: string;
      taskId: string;
      text: string;
    };

    if (!date || !taskId || !text?.trim()) {
      return NextResponse.json({ error: 'Missing date, taskId, or text' }, { status: 400 });
    }

    await connectDB();

    const dailyLog = await DailyLog.findOne({ date });
    if (!dailyLog) {
      return NextResponse.json({ error: 'Daily log not found' }, { status: 404 });
    }

    // Push study log entry
    dailyLog.studyLogs.push({
      taskId,
      text: text.trim(),
      savedAt: new Date().toISOString(),
    });

    // Mark task as completed
    const taskIndex = dailyLog.tasks.findIndex((t: { id: string }) => t.id === taskId);
    const wasCompleted = taskIndex !== -1 ? dailyLog.tasks[taskIndex].completed : false;

    if (taskIndex !== -1) {
      dailyLog.tasks[taskIndex].completed = true;
      dailyLog.tasks[taskIndex].completedAt = new Date().toISOString();
    }

    await dailyLog.save();

    // Update all-time points only if newly completed
    let userStats = await UserStats.findOne({ userId: 'single-user' });
    if (!userStats) {
      userStats = await UserStats.create({ userId: 'single-user', allTimePoints: 0 });
    }

    if (!wasCompleted) {
      userStats.allTimePoints += POINTS_PER_TASK;
      userStats.lastUpdated = new Date();
      await userStats.save();
    }

    return NextResponse.json({
      success: true,
      allTimePoints: userStats.allTimePoints,
    });
  } catch (error) {
    console.error('POST /api/routine/study-log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
