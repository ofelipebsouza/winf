import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini Proxy
  app.post("/api/gemini", async (req, res) => {
    const { prompt, contents, systemPrompt, tools, responseMimeType, responseSchema, model: modelName } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not defined on the server." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      let resolvedModel = modelName || "gemini-2.5-flash";
      if (
        resolvedModel.includes("gemini-pro") ||
        resolvedModel.includes("pro-vision")
      ) {
        resolvedModel = "gemini-2.5-flash";
      }

      const contentParts = contents || (prompt ? prompt : "Hello");

      async function generateWithRetry(retries = 2) {
        for (let i = 0; i <= retries; i++) {
          try {
            return await ai.models.generateContent({
              model: resolvedModel,
              contents: contentParts,
              config: {
                temperature: 0.2,
                responseMimeType: responseMimeType || undefined,
                responseSchema: responseSchema || undefined,
                systemInstruction: systemPrompt || undefined,
                tools: tools && tools.length > 0 ? [{ functionDeclarations: tools }] : undefined,
              }
            });
          } catch (err: any) {
            const isRetryable = err.status === 503 || err.status === 429 || (err.message && err.message.includes("high demand"));
            if (i === retries || !isRetryable) {
              throw err;
            }
            console.warn(`Gemini API attempt ${i + 1} failed. Retrying in 1s...`, err.message);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      const response = await generateWithRetry();
      if (!response) throw new Error("No result from Gemini API");

      const text = response.text;
      
      // Extract function calls if any
      const functionCalls = response.functionCalls;

      res.json({ text, functionCalls });
    } catch (error: any) {
      console.error("Gemini Server Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
