import mongoose from 'mongoose';

const questSchema = new mongoose.Schema({
  questId: {
    type: Number,
    required: true,
    unique: true, // This will cover 0-99 and custom ones 100+
  },
  phase: {
    type: Number,
    required: true, // 0: Foundations, 1: Web Dev, 2: Web3, 3: Solana Core, 4: Advanced, 5: Job Ready
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  sub: {
    type: String,
    default: '',
    trim: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  resources: {
    type: [String],
    default: [],
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  }
}, {
  timestamps: true,
});

const Quest = mongoose.model('Quest', questSchema);
export default Quest;
