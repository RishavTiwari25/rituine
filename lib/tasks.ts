// Routine task definitions — single source of truth
export const TASKS = [
  {
    id: 'wake-up',
    title: 'Wake Up & Morning Ritual',
    time: '09:00 AM',
    timeRange: null,
    type: 'prayer' as const,
    buttonLabel: 'Good Morning 🌅',
    description: 'Start your day with intention and gratitude.',
    prayerType: 'morning' as const,
    activeHour: 9,
  },
  {
    id: 'freshen-up',
    title: 'Freshen Up',
    time: '09:00 AM',
    timeRange: '09:00 – 10:00 AM',
    type: 'checkbox' as const,
    description: 'Shower, brush, and get ready for the day.',
    activeHour: 9,
  },
  {
    id: 'review-session',
    title: "Yesterday's Review",
    time: '10:00 AM',
    timeRange: '10:00 – 11:30 AM',
    type: 'timer' as const,
    duration: 90, // minutes
    description: 'Revisit and solve problems from yesterday.',
    prompt: 'What problems did you solve?',
    activeHour: 10,
  },
  {
    id: 'lunch',
    title: 'Lunch Time',
    time: '02:00 PM',
    timeRange: null,
    type: 'checkbox' as const,
    description: 'Nourish your body. Eat mindfully.',
    activeHour: 14,
  },
  {
    id: 'deep-work',
    title: 'Deep Work: New Topic',
    time: '03:00 PM',
    timeRange: '03:00 – 04:30 PM',
    type: 'timer' as const,
    duration: 90, // minutes
    description: 'Full focus on learning something new.',
    prompt: 'What did you master today?',
    activeHour: 15,
  },
  {
    id: 'gym',
    title: 'Gym / Workout Session',
    time: '06:00 PM',
    timeRange: null,
    type: 'checkbox' as const,
    description: 'Sweat it out. Build that discipline.',
    activeHour: 18,
  },
  {
    id: 'dinner',
    title: 'Dinner',
    time: '09:30 PM',
    timeRange: null,
    type: 'checkbox' as const,
    description: 'Enjoy a healthy, satisfying dinner.',
    activeHour: 21,
  },
  {
    id: 'revision',
    title: 'Daily Revision',
    time: '10:00 PM',
    timeRange: '10:00 – 10:30 PM',
    type: 'timer' as const,
    duration: 30, // minutes
    description: 'Review and consolidate everything you learned today.',
    prompt: "Quick summary of today's recap",
    activeHour: 22,
  },
  {
    id: 'sleep',
    title: 'Sleep & Night Ritual',
    time: '12:00 AM',
    timeRange: null,
    type: 'prayer' as const,
    buttonLabel: 'Good Night 🌙',
    description: 'Rest and recharge for tomorrow.',
    prayerType: 'night' as const,
    activeHour: 0,
  },
] as const;

export type Task = (typeof TASKS)[number];
export type TaskId = (typeof TASKS)[number]['id'];

export const POINTS_PER_TASK = 11; // ~99 pts for 9 tasks ≈ 100% of day
