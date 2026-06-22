import mongoose from 'mongoose';
import { DIFFICULTY_MODES, LEVELS_PER_MODE } from '../utils/stages.js';

const lessonProgressSchema = new mongoose.Schema(
  {
    beginner: {
      type: [Number],
      default: [],
    },
    intermediate: {
      type: [Number],
      default: [],
    },
    advanced: {
      type: [Number],
      default: [],
    },
  },
  { _id: false }
);

const lessonStarsSchema = new mongoose.Schema(
  {
    beginner: {
      type: Object,
      default: {},
    },
    intermediate: {
      type: Object,
      default: {},
    },
    advanced: {
      type: Object,
      default: {},
    },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    lessonProgress: {
      type: lessonProgressSchema,
      default: () =>
        Object.fromEntries(DIFFICULTY_MODES.map((mode) => [mode, []])),
    },
    lessonStars: {
      type: lessonStarsSchema,
      default: () =>
        Object.fromEntries(DIFFICULTY_MODES.map((mode) => [mode, {}])),
    },
    currentLevel: {
      type: Number,
      default: 1,
      min: [1, 'Current level must be at least 1'],
    },
    highestWPM: {
      type: Number,
      default: 0,
      min: [0, 'Highest WPM cannot be negative'],
    },
    averageWPM: {
      type: Number,
      default: 0,
      min: [0, 'Average WPM cannot be negative'],
    },
    bestAccuracy: {
      type: Number,
      default: 0,
      min: [0, 'Best accuracy cannot be negative'],
      max: [100, 'Best accuracy cannot exceed 100'],
    },
    averageAccuracy: {
      type: Number,
      default: 0,
      min: [0, 'Average accuracy cannot be negative'],
      max: [100, 'Average accuracy cannot exceed 100'],
    },
    totalWordsTyped: {
      type: Number,
      default: 0,
      min: [0, 'Total words typed cannot be negative'],
    },
    totalTestsCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Total tests completed cannot be negative'],
    },
    streak: {
      type: Number,
      default: 0,
      min: [0, 'Streak cannot be negative'],
    },
    lastPracticeDate: {
      type: String,
      default: null,
    },
    lastRewardCollectedDate: {
      type: String,
      default: null,
    },
    xp: {
      type: Number,
      default: 0,
      min: [0, 'XP cannot be negative'],
    },
    coins: {
      type: Number,
      default: 0,
      min: [0, 'Coins cannot be negative'],
    },
    specialThemeUnlocked: {
      type: Boolean,
      default: false,
    },
    unlockedThemes: {
      type: [String],
      default: () => ['dark'],
    },
    grantedThemes: {
      type: [String],
      default: () => [],
    },
    activeTheme: {
      type: String,
      default: 'dark',
    },
    activeTitle: {
      type: String,
      default: 'novice',
    },
    unlockedTitles: {
      type: [String],
      default: () => ['novice'],
    },
    coachStats: {
      keyErrors: { type: Object, default: {} },
      keyAttempts: { type: Object, default: {} },
      fingerErrors: { type: Object, default: {} },
      fingerAttempts: { type: Object, default: {} },
      speedDrops: { type: Number, default: 0 },
      exercisesCompleted: { type: Number, default: 0 },
      codeTestsCompleted: { type: Number, default: 0 },
    },
    avatarId: { type: String, default: 'avatar-1' },
    customAvatar: { type: String, default: null },
    frameId: { type: String, default: 'frame-basic' },
    iconId: { type: String, default: null },
    ownedAvatars: {
      type: [String],
      default: () => ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5'],
    },
    ownedFrames: { type: [String], default: () => ['frame-basic'] },
    ownedIcons: { type: [String], default: () => [] },
    purchasedShopTitles: { type: [String], default: () => [] },
    purchasedShopThemes: { type: [String], default: () => [] },
    activeSoundPack: { type: String, default: 'sound-none' },
    ownedSoundPacks: { type: [String], default: () => ['sound-none'] },
    activeTrail: { type: String, default: 'trail-normal' },
    ownedTrails: { type: [String], default: () => ['trail-normal'] },
    missionUnlockedTitles: { type: [String], default: () => [] },
    lastKnownLevel: { type: Number, default: 1 },
    missions: {
      dailyKey: { type: String, default: null },
      dailyTestsCompleted: { type: Number, default: 0 },
      dailyWordsTyped: { type: Number, default: 0 },
      dailyBestAccuracy: { type: Number, default: 0 },
      dailyBestWpm: { type: Number, default: 0 },
      dailyClaimed: { type: [String], default: () => [] },
      weeklyKey: { type: String, default: null },
      weeklyWordsTyped: { type: Number, default: 0 },
      weeklyTestsCompleted: { type: Number, default: 0 },
      weeklyClaimed: { type: [String], default: () => [] },
    },
  },
  {
    timestamps: true,
  }
);

lessonProgressSchema.path('beginner').validate({
  validator(levels) {
    return levels.every(
      (level) =>
        Number.isInteger(level) && level >= 1 && level <= LEVELS_PER_MODE
    );
  },
  message: 'Beginner levels must be between 1 and 30',
});

lessonProgressSchema.path('intermediate').validate({
  validator(levels) {
    return levels.every(
      (level) =>
        Number.isInteger(level) && level >= 1 && level <= LEVELS_PER_MODE
    );
  },
  message: 'Intermediate levels must be between 1 and 30',
});

lessonProgressSchema.path('advanced').validate({
  validator(levels) {
    return levels.every(
      (level) =>
        Number.isInteger(level) && level >= 1 && level <= LEVELS_PER_MODE
    );
  },
  message: 'Advanced levels must be between 1 and 30',
});

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
