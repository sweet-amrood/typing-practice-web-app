import User from '../models/User.js';
import Progress from '../models/Progress.js';
import generateToken from '../utils/generateToken.js';
import { getOrCreateProgress } from '../services/progressRecordService.js';
import {
  CAREER_OPTIONS,
  DIFFICULTY_OPTIONS,
  INTEREST_OPTIONS,
} from '../utils/personalizedText.js';

const formatTypingPreferences = (preferences = {}) => ({
  interests: (preferences.interests ?? []).filter((item) =>
    INTEREST_OPTIONS.includes(item)
  ),
  careerGoal: CAREER_OPTIONS.includes(preferences.careerGoal)
    ? preferences.careerGoal
    : null,
  difficulty: DIFFICULTY_OPTIONS.includes(preferences.difficulty)
    ? preferences.difficulty
    : 'intermediate',
});

const formatUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt,
  typingPreferences: formatTypingPreferences(user.typingPreferences),
});

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password',
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field =
        existingUser.email === email.toLowerCase() ? 'email' : 'username';

      return res.status(409).json({
        success: false,
        message: `A user with this ${field} already exists`,
      });
    }

    const user = await User.create({ username, email, password });

    try {
      await Progress.create({ userId: user._id });
    } catch (progressError) {
      await User.findByIdAndDelete(user._id);
      throw progressError;
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: formatUser(user),
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      return res.status(409).json({
        success: false,
        message: `A user with this ${field} already exists`,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    await getOrCreateProgress(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: formatUser(user),
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: formatUser(req.user),
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email, typingPreferences } = req.body;

    if (!username && !email && typingPreferences === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fields to update',
      });
    }

    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;
    if (typingPreferences !== undefined) {
      updates.typingPreferences = formatTypingPreferences({
        ...formatTypingPreferences(req.user.typingPreferences),
        ...typingPreferences,
        interests: Array.isArray(typingPreferences.interests)
          ? typingPreferences.interests
              .filter((item) => INTEREST_OPTIONS.includes(item))
              .slice(0, 3)
          : formatTypingPreferences(req.user.typingPreferences).interests,
      });
    }

    const duplicate = await User.findOne({
      _id: { $ne: req.user._id },
      $or: [
        ...(updates.username ? [{ username: updates.username }] : []),
        ...(updates.email ? [{ email: updates.email }] : []),
      ],
    });

    if (duplicate) {
      const field =
        duplicate.username === updates.username ? 'username' : 'email';

      return res.status(409).json({
        success: false,
        message: `A user with this ${field} already exists`,
      });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: formatUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      return res.status(409).json({
        success: false,
        message: `A user with this ${field} already exists`,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
