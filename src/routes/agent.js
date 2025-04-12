import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/agent.json', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../.well-known/agent.json'));
});

export default router;
