import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get leaderboard rankings
// @route   GET /api/leaderboard
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .select('username avatar level exp completedQuestsCount stats')
      .sort({ level: -1, exp: -1 })
      .limit(100); // Limit to top 100 players
      
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
