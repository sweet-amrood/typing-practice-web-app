import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const userId = process.argv[2] ?? '6a3829f600f6557245f09846';
const ALL_THEMES = ['dark', 'cyberpunk', 'matrix', 'retro', 'ocean', 'purple-neon'];

await mongoose.connect(process.env.MONGODB_URI);

const result = await mongoose.connection.collection('progresses').findOneAndUpdate(
  { userId: new mongoose.Types.ObjectId(userId) },
  {
    $set: {
      grantedThemes: ALL_THEMES,
    },
  },
  { returnDocument: 'after' }
);

if (!result) {
  console.error('No Progress document found for userId:', userId);
  process.exit(1);
}

console.log('Updated user:', userId);
console.log('grantedThemes:', result.grantedThemes);
await mongoose.disconnect();
