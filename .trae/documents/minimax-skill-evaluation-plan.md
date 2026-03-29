# MiniMax API Skill Evaluation Plan

## Objective
Evaluate the provided MiniMax API skill for accuracy against the actual codebase implementation and identify any errors or inconsistencies.

---

## Issues Found

### 1. **Base URL Error (CRITICAL)**
- **Skill Claims:** `https://api.minimax.io`
- **Actual Codebase:** `https://api.minimaxi.com/v1` ([minimaxClient.ts](file:///c:/Users/Anson Lee/Documents/trae_projects/IG-1000011/api/services/minimaxClient.ts#L3))
- **Impact:** All API calls would fail with 404 errors
- **Fix:** Change base URL to `https://api.minimaxi.com/v1`

### 2. **Video Generation Endpoints Not Implemented**
- **Skill Describes:** 3-step async video generation process
- **Actual Codebase:** No video generation service exists
- **Files Checked:** No `videoGen.ts` or similar file found
- **Impact:** Skill describes functionality that doesn't exist in the codebase

### 3. **Music Generation Endpoint Not Implemented**
- **Skill Describes:** Music generation at `/v1/music_generation`
- **Actual Codebase:** No music generation service exists
- **Files Checked:** No music generation file found
- **Impact:** Skill describes functionality that doesn't exist in the codebase

### 4. **Image Generation - Missing Error Handling**
- **Skill Claims:** "If image, video, or music generation fails, return null — do not crash the pipeline"
- **Actual Codebase:** [imageGen.ts](file:///c:/Users/Anson Lee/Documents/trae_projects/IG-1000011/api/services/imageGen.ts) throws errors on failure (line 51)
- **Impact:** The skill's error handling advice contradicts actual implementation

### 5. **TTS Model Names Mismatch**
- **Skill Claims:** `speech-2.8-turbo` (fast) or `speech-2.8-hd` (quality)
- **Actual Codebase:** Uses `speech-2.8-hd` as default, but retrieves from env var `MINIMAX_TTS_MODEL` ([tts.ts](file:///c:/Users/Anson Lee/Documents/trae_projects/IG-1000011/api/services/tts.ts#L10))
- **Impact:** Minor - the models mentioned may not exist; actual implementation allows any model via env

### 6. **TTS Endpoint Response Handling Incomplete**
- **Skill Claims:** "Response may contain base64 audio data or a URL — handle both"
- **Actual Codebase:** Handles URL, hex, and base64 ([tts.ts](file:///c:/Users/Anson Lee/Documents/trae_projects/IG-1000011/api/services/tts.ts#L41-57))
- **Note:** Actual implementation is more comprehensive than skill describes

### 7. **Image Generation - Missing `image_url` Parameter Documentation**
- **Skill Claims:** Required fields: `model`, `prompt`
- **Actual Codebase:** For image customization, `image_url` is also used ([imageCustomization.ts](file:///c:/Users/Anson Lee/Documents/trae_projects/IG-1000011/api/services/imageCustomization.ts#L22))
- **Impact:** Skill doesn't document the image-to-image capability

### 8. **Temperature Setting for JSON Output**
- **Skill Claims:** "set `temperature: 0.8`" for JSON output
- **Actual Codebase:** Uses `temperature: 0.8` ([textGen.ts](file:///c:/Users/Anson Lee/Documents/trae_projects/IG-1000011/api/services/textGen.ts#L207))
- **Status:** ✅ Correct

### 9. **JSON Parsing Pattern**
- **Skill Claims:** "Always wrap JSON.parse in try/catch and strip markdown code fences as fallback"
- **Actual Codebase:** Has extensive JSON parsing with repair logic ([textGen.ts](file:///c:/Users/Anson Lee/Documents/trae_projects/IG-1000011/api/services/textGen.ts#L34-184))
- **Status:** ✅ Correct, though actual implementation is more sophisticated

### 10. **Code Patterns Section**
- **Skill Claims:** "All API service files go in `server/services/`"
- **Actual Codebase:** Files are in `api/services/` ([file structure](file:///c:/Users/Anson Lee/Documents/trae_projects/IG-1000011/api/services/))
- **Impact:** Wrong directory path in skill

---

## Summary of Required Corrections

| # | Issue | Severity | Correction |
|---|-------|----------|------------|
| 1 | Base URL is wrong | **CRITICAL** | Change `api.minimax.io` to `api.minimaxi.com/v1` |
| 2 | Video generation not implemented | Medium | Remove video generation section or mark as "not yet implemented" |
| 3 | Music generation not implemented | Medium | Remove music generation section or mark as "not yet implemented" |
| 4 | Error handling advice contradicts code | Medium | Update error handling guidance to match actual implementation |
| 5 | Directory path wrong | Low | Change `server/services/` to `api/services/` |
| 6 | Missing `image_url` parameter | Low | Add documentation for image-to-image generation |

---

## Corrected Skill (Summary)

### Authentication
- Base URL: `https://api.minimaxi.com/v1` (NOT `api.minimax.io`)

### Endpoints Actually Implemented
1. Text Generation: `POST /chat/completions` ✅
2. Image Generation: `POST /image_generation` ✅
3. Text-to-Speech: `POST /t2a_v2` ✅

### Endpoints NOT Implemented (Remove from skill)
1. Video Generation (3-step async process)
2. Music Generation

### Code Patterns Correction
- Services location: `api/services/` (NOT `server/services/`)
