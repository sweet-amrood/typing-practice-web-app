import {
  getFriendsOverview,
  removeFriend,
  respondToFriendRequest,
  searchUsers,
  sendFriendRequest,
} from '../services/friendService.js';

export const getFriends = async (req, res) => {
  try {
    const data = await getFriendsOverview(req.user._id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchFriendUsers = async (req, res) => {
  try {
    const users = await searchUsers(req.user._id, req.query.q);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createFriendRequest = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Username is required',
      });
    }

    const data = await sendFriendRequest(req.user._id, username);

    res.status(201).json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFriendRequest = async (req, res) => {
  try {
    const { action } = req.body;
    const { id } = req.params;

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be accept or decline',
      });
    }

    const data = await respondToFriendRequest(req.user._id, id, action);

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFriend = async (req, res) => {
  try {
    const data = await removeFriend(req.user._id, req.params.friendId);

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
