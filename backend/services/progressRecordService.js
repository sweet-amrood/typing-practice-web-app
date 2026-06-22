import Progress from '../models/Progress.js';

export const getOrCreateProgress = async (
  userId,
  { session = null, lean = false } = {}
) => {
  let query = Progress.findOne({ userId });
  if (session) query = query.session(session);
  if (lean) query = query.lean();

  const existing = await query;
  if (existing) return existing;

  const createOptions = session ? { session } : {};
  const [created] = await Progress.create([{ userId }], createOptions);

  return lean ? created.toObject() : created;
};
