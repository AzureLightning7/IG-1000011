import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { minimaxClient } from './minimaxClient.js';

export const generateMusic = async (prompt: string, sessionId: string): Promise<string> => {
  const client = minimaxClient();

  const response = await client.post(
    '/music_generation',
    {
      model: 'music-01',
      prompt,
      duration: 30, // seconds
    }
  );

  const musicData = response.data;
  const musicFileName = `${sessionId}-ambient-music.mp3`;
  const musicPath = path.join(process.cwd(), 'api/public/generated/audio', musicFileName);

  await fs.mkdir(path.dirname(musicPath), { recursive: true });

  if (musicData.audio_url) {
    const musicResponse = await axios.get(musicData.audio_url, { responseType: 'arraybuffer' });
    await fs.writeFile(musicPath, Buffer.from(musicResponse.data));
  } else if (musicData.data) {
    await fs.writeFile(musicPath, Buffer.from(musicData.data, 'base64'));
  } else {
    throw new Error('Music response did not include audio_url/data');
  }

  return `/generated/audio/${musicFileName}`;
};
