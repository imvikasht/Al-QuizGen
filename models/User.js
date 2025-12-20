import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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

export default mongoose.model('User', UserSchema);