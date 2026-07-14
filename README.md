# Emergency Response Triage Assistant

A clinical decision support system designed for real-time ER triage. Built as a secure full-stack Node.js application using a React/Vite frontend and an Express backend proxy powered by the Gemini 2.5 Flash model.

🔗 **[Live Demo](https://emergency-response-triage-assistant.onrender.com)**

## Features

- **Sub-500ms Latency Pipeline**: Demonstrates an optimized timeline path compared to traditional sequential vector search (RAG) setups.
- **Secure Architecture**: Keeps API credentials isolated on the server rather than compiling them into the browser-facing bundle.
- **Interactive Vitals & Urgency Scorecard**: Dynamically parses streaming text to determine urgency levels (*Emergent*, *Urgent*, *Semi-urgent*, *Non-urgent*).
- **Preset Clinical Cases**: Quick-select presets for common medical emergencies (e.g., cardiac issues, stroke symptoms, anaphylaxis) to run rapid testing.
- **Real-Time Log Stream**: Displays clinical step status and token-by-token triage output visualization.

---

## Run Locally

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **Gemini API Key** (Get one at [Google AI Studio](https://aistudio.google.com/app/apikey))

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/Rupam-Hait/EMERGENCY-RESPONSE-TRIAGE-ASSISTANT.git
cd EMERGENCY-RESPONSE-TRIAGE-ASSISTANT
npm install
```

### 3. Configure API Key
Create a `.env.local` file in the root directory and add your key:
```env
GEMINI_API_KEY="your-actual-api-key-here"
```

### 4. Development mode
Run the backend Express service and Vite dev server concurrently:

* **Start the Express backend (port 3001)**:
  ```bash
  npm run dev:server
  ```
* **Start the React frontend (port 3000)**:
  ```bash
  npm run dev
  ```

Open your browser to `http://localhost:3000` to view and interact with the application.

---

## Deployment (Production Mode)

To run the application in self-contained production mode on a single port (e.g., for platforms like Render, Railway, or Heroku):

1. **Build the frontend**:
   ```bash
   npm run build
   ```
2. **Start the Express server**:
   ```bash
   npm run start
   ```

The Express backend will automatically serve the built static assets from `dist/` and handle the `/api/triage` requests on port `3000` (or the port defined by your host's `PORT` environment variable).

### Deploying to Render
1. Create a new **Web Service** on Render and connect this repository.
2. Set the **Build Command** to `npm install && npm run build`.
3. Set the **Start Command** to `npm run start`.
4. Under *Advanced*, add an environment variable `GEMINI_API_KEY` set to your Google Gemini API Key.
