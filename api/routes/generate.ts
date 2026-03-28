import { Router, Request, Response } from 'express';
import { generateText } from '../services/textGen.js';
import { generateImage } from '../services/imageGen.js';
import { QuizData } from '../../common/types.js';
import crypto from 'crypto';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const quizData: QuizData = req.body;
  const sessionId = crypto.randomBytes(8).toString('hex');

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendUpdate = (step: string, status: string, data?: unknown) => {
    res.write(`data: ${JSON.stringify({ step, status, data })}\n\n`);
  };

  res.write(':ok\n\n');

  try {
    // Step 1: Text Generation (Sequential)
    sendUpdate('Text Generation', 'processing');
    const content = await generateText(quizData);
    sendUpdate('Text Generation', 'completed', content);

    // Step 2: Image Generation only (TTS will be generated on demand)
    sendUpdate('Asset Generation', 'processing');

    const imagePromise = generateImage(content.imagePrompt, sessionId)
      .then((url) => {
        sendUpdate('Image Generation', 'completed', { url });
        return url;
      })
      .catch((err) => {
        console.error('Image gen failed:', err);
        sendUpdate('Image Generation', 'error', { message: err instanceof Error ? err.message : 'Image generation failed' });
        return null;
      });

    // Wait for image generation only
    const imageUrl = await imagePromise;

    // Send final complete data without audioUrl
    sendUpdate('Complete', 'completed', {
      ...content,
      media: {
        imageUrl,
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
