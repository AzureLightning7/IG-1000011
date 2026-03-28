import { Router, Request, Response } from 'express';
import { generateText } from '../services/textGen.js';
import { generateImage } from '../services/imageGen.js';
import { QuizData } from '../../shared/types.js';
import crypto from 'crypto';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const quizData: QuizData = req.body;
  const sessionId = crypto.randomBytes(8).toString('hex');

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendUpdate = (step: string, status: string, data?: any) => {
    res.write(`data: ${JSON.stringify({ step, status, data })}\n\n`);
  };

  res.write(':ok\n\n');

  try {
    sendUpdate('Text Generation', 'processing');
    const content = await generateText(quizData);
    sendUpdate('Text Generation', 'completed', content);

    sendUpdate('Image Generation', 'processing');
    const imageUrl = await generateImage(content.imagePrompt, sessionId);
    sendUpdate('Image Generation', 'completed', { url: imageUrl });

    sendUpdate('Complete', 'completed', {
      ...content,
      media: {
        imageUrl,
        audioUrl: null,
      },
    });

    res.end();
  } catch (error) {
    console.error('Generation pipeline failed:', error);
    sendUpdate('Error', 'error', { message: error instanceof Error ? error.message : 'Unknown error' });
    res.end();
  }
});

export default router;
