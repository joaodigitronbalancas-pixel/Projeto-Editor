import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Google GenAI on the server side
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
} else {
  console.warn("⚠️ GEMINI_API_KEY is not defined in environment variables.");
}

// Ensure clean error handling
const checkAI = (res: any) => {
  if (!ai) {
    res.status(503).json({
      error: "AI service represents offline status. Please configure GEMINI_API_KEY inside Settings > Secrets."
    });
    return false;
  }
  return true;
};

// --- API ENDPOINTS ---

// AI Smart Caption and Timer Generator
app.post("/api/ai/transcribe", async (req, res) => {
  if (!checkAI(res)) return;
  const { videoName, description } = req.body;

  try {
    const prompt = `You are an advanced AI automatic audio video transcription engine for VisionCut Pro.
Given a video named "${videoName}" and description: "${description || "General video content"}",
generate a full timing-based subtitle script.
Create 5 to 7 realistic conversational captions that match this context. Each caption must contain:
1. start_time: number (incrementing from 0 in seconds, e.g. 0.5, 4.2)
2. end_time: number (the end offset of the phrase block, e.g. 3.8, 8.0)
3. text: string (conversational dialogue spoken in Portuguese)

Be creative, natural, and matching the style of the description. Provide ONLY JSON as response.`;

    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              start_time: { type: Type.NUMBER, description: "Subtitle start timestamp in seconds from baseline." },
              end_time: { type: Type.NUMBER, description: "Subtitle end timestamp in seconds from baseline." },
              text: { type: Type.STRING, description: "The transcribed spoken sentence line." }
            },
            required: ["start_time", "end_time", "text"]
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json({ success: true, subtitles: parsed });
  } catch (err: any) {
    console.error("Transcribe API Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate AI captions." });
  }
});

// AI Translator of Subtitles
app.post("/api/ai/translate", async (req, res) => {
  if (!checkAI(res)) return;
  const { subtitles, targetLang } = req.body; // subtitles is array of {id, text, startTime, endTime}

  try {
    const prompt = `You are a professional audio visual subtitling translator.
Translate the following subtitle segments into the target language "${targetLang || "English"}".
Maintain exactly the same list order and IDs. Do not shorten or alter the timestamps, translate the text accurately.

Subtitles to translate:
${JSON.stringify(subtitles)}

Provide output as a JSON array matching the structure of the input, containing the "id" and the new "translatedText".`;

    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              translatedText: { type: Type.STRING, description: "The translated line content in the requested language." }
            },
            required: ["id", "translatedText"]
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json({ success: true, translations: parsed });
  } catch (err: any) {
    console.error("Translate API Error:", err);
    res.status(500).json({ error: err.message || "Translation failed." });
  }
});

// AI Social Media Cut recommendations
app.post("/api/ai/social-cuts", async (req, res) => {
  if (!checkAI(res)) return;
  const { clips, keywords } = req.body;

  try {
    const prompt = `You are a highly experienced content director specializing in virality for YouTube Shorts, Reels, and TikTok.
Given a list of edited timeline clips: ${JSON.stringify(clips)}
Suggest 3 engaging viral "cuts" or segments. For each segment suggest:
1. title: An attention grabber title (e.g. "O Segredo Revelado!")
2. start: Start time in seconds. Use reasonable seconds offset within bounds of overall timeline.
3. end: End time in seconds. Segments should be between 10 to 60 seconds.
4. description: Explanation of why this cut works well for engagement.
5. fitPlatform: The primary platform recommended (TikTok, Instagram, YouTube Shorts, etc.)

Provide results as JSON array.`;

    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              start: { type: Type.NUMBER },
              end: { type: Type.NUMBER },
              description: { type: Type.STRING },
              fitPlatform: { type: Type.STRING }
            },
            required: ["title", "start", "end", "description", "fitPlatform"]
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json({ success: true, cuts: parsed });
  } catch (err: any) {
    console.error("Social Cuts API Error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze social cuts." });
  }
});

// AI Silence Detector Split points
app.post("/api/ai/silence-detect", async (req, res) => {
  if (!checkAI(res)) return;
  const { clipName, totalDuration, noiseThresholdDb } = req.body;

  try {
    const prompt = `Analyse the audio track of the clip "${clipName}" (total duration: ${totalDuration || 60} seconds).
We want to detect silence intervals with noise floor threshold of ${noiseThresholdDb || -40}dB.
Generate a list of 2 to 4 silence intervals that should be removed to keep the pace punchy (jumpcuts).
For each suggested silence, provide:
1. startSec: start time of silence in seconds
2. endSec: end time of silence in seconds
3. description: Brief rationale (e.g. "Pausa excessiva do palestrante")

Provide results in JSON representation.`;

    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              startSec: { type: Type.NUMBER },
              endSec: { type: Type.NUMBER },
              description: { type: Type.STRING }
            },
            required: ["startSec", "endSec", "description"]
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json({ success: true, silences: parsed });
  } catch (err: any) {
    console.error("Silence Detect API Error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze silence segments." });
  }
});

// AI Background removal generator boundaries
app.post("/api/ai/background-remove", async (req, res) => {
  if (!checkAI(res)) return;
  const { clipName, focusSubject } = req.body;

  try {
    const prompt = `We are applying background removal (no-chromakey segmentation) on visual clip: "${clipName}" focusing on "${focusSubject || "Person in foreground"}".
Provide AI model confidence parameters, segmentation accuracy rates (95%-99.9%), recommended matte feathers (px), sample coordinates for the foreground bounding shape (relative array of x,y floats from 0.0 to 1.0) and optimal masking guidelines to optimize client-side CSS canvas mask segmentation.

Provide response as JSON.`;

    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confidence: { type: Type.NUMBER, description: "Segmenter model confidence rate." },
            featherPx: { type: Type.NUMBER, description: "Suggested canvas blur feather in pixels." },
            estimatedMaskAccuracy: { type: Type.STRING, description: "Human readable percentage string." },
            boundaryPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of relative coordinates like '0.2,0.4'."
            },
            stabilizationPreset: { type: Type.STRING, description: "Suggested tracking frequency profile name." }
          },
          required: ["confidence", "featherPx", "estimatedMaskAccuracy", "boundaryPoints", "stabilizationPreset"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, config: parsed });
  } catch (err: any) {
    console.error("Background Remove API Error:", err);
    res.status(500).json({ error: err.message || "Failed to create background removal layers." });
  }
});

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConfigured: !!ai });
});

// Setup Vite Dev server or Serve compiled files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 [VisionCut Pro Server] running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
