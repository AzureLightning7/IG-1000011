import { Router, Request, Response } from 'express';
import { customizeImage } from '../services/imageCustomization.js';
import { ImageCustomizationRequest } from '../../shared/types.js';
import crypto from 'crypto';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { originalImageUrl, customizationPrompt, vibeName }: ImageCustomizationRequest = req.body;
    const sessionId = crypto.randomBytes(8).toString('hex');

    const basePrompt = vibeName 
      ? `${vibeName} dorm room, ${customizationPrompt}` 
      : customizationPrompt;

    const newImageUrl = await customizeImage(
      originalImageUrl,
      customizationPrompt,
      basePrompt,
      sessionId
    );

    res.status(200).json({
      success: true,
      newImageUrl
    });
  } catch (error) {
    console.error('Image customization failed:', error);
    res.status(500).json({
      success: false,
      error: 'Image customization failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
