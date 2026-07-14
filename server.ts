import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Check if we are running in production by verifying if the build output exists
const isProduction = fs.existsSync(path.join(__dirname, 'dist'));
const PORT = process.env.PORT || (isProduction ? 3000 : 3001);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set!");
}

const ai = new GoogleGenAI({ apiKey });

// Define the Triage API endpoint with plain JSON-line streaming
app.post('/api/triage', async (req, res) => {
  const { input, medicalContext } = req.body;
  if (!input) {
    return res.status(400).json({ error: 'Input description is required' });
  }

  try {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const prompt = `You are an ER Triage Assistant. Based on this patient description, provide a quick triage assessment including:
1. Triage Priority (Emergent, Urgent, Semi-urgent, Non-urgent)
2. Primary Risk Factors
3. Recommended Immediate Actions / First Aid
4. Recommended Department / Specialist
5. Checklist of Critical Vitals to monitor

Keep it highly concise, professional, and formatted in Markdown.
    
Patient Description: ${input}
${medicalContext ? `Patient Medical History Summary: ${medicalContext}` : ''}`;

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(JSON.stringify({ text: chunk.text }) + '\n');
      }
    }

    res.end();
  } catch (error: any) {
    console.error('Error generating triage response:', error);
    res.write(JSON.stringify({ error: error.message || 'Error generating triage response' }) + '\n');
    res.end();
  }
});

// Serve static assets in production
if (isProduction) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Emergency Response Triage Assistant Backend is running in DEVELOPMENT mode. Frontend is at http://localhost:3000');
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} (Mode: ${isProduction ? 'Production' : 'Development'})`);
});
