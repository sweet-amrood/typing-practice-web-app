import Friendship from '../models/Friendship.js';
import User from '../models/User.js';

const formatUser = (user) => ({
  id: user._id.toString(),
  username: user.username,
});

export const getFriendIds = async (userId) => {
  const friendships = await Friendship.find({
    status: 'accepted',
    $or: [{ requester: userId }, { recipient: userId }],
  }).lean();

  return friendships.map((friendship) =>
    friendship.requester.toString() === userId.toString()
      ? friendship.recipient.toString()
      : friendship.requester.toString()
  );
};

export const getFriendsOverview = async (userId) => {
  const [accepted, incoming, outgoing] = await Promise.all([
    Friendship.find({
      status: 'accepted',
      $or: [{ requester: userId }, { recipient: userId }],
    })
      .populate('requester', 'username')
      .populate('recipient', 'username')
      .lean(),
    Friendship.find({ recipient: userId, status: 'pending' })
      .populate('requester', 'username')
      .lean(),
    Friendship.find({ requester: userId, status: 'pending' })
      .populate('recipient', 'username')
      .lean(),
  ]);

  const friends = accepted.map((friendship) => {
    const friend =
      friendship.requester._id.toString() === userId.toString()
        ? friendship.recipient
        : friendship.requester;

    return formatUser(friend);
  });

  return {
    friends,
    incomingRequests: incoming.map((friendship) => ({
      id: friendship._id.toString(),
      user: formatUser(friendship.requester),
      createdAt: friendship.createdAt,
    })),
    outgoingRequests: outgoing.map((friendship) => ({
      id: friendship._id.toString(),
      user: formatUser(friendship.recipient),
      createdAt: friendship.createdAt,
    })),
  };
};

export const searchUsers = async (userId, query) => {
  const trimmed = query?.trim();

  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const regex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const users = await User.find({
    _id: { $ne: userId },
    username: regex,
  })
    .select('username')
    .limit(10)
    .lean();

  return users.map(formatUser);
};

export const sendFriendRequest = async (userId, targetUsername) => {
  const recipient = await User.findOne({
    username: targetUsername.trim(),
  }).select('username');

  if (!recipient) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (recipient._id.toString() === userId.toString()) {
    const error = new Error('You cannot add yourself as a friend');
    error.statusCode = 400;
    throw error;
  }

  const existing = await Friendship.findOne({
    $or: [
      { requester: userId, recipient: recipient._id },
      { requester: recipient._id, recipient: userId },
    ],
  });

  if (existing) {
    if (existing.status === 'accepted') {
      const error = new Error('You are already friends');
      error.statusCode = 400;
      throw error;
    }

    if (existing.requester.toString() === userId.toString()) {
      const error = new Error('Friend request already sent');
      error.statusCode = 400;
      throw error;
    }

    existing.status = 'accepted';
    await existing.save();

    return { message: 'Friend request accepted', friendshipId: existing._id.toString() };
  }

  const friendship = await Friendship.create({
    requester: userId,
    recipient: recipient._id,
    status: 'pending',
  });

  return {
    message: 'Friend request sent',
    friendshipId: friendship._id.toString(),
  };
};

export const respondToFriendRequest = async (userId, friendshipId, action) => {
  const friendship = await Friendship.findById(friendshipId);

  if (!friendship) {
    const error = new Error('Friend request not found');
    error.statusCode = 404;
    throw error;
  }

  if (friendship.recipient.toString() !== userId.toString()) {
    const error = new Error('Not authorized to respond to this request');
    error.statusCode = 403;
    throw error;
  }

  if (friendship.status !== 'pending') {
    const error = new Error('Friend request is no longer pending');
    error.statusCode = 400;
    throw error;
  }

  if (action === 'accept') {
    friendship.status = 'accepted';
    await friendship.save();
    return { message: 'Friend request accepted' };
  }

  await friendship.deleteOne();
  return { message: 'Friend request declined' };
};

export const removeFriend = async (userId, friendId) => {
  const friendship = await Friendship.findOne({
    status: 'accepted',
    $or: [
      { requester: userId, recipient: friendId },
      { requester: friendId, recipient: userId },
    ],
  });

  if (!friendship) {
    const error = new Error('Friendship not found');
    error.statusCode = 404;
    throw error;
  }

  await friendship.deleteOne();
  return { message: 'Friend removed' };
};
