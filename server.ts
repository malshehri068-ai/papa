import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = 3000;

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "مفتاح GEMINI_API_KEY غير موجود في متغيرات البيئة. يُرجى ضبطه في لوحة الإعدادات."
      );
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // API endpoint for article & marketing content generation
  app.post("/api/generate", async (req, res) => {
    try {
      const {
        contentType = "مقال مدونة",
        topic = "أهمية التسويق الرقمي للمتاجر الإلكترونية",
        prompt: rawPrompt,
        model = "gemini-3.6-flash",
        tone = "تسويقي حماسي ومقنع",
        length = "متوسط",
        language = "العربية",
        targetAudience = "عامة القراء وأصحاب المواقع",
        aspects = [],
      } = req.body;

      const ai = getGeminiClient();

      // Unified prompt construction aligned with Streamlit:
      let constructedPrompt = rawPrompt;
      if (!constructedPrompt || !constructedPrompt.trim()) {
        constructedPrompt = `أنت خبير في صناعة المحتوى والتسويق الرقمي.
قم بكتابة ${contentType} باللغة العربية الفصحى السليمة والجذابة.

التفاصيل والمواصفات المطلوب الالتزام بها:
- الموضوع الرئيسي: ${topic}
- نبرة الصوت: ${tone}
- الطول المطلوب: ${length}
- الجمهور المستهدف: ${targetAudience ? targetAudience : "عامة القراء وأصحاب المواقع"}

احرص على تنظيم المحتوى باستخدام عناوين فرعية ونقاط واضحة، وجعله متوافقاً مع قواعد SEO وجذاباً للقارئ.`;
      }

      if (aspects && aspects.length > 0) {
        constructedPrompt += `\n\nنقاط إضافية للتركيز:\n${aspects.map((a: string) => `- ${a}`).join("\n")}`;
      }

      const maxRetries = 3;
      let response: any = null;
      let lastError: any = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: model || "gemini-3.6-flash",
            contents: constructedPrompt,
          });
          break;
        } catch (err: any) {
          lastError = err;
          const errMsg = String(err?.message || err);
          if ((errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("ResourceExhausted")) && attempt < maxRetries - 1) {
            // الانتظار ثانيتين قبل إعادة المحاولة (time.sleep(2))
            await new Promise((resolve) => setTimeout(resolve, 2000));
            continue;
          } else {
            throw err;
          }
        }
      }

      if (!response && lastError) {
        throw lastError;
      }

      const text = response?.text || "لم يتم استرجاع نص.";
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

      res.json({
        success: true,
        text,
        model: model || "gemini-3.6-flash",
        wordCount,
        prompt: constructedPrompt,
        contentType,
        topic,
      });
    } catch (err: any) {
      console.error("Gemini generation error:", err);
      res.status(500).json({
        success: false,
        error: err?.message || "حدث خطأ أثناء معالجة الطلب عبر Gemini API.",
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
