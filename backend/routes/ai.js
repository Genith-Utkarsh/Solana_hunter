import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Quest from '../models/Quest.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get AI study guide explanation for a quest
// @route   POST /api/ai/explain
// @access  Private
router.post('/explain', protect, async (req, res) => {
  const { questId } = req.body;

  if (questId === undefined) {
    return res.status(400).json({ message: 'questId is required' });
  }

  try {
    const quest = await Quest.findOne({ questId });

    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let responseText = '';

    if (apiKey) {
      // Initialize Gemini Client
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        You are the 'Solana Hunter System AI', an advanced training interface.
        A user has requested training instructions for Level ${quest.questId}: "${quest.title}".
        Subtopics: ${quest.sub}.
        Key Skills: ${quest.skills.join(', ')}.
        Resources: ${quest.resources.join(', ')}.

        Write a response matching a high-tech cyberpunk gaming system. Speak directly to the 'Hunter'.
        Format the response in structured markdown with the following sections:
        
        # SYSTEM BRIEF: LEVEL ${quest.questId}
        Provide a concise, motivating, and conceptual explanation of what this level represents, why it matters, and the core technologies involved (e.g., HTTP, React state, Rust ownership).
        
        # SYSTEM CORE TECHNIQUES
        Provide clean, production-ready code snippets (e.g., HTML, JS, TS, Rust, or CLI commands depending on the level), showing exactly how this technology is used in practice. Keep it well-commented and detailed.
        
        # SYSTEM EXERCISE & LOOT
        Give the hunter a practical, concrete mini-project or exercise they must complete to master this level, along with key performance indicators (KPIs) to self-verify.

        Ensure you do not break the cyberpunk "System AI" persona (e.g., use words like 'awakened', 'dungeon', 'hunter', 'mana cost', 'compute limits'). Do not use generic chatbot disclaimers.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      responseText = response.text();
    } else {
      // Fallback cyberpunk response template if no API Key is set
      responseText = `
# SYSTEM BRIEF: LEVEL ${quest.questId} - ${quest.title.toUpperCase()}
> [!NOTE]
> **SYSTEM STATUS: OFFLINE MODE (No GEMINI_API_KEY detected in env)**
> Custom server link to Gemini not found. Activating local databases.

Welcome, Hunter. You have activated the training archives for **Level ${quest.questId}: ${quest.title}**.
This segment covers: *${quest.sub || 'General study guides'}*.

To master this dungeon, you must acquire the following cognitive nodes:
${quest.skills.map(s => `- **${s}**`).join('\n')}

This knowledge forms the foundation of your Web3 Awakening. Without it, your compute budget will be wasted and transaction execution will fail.

# SYSTEM CORE TECHNIQUES
Below is a standard manual template for this level. To unlock dynamic guides, please insert your \`GEMINI_API_KEY\` in the backend environment.

### Code / Concept Archetype:
\`\`\`javascript
// Level ${quest.questId} Archetype Implementation
const initializeNode = async (address) => {
  console.log("System Initializing Level ${quest.questId} on: " + address);
  try {
    const data = {
      level: ${quest.questId},
      title: "${quest.title}",
      status: "ACTIVE_TRAINING",
      skillsRequired: ${JSON.stringify(quest.skills)}
    };
    return data;
  } catch (error) {
    console.error("Initialization failed:", error);
    return null;
  }
};
\`\`\`

# SYSTEM EXERCISE & LOOT
### Quest Objective:
1. Research the provided assets:
${quest.resources.map(r => `   - [${r}](#)`).join('\n')}
2. Create a localized repository to demonstrate your capabilities.
3. Test edge cases and ensure performance constraints are met.

**System Rewards Unlocked**: +100 EXP, +1 to Level Stats.
      `;
    }

    res.json({ text: responseText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
