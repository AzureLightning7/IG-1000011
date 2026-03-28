import { Router, Request, Response } from 'express';
import { generateText } from '../services/textGen.js';
import { generateImage } from '../services/imageGen.js';
import { generateTTS } from '../services/tts.js';
import { generateMusic } from '../services/musicGen.js';
import { generateVideo } from '../services/videoGen.js';
import { QuizData } from '../../shared/types.js';
import crypto from 'crypto';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const quizData: QuizData = req.body;
  const sessionId = crypto.randomBytes(8).toString('hex');

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendUpdate = (step: string, status: string, data?: any) => {
    res.write(`data: ${JSON.stringify({ step, status, data })}\n\n`);
  };

  res.write(':ok\n\n');

  try {
    // Step 1: Text Generation (Sequential)
    sendUpdate('Text Generation', 'processing');
    const content = await generateText(quizData);
    sendUpdate('Text Generation', 'completed', content);

    // Step 2: Parallel Generation (Image, TTS, Music)
    // Video is also parallel but slow, we'll start it and continue
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

    const ttsPromise = generateTTS(content.narrationScript, sessionId)
      .then((url) => {
        sendUpdate('TTS Generation', 'completed', { url });
        return url;
      })
      .catch((err) => {
        console.error('TTS gen failed:', err);
        sendUpdate('TTS Generation', 'error', { message: err instanceof Error ? err.message : 'TTS generation failed' });
        return null;
      });

    const musicPromise = generateMusic(content.musicPrompt, sessionId)
      .then((url) => {
        sendUpdate('Music Generation', 'completed', { url });
        return url;
      })
      .catch((err) => {
        console.error('Music gen failed:', err);
        sendUpdate('Music Generation', 'error', { message: err instanceof Error ? err.message : 'Music generation failed' });
        return null;
      });

    // Start video gen but don't wait for it to finish before sending the rest
    const videoPromise = generateVideo(content.videoPrompt, sessionId)
      .then((url) => {
        sendUpdate('Video Generation', 'completed', { url });
        return url;
      })
      .catch((err) => {
        console.error('Video gen failed:', err);
        sendUpdate('Video Generation', 'error', { message: err instanceof Error ? err.message : 'Video generation failed' });
        return null;
      });

    // Wait for the essential assets (Image, TTS, Music)
    const [imageUrl, audioUrl, musicUrl] = await Promise.all([
      imagePromise,
      ttsPromise,
      musicPromise,
    ]);

    // Send final complete data (video might still be null)
    sendUpdate('Complete', 'completed', {
      ...content,
      media: {
        imageUrl,
        audioUrl,
        musicUrl,
      },
    });

    // Keep the connection open for video update if it's still running
    await videoPromise;
    
    res.end();
  } catch (error) {
    console.error('Generation pipeline failed:', error);
    sendUpdate('Error', 'error', { message: error instanceof Error ? error.message : 'Unknown error' });
    res.end();
  }
});

export default router;
