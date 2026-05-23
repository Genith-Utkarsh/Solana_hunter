import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questId: {
    type: Number,
    required: true, // References Quest.questId
  },
  completedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

// Compound index to ensure a user can only complete a quest once
progressSchema.index({ userId: 1, questId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
