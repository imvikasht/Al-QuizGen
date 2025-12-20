import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  role: 'Student' | 'Teacher' | 'Admin' | 'Guest';
  organization?: string;
  avatarUrl?: string;
  totalScore: number;
  badgesArray: string[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for guests
  role: { 
    type: String, 
    enum: ['Student', 'Teacher', 'Admin', 'Guest'], 
    default: 'Student' 
  },
  organization: { type: String },
  avatarUrl: { type: String },
  totalScore: { type: Number, default: 0 },
  badgesArray: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);