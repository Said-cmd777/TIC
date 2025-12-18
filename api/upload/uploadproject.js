import { connectToDatabase } from '../_db.js';
import { User } from '../_models.js';
import { getAuthUser, withCors } from '../_auth.js';

export default async function handler(req, res) {
  withCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    await connectToDatabase(process.env.MONGO_URI);
    const authUser = getAuthUser(req);
    if (!authUser) return res.status(401).json({ message: 'Unauthorized' });
    const { powerPointUrl, wordDocumentUrl } = req.body;
    if (!powerPointUrl || !wordDocumentUrl) {
      return res.status(400).json({ message: 'Both PowerPoint and Word URLs are required' });
    }
    const user = await User.findById(authUser.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.powerPointUrl = powerPointUrl;
    user.wordDocumentUrl = wordDocumentUrl;
    await user.save();
    return res.status(200).json({ message: 'URLs saved successfully', powerPointUrl, wordDocumentUrl });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}
