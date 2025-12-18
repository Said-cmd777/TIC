import { connectToDatabase } from '../_db.js';
import { User } from '../_models.js';
import { withCors } from '../_auth.js';

export default async function handler(req, res) {
  withCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    await connectToDatabase(process.env.MONGO_URI);
    const { username, email, password, registrationNumber, group } = req.body;
    if (!username || !email || !password || !registrationNumber || !group) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existingReg = await User.findOne({ registrationNumber });
    if (existingReg) return res.status(400).json({ message: 'Registration number already in use' });
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already in use' });
    const user = new User({ username, email, password, registrationNumber, group });
    await user.save();
    const sanitized = user.toObject();
    delete sanitized.password;
    return res.status(201).json({ message: 'User registered successfully', user: sanitized });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}
