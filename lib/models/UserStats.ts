import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserStats extends Document {
  userId: string;
  allTimePoints: number;
  lastUpdated: Date;
}

const UserStatsSchema = new Schema<IUserStats>({
  userId: { type: String, required: true, unique: true, default: 'single-user' },
  allTimePoints: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

const UserStats: Model<IUserStats> =
  mongoose.models.UserStats || mongoose.model<IUserStats>('UserStats', UserStatsSchema);

export default UserStats;
