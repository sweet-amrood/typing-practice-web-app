import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('username');

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.data.user = {
      id: user._id.toString(),
      username: user.username,
    };

    return next();
  } catch (error) {
    return next(new Error('Invalid or expired token'));
  }
};
