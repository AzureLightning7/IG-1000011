import { Router, Request, Response } from 'express';
import { generateTTS } from '../services/tts.js';
import crypto from 'crypto';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { narrationScript } = req.body;
  
  if (!narrationScript) {
    res.status(400).json({ error: 'narrationScript is required' });
    return;
  }

  try {
    const sessionId = crypto.randomBytes(8).toString('hex');
    const audioUrl = await generateTTS(narrationScript, sessionId);
    
    res.json({ audioUrl });
  } catch (error) {
    console.error('TTS generation failed:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'TTS generation failed' });
  }
});

export default router;