import { connectToDatabase } from '../_db.js';
import { User } from '../_models.js';
import { withCors } from '../_auth.js';

export default async function handler(req, res) {
  withCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    await connectToDatabase(process.env.MONGO_URI);
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '6', 10);
    const group = req.query.group || '';
    const filter = {};
    if (group) filter.group = group;
    const skip = (page - 1) * limit;
    const users = await User.find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');
    const total = await User.countDocuments(filter);
    const hasMore = page * limit < total;
    res.status(200).json({ users, hasMore });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
