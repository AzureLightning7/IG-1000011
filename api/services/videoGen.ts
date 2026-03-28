import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { minimaxClient } from './minimaxClient.js';

export const generateVideo = async (prompt: string, sessionId: string): Promise<string> => {
  const client = minimaxClient();

  // Step 1: Create task
  const createResponse = await client.post(
    '/video_generation',
    {
      model: 'T2V-01',
      prompt,
    }
  );

  const task_id = createResponse.data?.task_id ?? createResponse.data?.taskId;
  if (!task_id) {
    throw new Error('Video generation did not return task_id');
  }

  // Step 2: Poll for completion
  let videoResult = null;
  for (let i = 0; i < 30; i++) {
    // Poll every 10 seconds, max 5 minutes
    await new Promise((r) => setTimeout(r, 10000));
    const statusResponse = await client.get('/query/video_generation', {
      params: {
        task_id,
      },
    });

    const statusData = statusResponse.data;
    if (statusData.status === 'Success') {
      videoResult = statusData.file_id;
      break;
    }
    if (statusData.status === 'Fail') {
      throw new Error('Video generation failed');
    }
  }

  // Step 3: Get download URL
  if (videoResult) {
    const fileResponse = await client.get('/files/retrieve', {
      params: {
        file_id: videoResult,
      },
    });
    const downloadUrl = fileResponse.data.file.download_url;
    
    // Save locally
    const videoFileName = `${sessionId}-room-preview.mp4`;
    const videoPath = path.join(process.cwd(), 'api/public/generated/videos', videoFileName);
    await fs.mkdir(path.dirname(videoPath), { recursive: true });
    const videoDataResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    await fs.writeFile(videoPath, Buffer.from(videoDataResponse.data));

    return `/generated/videos/${videoFileName}`;
  }

  throw new Error('Video generation timed out');
};
