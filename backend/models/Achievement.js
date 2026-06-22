import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    key: {
      type: String,
      required: [true, 'Achievement key is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Achievement name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Achievement description is required'],
      trim: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({ userId: 1, key: 1 }, { unique: true });

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
