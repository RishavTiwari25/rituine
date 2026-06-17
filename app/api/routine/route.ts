export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import DailyLog from '@/lib/models/DailyLog';
import UserStats from '@/lib/models/UserStats';
import { TASKS } from '@/lib/tasks';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid or missing date parameter' }, { status: 400 });
    }

    await connectDB();

    // Fetch or create daily log
    let dailyLog = await DailyLog.findOne({ date });

    if (!dailyLog) {
      // Initialize fresh daily log with all tasks uncompleted
      const initialTasks = TASKS.map((task) => ({
        id: task.id,
        completed: false,
        completedAt: null,
      }));

      dailyLog = await DailyLog.create({
        date,
        tasks: initialTasks,
        studyLogs: [],
      });
    }

    // Fetch or create user stats
    let userStats = await UserStats.findOne({ userId: 'single-user' });
    if (!userStats) {
      userStats = await UserStats.create({ userId: 'single-user', allTimePoints: 0 });
    }

    return NextResponse.json({
      dailyLog,
      allTimePoints: userStats.allTimePoints,
    });
  } catch (error) {
    console.error('GET /api/routine error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
