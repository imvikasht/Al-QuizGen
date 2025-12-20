import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface IQuiz extends Document {
  title: string;
  description: string;
  questionsArray: IQuestion[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  duration: number;
  createdBy?: mongoose.Schema.Types.ObjectId;
}

const QuizSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Medium' 
  },
  duration: { type: Number, default: 5 },
  questionsArray: [{
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number, required: true }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);