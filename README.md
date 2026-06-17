# Rituine 🌙

> **Your personal daily discipline dashboard.** Track your full routine — morning ritual, study sessions, gym, meals, and night prayer — with persistent MongoDB cloud storage.

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
cd rituine
npm install
```

### 2. Set Up MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a new **Cluster** (free M0 tier is fine).
3. Create a **Database User** (username + password).
4. Under **Network Access**, add `0.0.0.0/0` to allow connections from anywhere (needed for Vercel).
5. Click **Connect** → **Connect your application** → copy the connection string.

> `AUTH_PIN` protects your API — only requests containing this PIN can modify data.  
> `NEXT_PUBLIC_AUTH_PIN` must be identical — it's used by the browser to call the API.

### 4. Add Prayer Audio Files

Place your audio files in the `public/audio/` folder:

```
public/
  audio/
    morning-prayer.mp3   ← plays when you click "Good Morning"
    night-prayer.mp3     ← plays when you click "Good Night"
```

> Any `.mp3` works. Auto-stops at 30 seconds.

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. In the **Environment Variables** section, add:
   - `MONGODB_URI`
   - `AUTH_PIN`
   - `NEXT_PUBLIC_AUTH_PIN`
4. Click **Deploy**. ✅

---

## 📋 Routine Schedule

| # | Time | Task | Type |
|---|------|------|------|
| 1 | 09:00 AM | Wake Up & Morning Ritual | 🙏 Prayer |
| 2 | 09:00–10:00 AM | Freshen Up | ✅ Checkbox |
| 3 | 10:00–11:30 AM | Yesterday's Review | ⏱ Timer (90 min) |
| 4 | 02:00 PM | Lunch | ✅ Checkbox |
| 5 | 03:00–04:30 PM | Deep Work: New Topic | ⏱ Timer (90 min) |
| 6 | 06:00 PM | Gym / Workout | ✅ Checkbox |
| 7 | 09:30 PM | Dinner | ✅ Checkbox |
| 8 | 10:00–10:30 PM | Daily Revision | ⏱ Timer (30 min) |
| 9 | 12:00 AM | Sleep & Night Ritual | 🙏 Prayer |

---

## 🏆 Scoring

- **11 points** per completed task
- **9 tasks** = ~99 points max per day
- **Lifetime Points** accumulate forever across all days
- Daily progress resets automatically at midnight

---

## 🔧 Customizing Your Routine

Edit [`lib/tasks.ts`](./lib/tasks.ts) to change:
- Task titles, times, descriptions
- Timer durations (in minutes)
- Prompt text for study logs
- Active hour for time-based highlighting

---

## 📁 Project Structure

```
rituine/
├── app/
│   ├── api/
│   │   └── routine/
│   │       ├── route.ts          # GET daily log
│   │       ├── toggle/route.ts   # POST toggle task
│   │       └── study-log/route.ts # POST save study log
│   ├── globals.css               # Theme + animations
│   ├── layout.tsx
│   └── page.tsx                  # Main dashboard
├── components/
│   ├── LiveClock.tsx
│   ├── ProgressRing.tsx
│   ├── CountdownTimer.tsx
│   ├── AudioPlayer.tsx
│   ├── CompletionAnimation.tsx
│   └── TaskCard.tsx
├── lib/
│   ├── mongoose.ts               # DB connection singleton
│   ├── tasks.ts                  # Routine task definitions
│   └── models/
│       ├── DailyLog.ts
│       └── UserStats.ts
└── public/
    └── audio/
        ├── morning-prayer.mp3
        └── night-prayer.mp3
```
