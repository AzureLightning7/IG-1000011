import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { minimaxClient } from './minimaxClient.js';

export const generateTTS = async (text: string, sessionId: string): Promise<string> => {
  const client = minimaxClient();

  const response = await client.post(
    '/t2a_v2',
    {
      model: 'speech-2.8-turbo',
      text,
      voice_setting: {
        voice_id: 'English_Trustworthy_Female',
        speed: 1.0,
        vol: 1.0,
      },
      audio_setting: {
        format: 'mp3',
        sample_rate: 32000,
      },
    }
  );

  const audioData = response.data;
  const audioFileName = `${sessionId}-walkthrough.mp3`;
  const audioPath = path.join(process.cwd(), 'api/public/generated/audio', audioFileName);

  await fs.mkdir(path.dirname(audioPath), { recursive: true });

  if (audioData.audio_url) {
    const audioResponse = await axios.get(audioData.audio_url, { responseType: 'arraybuffer' });
    await fs.writeFile(audioPath, Buffer.from(audioResponse.data));
  } else if (audioData.data) {
    // If it's base64 or raw data, save it directly
    await fs.writeFile(audioPath, Buffer.from(audioData.data, 'base64'));
  } else {
    throw new Error('TTS response did not include audio_url/data');
  }

  return `/generated/audio/${audioFileName}`;
};
