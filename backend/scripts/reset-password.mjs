import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const userId = process.argv[2];
const newPassword = process.argv[3];

if (!userId || !newPassword) {
  console.error('Usage: node scripts/reset-password.mjs <mongodbUserId> <newPassword>');
  console.error('Example: node scripts/reset-password.mjs 6a3829f600f6557245f09846 MyNewPass123');
  process.exit(1);
}

if (!mongoose.Types.ObjectId.isValid(userId)) {
  console.error('Invalid MongoDB user id:', userId);
  process.exit(1);
}

if (newPassword.length < 6) {
  console.error('Password must be at least 6 characters.');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set in .env');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const user = await User.findById(userId).select('+password');

if (!user) {
  console.error('No user found for id:', userId);
  await mongoose.disconnect();
  process.exit(1);
}

user.password = newPassword;
await user.save();

console.log('Password reset successfully');
console.log('userId:', userId);
console.log('username:', user.username);
console.log('email:', user.email);
console.log('Log in with this email and the new password you set.');

await mongoose.disconnect();
