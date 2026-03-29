import { Router, Request, Response } from 'express';
import { customizeImage } from '../services/imageCustomization.js';
import { generateText } from '../services/textGen.js';
import { ImageCustomizationRequest, QuizData, GeneratedContent } from '../../shared/types.js';
import crypto from 'crypto';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { originalImageUrl, customizationPrompt, vibeName, color, layout, style, quizData }: ImageCustomizationRequest & { quizData?: QuizData } = req.body;
    const sessionId = crypto.randomBytes(8).toString('hex');

    // Build combined prompt from all customization options
    const promptParts: string[] = [];
    
    if (vibeName) {
      promptParts.push(`${vibeName} dorm room`);
    }
    
    if (color) {
      promptParts.push(`color scheme: ${color}`);
    }
    
    if (layout) {
      promptParts.push(`layout: ${layout}`);
    }
    
    if (style) {
      promptParts.push(`style: ${style}`);
    }
    
    if (customizationPrompt && customizationPrompt.trim()) {
      promptParts.push(customizationPrompt.trim());
    }

    const combinedPrompt = promptParts.join(', ');
    
    if (!combinedPrompt) {
      return res.status(400).json({
        success: false,
        error: 'No customization options provided',
        message: 'Please select at least one customization option or enter a custom prompt'
      });
    }

    let updatedContent: GeneratedContent | null = null;
    
    // Regenerate text content if quizData is provided
    if (quizData) {
      updatedContent = await generateText(quizData);
    }

    const newImageUrl = await customizeImage(
      originalImageUrl,
      combinedPrompt,
      vibeName || 'Custom',
      sessionId
    );

    res.status(200).json({
      success: true,
      newImageUrl,
      updatedContent
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
