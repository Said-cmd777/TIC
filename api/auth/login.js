import { connectToDatabase } from '../_db.js';
import { User } from '../_models.js';
import jwt from 'jsonwebtoken';
import { withCors } from '../_auth.js';

export default async function handler(req, res) {
  withCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    await connectToDatabase(process.env.MONGO_URI);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    const sanitized = user.toObject();
    delete sanitized.password;
    return res.status(200).json({ message: 'Login successful', token, user: sanitized });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}
