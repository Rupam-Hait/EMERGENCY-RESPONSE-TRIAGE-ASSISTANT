<div align="center">

<br/>

# 🚑 EMERGENCY   RESPONSE   TRIAGE   ASSISTANT

<br/>

### *A clinical decision support system for real-time ER triage — powered by Gemini 2.5 Flash*

<br/>

`TypeScript` · `Node.js v18+` · `MIT License`

<br/>

**[Live Demo](https://emergency-response-triage-assistant.onrender.com)** · **[Features](#-features)** · **[Getting Started](#-getting-started)** · **[Deployment](#-deployment)**

<br/>

</div>

---

## 📋 Overview

**Emergency Response Triage Assistant** is a secure, full-stack clinical decision support tool built to assist real-time ER triage decisions. It pairs a **React + Vite** frontend with an **Express** backend proxy, streaming triage assessments from the **Gemini 2.5 Flash** model while keeping API credentials safely off the client.

> ⚕️ **Disclaimer:** This project is a technical demonstration of AI-assisted triage workflows. It is **not** a certified medical device and should not be used for real clinical decision-making without proper validation and regulatory approval.

---

## ✨ Features

| | |
|---|---|
| ⚡ **Sub-500ms Latency Pipeline** | Optimized response path, outperforming traditional sequential vector-search (RAG) setups |
| 🔒 **Secure Architecture** | API credentials stay server-side — never bundled into the client |
| 📊 **Interactive Vitals & Urgency Scorecard** | Parses streaming text live to classify urgency: *Emergent*, *Urgent*, *Semi-urgent*, *Non-urgent* |
| 🩺 **Preset Clinical Cases** | One-click presets for common emergencies — cardiac events, stroke symptoms, anaphylaxis, and more |
| 📡 **Real-Time Log Stream** | Token-by-token visualization of the triage model's reasoning and clinical step status |

---

## 🖥️ Tech Stack

<div align="center">

| Frontend | Backend | AI / Model | Tooling |
|:---:|:---:|:---:|:---:|
| React | Express | Gemini 2.5 Flash | Vite |
| TypeScript | Node.js | Streaming API | npm |

</div>

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** v18 or higher
- A **Gemini API Key** — get one from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Installation

```bash
git clone https://github.com/Rupam-Hait/EMERGENCY-RESPONSE-TRIAGE-ASSISTANT.git
cd EMERGENCY-RESPONSE-TRIAGE-ASSISTANT
npm install
```

### 3. Configure your API key

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY="your-actual-api-key-here"
```

### 4. Run in development mode

Run the backend and frontend concurrently in two terminals:

```bash
# Terminal 1 — Express backend (port 3001)
npm run dev:server
```

```bash
# Terminal 2 — Vite frontend (port 3000)
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)** to use the app.

---

## 📦 Deployment (Production Mode)

To run as a single self-contained service (Render, Railway, Heroku, etc.):

```bash
# 1. Build the frontend
npm run build

# 2. Start the Express server
npm run start
```

The Express server serves the built static assets from `dist/` and handles `/api/triage` requests on port `3000` (or your host's `PORT` variable).

### Deploying to Render

1. Create a new **Web Service** on Render and connect this repository.
2. Set **Build Command**: `npm install && npm run build`
3. Set **Start Command**: `npm run start`
4. Under **Advanced**, add environment variable `GEMINI_API_KEY` with your Gemini API key.

---

## 📁 Project Structure

```
EMERGENCY-RESPONSE-TRIAGE-ASSISTANT/
├── src/               # React frontend source
├── server.ts          # Express backend & Gemini API proxy
├── index.html         # App entry point
├── metadata.json       
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
├── .env.example       # Sample environment variables
└── package.json
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is available under the MIT License — see the `LICENSE` file for details.

---

<div align="center">

Built with ❤️ for faster, smarter emergency care

⭐ **Star this repo if you find it useful!**

</div>
