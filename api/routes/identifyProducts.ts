import express from 'express';
import { identifyProducts } from '../services/productIdentification.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { imageUrl, products } = req.body;

    // Validate request
    if (!imageUrl || !products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Missing required fields: imageUrl and products array'
      });
    }

    // Call product identification service
    const result = await identifyProducts({ imageUrl, products });

    // Return success response
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Identify products route error:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Failed to identify products'
    });
  }
});

router.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

export default router;