import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { minimaxClient } from './minimaxClient.js';

export const generateImage = async (prompt: string, sessionId: string): Promise<string> => {
  const client = minimaxClient();

  const response = await client.post(
    '/image_generation',
    {
      model: 'image-01',
      prompt,
      aspect_ratio: '16:9',
      n: 1,
      prompt_optimizer: true,
    }
  );

  const imageData = response.data?.images?.[0] ?? response.data?.data?.[0] ?? response.data?.result?.[0];
  const imageFileName = `${sessionId}-mood-board.png`;
  const imagePath = path.join(process.cwd(), 'api/public/generated/images', imageFileName);

  await fs.mkdir(path.dirname(imagePath), { recursive: true });

  if (!imageData) {
    throw new Error('Image generation returned no image data');
  }

  if (imageData.url) {
    // If it's a URL, we can just return it or download it.
    // Let's download it to keep it local as per requirement.
    const imageResponse = await axios.get(imageData.url, { responseType: 'arraybuffer' });
    await fs.writeFile(imagePath, Buffer.from(imageResponse.data));
  } else if (imageData.base64) {
    // If it's base64, save it directly
    await fs.writeFile(imagePath, Buffer.from(imageData.base64, 'base64'));
  } else {
    throw new Error('Image generation response did not include url/base64');
  }

  return `/generated/images/${imageFileName}`;
};
