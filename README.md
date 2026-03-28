# DormVibe 🏠✨

**DormVibe** is an AI-powered dorm room styling assistant for college students. By taking a simple "vibe quiz," students can generate a complete room design package including a mood board and an audio walkthrough—all powered by the MiniMax AI API.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd dormvibe
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### 🔑 Environment Variables

Create a `.env` file in the root directory (if it doesn't exist) and add your MiniMax API key:

```env
MINIMAX_API_KEY=your_minimax_api_key_here
MINIMAX_BASE_URL=https://api.minimaxi.com/v1
MINIMAX_TTS_MODEL=speech-2.8-hd
MINIMAX_TTS_VOICE_ID=English_expressive_narrator
```

> **Note**: Never commit your `.env` file or expose your API key in frontend code.

### 🛠️ Running the App

You can run both the frontend and backend concurrently using a single command:

```bash
npm run dev
```

- **Frontend**: Vite will print the URL in your terminal (usually `http://localhost:5173/`, or the next available port)
- **Backend**: `http://localhost:3001`

The frontend is configured to proxy API requests to the backend automatically.

## 🏗️ Tech Stack

- **Frontend**: React (with Vite), Tailwind CSS, Framer Motion, Lucide React, Zustand
- **Backend**: Node.js, Express, Axios
- **AI Integration**: MiniMax API (Text, Image, TTS)
- **Communication**: Server-Sent Events (SSE) for real-time generation progress

## 📂 Project Structure

- `src/`: React frontend source code
- `api/`: Express backend source code
- `shared/`: Shared TypeScript types
- `public/`: Static assets

## 🌟 Features

1. **Vibe Quiz**: A beautiful, interactive form to capture your style, budget, and priorities.
2. **Real-time Loading**: Watch as the AI "crafts" your vibe with live status updates.
3. **Mood Board**: High-quality AI-generated images of your styled dorm room.
4. **Audio Walkthrough**: A custom narration explaining your room's setup.
5. **Shopping List**: Curated links to Amazon and IKEA for the recommended products.

## 📜 License

This project is for educational purposes as part of a Trae Solo Builder session.
