import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Quest from '../models/Quest.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Reading HTML file to extract levels...');
    const htmlPath = path.join(__dirname, '../../solana_fullstack_dev_roadmap.html');
    
    if (!fs.existsSync(htmlPath)) {
      throw new Error(`Roadmap HTML file not found at: ${htmlPath}`);
    }

    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    
    // Extract the LEVELS array using regex
    const levelsRegex = /const\s+LEVELS\s*=\s*\[([\s\S]*?)\];/;
    const match = htmlContent.match(levelsRegex);
    
    if (!match) {
      throw new Error('Could not find LEVELS array in the HTML file.');
    }

    const levelsRawText = match[1];

    // Clean up JS comments and evaluate text safely to get the array
    // Since it's a standard JS array representation, we can evaluate it
    const levelsJsonString = `[${levelsRawText}]`
      // Replace single line comments
      .replace(/\/\/.*$/gm, '')
      // Adjust keys to be standard JSON or parsable format if needed, 
      // but running it in Function is easier as it parses standard JS object literals:
      ;

    const getLevelsArray = new Function(`return ${levelsJsonString};`);
    const levels = getLevelsArray();

    console.log(`Parsed ${levels.length} levels from HTML.`);

    // Clear existing system quests
    console.log('Clearing existing system quests in database...');
    await Quest.deleteMany({ isCustom: false });

    // Format quests for database schema
    const formattedQuests = levels.map((lvl) => ({
      questId: lvl.id,
      phase: lvl.phase,
      title: lvl.title,
      sub: lvl.sub || '',
      skills: lvl.skills || [],
      resources: lvl.resources || [],
      isCustom: false,
      createdBy: null,
    }));

    // Seed database
    const seeded = await Quest.insertMany(formattedQuests);
    console.log(`Successfully seeded ${seeded.length} quests!`);

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
