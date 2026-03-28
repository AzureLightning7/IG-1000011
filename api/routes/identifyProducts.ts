import { Router } from 'express';
import { identifyProductsInImage, getFallbackProductPositions, ProductIdentificationResult } from '../services/productIdentification.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { imageUrl, products } = req.body;

    if (!imageUrl || !products || !Array.isArray(products)) {
      return res.status(400).json({
        error: 'Missing required fields: imageUrl and products array are required',
      });
    }

    let result: ProductIdentificationResult;
    
    try {
      // Try AI-based identification first
      result = await identifyProductsInImage(imageUrl, products);
    } catch (aiError) {
      console.warn('AI identification failed, using fallback:', aiError);
      // Use fallback positioning if AI fails
      result = getFallbackProductPositions(products);
    }

    res.json(result);
  } catch (error) {
    console.error('Product identification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
