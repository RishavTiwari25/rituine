import mongoose, { Schema, Document, Model } from 'mongoose';

export interface TaskState {
  id: string;
  completed: boolean;
  completedAt: string | null;
}

export interface StudyLog {
  taskId: string;
  text: string;
  savedAt: string;
}

export interface IDailyLog extends Document {
  date: string; // YYYY-MM-DD
  tasks: TaskState[];
  studyLogs: StudyLog[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskStateSchema = new Schema<TaskState>({
  id: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: String, default: null },
});

const StudyLogSchema = new Schema<StudyLog>({
  taskId: { type: String, required: true },
  text: { type: String, required: true },
  savedAt: { type: String, required: true },
});

const DailyLogSchema = new Schema<IDailyLog>(
  {
    date: { type: String, required: true, unique: true },
    tasks: { type: [TaskStateSchema], default: [] },
    studyLogs: { type: [StudyLogSchema], default: [] },
  },
  { timestamps: true }
);

const DailyLog: Model<IDailyLog> =
  mongoose.models.DailyLog || mongoose.model<IDailyLog>('DailyLog', DailyLogSchema);

export default DailyLog;
