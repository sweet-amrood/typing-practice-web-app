import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const lookup = process.argv[2];

if (!lookup) {
  console.error('Usage: node scripts/diagnose-user.mjs <email|userId>');
  console.error('Example: node scripts/diagnose-user.mjs musharibrehman1234@gmail.com');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set in .env');
  process.exit(1);
}

const maskedUri = process.env.MONGODB_URI.replace(
  /(mongodb(\+srv)?:\/\/)([^:]+):([^@]+)@/,
  '$1$3:****@'
);

await mongoose.connect(process.env.MONGODB_URI);

console.log('Connected to:', maskedUri);

let user = null;

if (mongoose.Types.ObjectId.isValid(lookup)) {
  user = await User.findById(lookup).select('+password');
} else {
  user = await User.findOne({
    email: String(lookup).trim().toLowerCase(),
  }).select('+password');
}

if (!user) {
  console.error('No user found for:', lookup);
  console.error('This account does not exist in THIS database.');
  await mongoose.disconnect();
  process.exit(1);
}

const progress = await mongoose.connection.collection('progresses').findOne({
  userId: user._id,
});

console.log('');
console.log('User found');
console.log('  id:', user._id.toString());
console.log('  username:', user.username);
console.log('  email:', user.email);
console.log('  hasPassword:', Boolean(user.password));
console.log('  passwordLooksHashed:', user.password?.startsWith('$2') ?? false);
console.log('  hasProgress:', Boolean(progress));
console.log('');
console.log(
  'Login on Netlify uses the database shown above (Render MONGODB_URI on Atlas).'
);
console.log(
  'Local npm run dev uses backend/.env MONGODB_URI — often localhost, a different DB.'
);

if (process.argv[3]) {
  const matches = await user.comparePassword(process.argv[3]);
  console.log('');
  console.log('Password test:', matches ? 'MATCH' : 'NO MATCH');
}

await mongoose.disconnect();
