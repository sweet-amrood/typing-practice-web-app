import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    wpm: {
      type: Number,
      required: [true, 'WPM is required'],
      min: [0, 'WPM cannot be negative'],
    },
    accuracy: {
      type: Number,
      required: [true, 'Accuracy is required'],
      min: [0, 'Accuracy cannot be negative'],
      max: [100, 'Accuracy cannot exceed 100'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [0, 'Duration cannot be negative'],
    },
    charactersTyped: {
      type: Number,
      required: [true, 'Characters typed is required'],
      min: [0, 'Characters typed cannot be negative'],
    },
    mistakes: {
      type: Number,
      required: [true, 'Mistakes is required'],
      min: [0, 'Mistakes cannot be negative'],
    },
    xpEarned: {
      type: Number,
      default: 0,
      min: [0, 'XP earned cannot be negative'],
    },
    coinsEarned: {
      type: Number,
      default: 0,
      min: [0, 'Coins earned cannot be negative'],
    },
    rewardTier: {
      type: String,
      default: 'pass',
    },
    mode: {
      type: String,
      default: 'practice',
    },
    language: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

testResultSchema.index({ userId: 1, date: -1 });

const TestResult = mongoose.model('TestResult', testResultSchema);

export default TestResult;
