---
name: "minimax-api"
description: "Use this skill whenever building features that call MiniMax APIs including text generation, image generation, or text-to-speech. Activates when the user mentions MiniMax, image generation, TTS, or any AI content generation feature."
---

# MiniMax API Integration Skill

## Authentication
All MiniMax API calls use Bearer token auth:
- Header: `Authorization: Bearer ${process.env.MINIMAX_API_KEY}`
- Base URL: `https://api.minimaxi.com/v1` (NOT `api.minimax.io`)
- API key is stored in `.env` as `MINIMAX_API_KEY`

## Text Generation (OpenAI-compatible)
- Endpoint: `POST /chat/completions`
- Model: `MiniMax-M2.5`
- Uses standard OpenAI chat completion format with `messages` array
- Always include a system message defining the AI's role
- When requesting JSON output, set `temperature: 0.8` and instruct the model to respond with raw JSON only — no markdown backticks
- Always wrap JSON.parse in try/catch and strip markdown code fences as fallback
- Response structure includes `base_resp.status_code` (0 = success) and data in `data.choices[0].message.content`

## Image Generation
- Endpoint: `POST /image_generation`
- Model: `image-01`
- Required fields: `model`, `prompt`
- Optional: `aspect_ratio` (e.g. "16:9"), `n` (number of images), `prompt_optimizer` (boolean)
- Set `prompt_optimizer: false` when the prompt contains specific preservation instructions
- For image-to-image generation, also include `image_url` parameter with the source image
- Response contains image URL(s) in `data.image_urls[0]` or base64 in `data.image_base64[0]`

## Text-to-Speech (Synchronous)
- Endpoint: `POST /t2a_v2`
- Model: `speech-2.8-hd` (configurable via `MINIMAX_TTS_MODEL` env var)
- Required: `model`, `text`, `voice_setting`, `audio_setting`
- `voice_setting`: `{ voice_id, speed, vol }` - voice_id defaults to `English_expressive_narrator` from `MINIMAX_TTS_VOICE_ID` env var
- `audio_setting`: `{ format: "mp3", sample_rate: 32000, bitrate: 128000, channel: 1 }`
- Max 10,000 characters per request
- Response may contain URL (`data.audio_url`), hex data (`data.audio`), or base64 data - handle all three
- Check `base_resp.status_code` for errors

## Error Handling Rules
- Every API call must be wrapped in try/catch
- Log all API errors with the endpoint name and status code
- Check for `base_resp.status_code` in responses (0 = success)
- Text generation errors should propagate as 500 errors
- Image/TTS errors should be handled gracefully with appropriate fallbacks

## Code Patterns
- All API service files go in `api/services/`
- Each service exports a single async function
- All services receive parsed parameters, not raw request bodies
- Return structured objects, not raw API responses
- Use `minimaxClient()` from `minimaxClient.ts` for configured axios instance

## Example Service Structure
```typescript
import { minimaxClient } from './minimaxClient.js';

export const generateX = async (params: Params): Promise<Result> => {
  const client = minimaxClient();
  
  try {
    const response = await client.post('/endpoint', {
      model: 'model-name',
      // ... other params
    });
    
    const body = response.data;
    const statusCode = body?.base_resp?.status_code;
    if (typeof statusCode === 'number' && statusCode !== 0) {
      throw new Error(body?.base_resp?.status_msg ?? 'Request failed');
    }
    
    // Extract and return data
    return body.data;
  } catch (error) {
    // Handle error appropriately
    throw new Error(`MiniMax X generation failed: ${error.message}`);
  }
};
```
