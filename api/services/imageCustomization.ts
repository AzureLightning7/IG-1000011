import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { minimaxClient } from './minimaxClient.js';

export const customizeImage = async (
  originalImageUrl: string,
  customizationPrompt: string,
  basePrompt: string,
  sessionId: string
): Promise<string> => {
  const client = minimaxClient();
  
  const enhancedPrompt = `${basePrompt}\n\nCustomization request: ${customizationPrompt}\n\nIMPORTANT: The original image is of a room. Preserve the original room layout, furniture placement, and overall style while implementing the specific customization request. Your output image must be at least 90% similar to the original image.`;

  const response = await client.post(
    '/image_generation',
    {
      model: 'image-01',
      prompt: enhancedPrompt,
      aspect_ratio: '16:9',
      n: 1,
      prompt_optimizer: true,
    }
  );

  const body = response.data;
  const directUrl =
    body?.data?.image_urls?.[0] ??
    body?.data?.image_url ??
    body?.image_urls?.[0] ??
    body?.image_url ??
    body?.images?.[0]?.url ??
    body?.data?.[0]?.url;

  const base64 =
    body?.data?.image_base64?.[0] ??
    body?.data?.base64 ??
    body?.image_base64?.[0] ??
    body?.base64 ??
    body?.images?.[0]?.base64 ??
    body?.data?.[0]?.base64;

  const imageFileName = `${sessionId}-customized-${Date.now()}.png`;
  const imagePath = path.join(process.cwd(), 'api/public/generated/images', imageFileName);

  await fs.mkdir(path.dirname(imagePath), { recursive: true });

  if (directUrl) {
    const imageResponse = await axios.get(directUrl, { responseType: 'arraybuffer' });
    await fs.writeFile(imagePath, Buffer.from(imageResponse.data));
  } else if (base64) {
    await fs.writeFile(imagePath, Buffer.from(base64, 'base64'));
  } else {
    throw new Error('Image generation response did not include image_urls/image_url/base64');
  }

  return `/generated/images/${imageFileName}`;
};
