import express from 'express';
import Quest from '../models/Quest.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all quests (system + custom for user) with completion status
// @route   GET /api/quests
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Get all system quests and custom quests created by this user
    const quests = await Quest.find({
      $or: [
        { isCustom: false },
        { isCustom: true, createdBy: req.user._id }
      ]
    }).sort({ questId: 1 });

    // Get all completed progress for this user
    const completedProgress = await Progress.find({ userId: req.user._id });
    const completedQuestIds = new Set(completedProgress.map(p => p.questId));

    // Map quests to include isCompleted flag
    const formattedQuests = quests.map(quest => {
      const qObj = quest.toObject();
      qObj.isCompleted = completedQuestIds.has(quest.questId);
      return qObj;
    });

    res.json(formattedQuests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a custom quest
// @route   POST /api/quests
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, sub, phase, skills, resources } = req.body;

  if (!title || phase === undefined) {
    return res.status(400).json({ message: 'Title and Phase are required' });
  }

  try {
    // Find highest questId to assign next number (system ends at 99, custom starts at 100+)
    const highestQuest = await Quest.findOne().sort({ questId: -1 });
    const nextQuestId = highestQuest ? highestQuest.questId + 1 : 100;

    const quest = await Quest.create({
      questId: nextQuestId,
      phase: Number(phase),
      title,
      sub: sub || '',
      skills: skills || [],
      resources: resources || [],
      isCustom: true,
      createdBy: req.user._id,
    });

    res.status(201).json(quest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a custom quest
// @route   DELETE /api/quests/:questId
// @access  Private
router.delete('/:questId', protect, async (req, res) => {
  try {
    const questId = Number(req.params.questId);
    
    // Find quest
    const quest = await Quest.findOne({ questId });

    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    // Verify ownership
    if (!quest.isCustom || String(quest.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this quest' });
    }

    // Delete quest and progress
    await Quest.deleteOne({ questId });
    await Progress.deleteMany({ questId, userId: req.user._id });

    // Update user stats after deleting progress
    await updatePlayerStatsAndLevel(req.user._id);

    res.json({ message: 'Custom quest removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle quest completion status
// @route   POST /api/quests/:questId/toggle
// @access  Private
router.post('/:questId/toggle', protect, async (req, res) => {
  try {
    const questId = Number(req.params.questId);

    // Verify quest exists
    const quest = await Quest.findOne({ questId });
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    // Check if progress already exists
    const existingProgress = await Progress.findOne({
      userId: req.user._id,
      questId,
    });

    let isCompleted = false;

    if (existingProgress) {
      // Remove progress (mark incomplete)
      await Progress.deleteOne({ _id: existingProgress._id });
      isCompleted = false;
    } else {
      // Create progress (mark complete)
      await Progress.create({
        userId: req.user._id,
        questId,
      });
      isCompleted = true;
    }

    // Recalculate level, stats, and inventory unlocks
    const updatedUser = await updatePlayerStatsAndLevel(req.user._id);

    res.json({
      questId,
      isCompleted,
      user: {
        level: updatedUser.level,
        exp: updatedUser.exp,
        completedQuestsCount: updatedUser.completedQuestsCount,
        stats: updatedUser.stats,
        inventory: updatedUser.inventory,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to update player stats, level, and inventory
async function updatePlayerStatsAndLevel(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Get all completed quest IDs
  const completedProgress = await Progress.find({ userId });
  const completedQuestIds = completedProgress.map(p => p.questId);

  // Get the actual completed quest documents to determine their phases
  const completedQuests = await Quest.find({
    questId: { $in: completedQuestIds }
  });

  // Calculate counts per phase
  // Phase 0 -> Intelligence
  // Phase 1 -> Strength
  // Phase 2, 3 -> Agility
  // Phase 4, 5 -> Luck
  let intelligence = 0;
  let strength = 0;
  let agility = 0;
  let luck = 0;

  completedQuests.forEach(q => {
    if (q.phase === 0) intelligence++;
    else if (q.phase === 1) strength++;
    else if (q.phase === 2 || q.phase === 3) agility++;
    else if (q.phase === 4 || q.phase === 5) luck++;
  });

  // Update stats
  user.stats = { intelligence, strength, agility, luck };

  // Set level & completed count
  const totalCompleted = completedQuestIds.length;
  user.completedQuestsCount = totalCompleted;
  user.level = totalCompleted; // Level matches total completed quests (gamified tracker design)
  
  // Calculate total system quests completed
  const systemQuests = await Quest.find({ isCustom: false });
  const totalSystemQuests = systemQuests.length || 100;
  
  // Overall EXP progress percentage is mapped to 0-100
  user.exp = Math.min(100, Math.round((totalCompleted / totalSystemQuests) * 100));

  // Determine inventory achievements
  const inventory = [];

  // 1. Silicon Badge & Keyboard of Truth (Phase 1 complete)
  const phase1Quests = systemQuests.filter(q => q.phase === 0);
  const phase1Completed = completedQuests.filter(q => q.phase === 0 && !q.isCustom).length;
  if (phase1Quests.length > 0 && phase1Completed === phase1Quests.length) {
    inventory.push('Silicon Badge');
    inventory.push('Keyboard of Truth');
  }

  // 2. Web Shield & Styling Cloak (Phase 2 complete)
  const phase2Quests = systemQuests.filter(q => q.phase === 1);
  const phase2Completed = completedQuests.filter(q => q.phase === 1 && !q.isCustom).length;
  if (phase2Quests.length > 0 && phase2Completed === phase2Quests.length) {
    inventory.push('Web Shield');
    inventory.push('Styling Cloak');
  }

  // 3. Sword of Solana (Level 50 reached)
  if (user.level >= 50) {
    inventory.push('Sword of Solana');
  }

  // 4. Monarch Crown (Complete all 100 system levels)
  const systemCompletedCount = completedQuests.filter(q => !q.isCustom).length;
  if (systemCompletedCount >= totalSystemQuests) {
    inventory.push('Monarch Crown');
  }

  user.inventory = inventory;

  await user.save();
  return user;
}

export default router;
