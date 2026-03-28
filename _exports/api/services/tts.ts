import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { minimaxClient } from './minimaxClient.js';

export const generateTTS = async (text: string, sessionId: string): Promise<string> => {
  const client = minimaxClient();

  const voiceId = process.env.MINIMAX_TTS_VOICE_ID ?? 'English_expressive_narrator';
  const model = process.env.MINIMAX_TTS_MODEL ?? 'speech-2.8-hd';

  const response = await client.post('/t2a_v2', {
    model,
    text,
    stream: false,
    output_format: 'url',
    voice_setting: {
      voice_id: voiceId,
      speed: 1.0,
      vol: 1.0,
    },
    audio_setting: {
      format: 'mp3',
      sample_rate: 32000,
      bitrate: 128000,
      channel: 1,
    },
  });

  const audioData = response.data;
  const statusCode = audioData?.base_resp?.status_code;
  if (typeof statusCode === 'number' && statusCode !== 0) {
    throw new Error(audioData?.base_resp?.status_msg ?? 'TTS request failed');
  }

  const audioFileName = `${sessionId}-walkthrough.mp3`;
  const audioPath = path.join(process.cwd(), 'public/generated/audio', audioFileName);

  await fs.mkdir(path.dirname(audioPath), { recursive: true });

  const audioUrl = audioData?.data?.audio_url ?? audioData?.audio_url;
  const audioField = audioData?.data?.audio;
  const audioHex = audioField;
  const audioBase64 = audioData?.data?.data ?? audioData?.data;

  const directUrl =
    audioUrl ?? (typeof audioField === 'string' && audioField.startsWith('http') ? audioField : undefined);

  if (directUrl) {
    const audioResponse = await axios.get(directUrl, { responseType: 'arraybuffer' });
    await fs.writeFile(audioPath, Buffer.from(audioResponse.data));
  } else if (typeof audioHex === 'string' && audioHex.length > 0) {
    await fs.writeFile(audioPath, Buffer.from(audioHex, 'hex'));
  } else if (typeof audioBase64 === 'string' && audioBase64.length > 0) {
    await fs.writeFile(audioPath, Buffer.from(audioBase64, 'base64'));
  } else {
    throw new Error('TTS response did not include audio_url/audio');
  }

  return `/generated/audio/${audioFileName}`;
};
