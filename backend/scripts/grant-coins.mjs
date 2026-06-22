import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const userId = process.argv[2];
const amountArg = process.argv[3] ?? '1000';

if (!userId) {
  console.error('Usage: node scripts/grant-coins.mjs <mongodbUserId> [amount]');
  console.error('Example: node scripts/grant-coins.mjs 6a3829f600f6557245f09846 10000');
  process.exit(1);
}

if (!mongoose.Types.ObjectId.isValid(userId)) {
  console.error('Invalid MongoDB user id:', userId);
  process.exit(1);
}

const amount = Number(amountArg);

if (!Number.isFinite(amount) || amount <= 0) {
  console.error('Amount must be a positive number. Received:', amountArg);
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set in .env');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const objectUserId = new mongoose.Types.ObjectId(userId);

const result = await mongoose.connection.collection('progresses').findOneAndUpdate(
  { userId: objectUserId },
  { $inc: { coins: amount } },
  { returnDocument: 'after' }
);

if (!result) {
  console.error('No Progress document found for userId:', userId);
  console.error('The user may need to log in once so a progress record is created.');
  await mongoose.disconnect();
  process.exit(1);
}

console.log('Granted coins successfully');
console.log('userId:', userId);
console.log('amount added:', amount);
console.log('new balance:', result.coins);

await mongoose.disconnect();
