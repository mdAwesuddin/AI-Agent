import OpenAI from 'openai';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import menuData from '../../menus.json' with { type: 'json' };

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});


async function extractQuery(prompt) {
  const systemPrompt = `Extract the restaurant name and item from this prompt. Return strictly this JSON: {"restaurant": "...", "item": "..."}`;

  const completion = await openai.chat.completions.create({
    model: 'mistralai/mistral-7b-instruct',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
  });

  try {
    return JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    console.error("Failed to parse model response:", err);
    return null;
  }
}

router.post('/send', async (req, res) => {
  const { input } = req.body.task || {};
  const prompt = input?.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const query = await extractQuery(prompt);
  if (!query) {
    return res.json({ status: 'failed', output: 'Could not parse request.' });
  }

  const { restaurant, item } = query;
  const menu = menuData[restaurant];

  if (!menu) {
    return res.json({ status: 'completed', output: `Restaurant "${restaurant}" not found.` });
  }

  const price = menu[item];
  const output = price
    ? `${item} at ${restaurant} costs $${price.toFixed(2)}.`
    : `Item "${item}" not found at ${restaurant}.`;

  res.json({
    taskId: uuidv4(),
    status: 'completed',
    output,
  });
});

export default router;
