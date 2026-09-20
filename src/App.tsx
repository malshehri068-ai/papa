import React, { useState } from "react";
import { Header } from "./components/Header";
import { ArticleViewer } from "./components/ArticleViewer";
import { ControlsPanel } from "./components/ControlsPanel";
import { CodeSnippetModal } from "./components/CodeSnippetModal";
import { GenerationOptions, GeneratedArticle } from "./types";
import { INITIAL_ARTICLE_CONTENT } from "./data/marketingTemplates";
import { AlertCircle, CheckCircle, FileText, Globe, KeyRound, Sparkles } from "lucide-react";

export default function App() {
  const [options, setOptions] = useState<GenerationOptions>({
    contentType: "مقال مدونة",
    topic: "أهمية التسويق الرقمي للمتاجر الإلكترونية",
    prompt: "قم بكتابة مقال مدونة احترافي ومناسب لأصحاب المواقع عن الموضوع التالي:\nأهمية التسويق الرقمي للمتاجر الإلكترونية",
    model: "gemini-3.6-flash",
    tone: "تسويقي حماسي ومقنع",
    length: "متوسط",
    language: "العربية",
    targetAudience: "أصحاب المتاجر الإلكترونية والمواقع",
    aspects: [
      "الوصول للعميل المستهدف بدقة واستهداف نية الشراء",
      "قياس العائد على الاستثمار (ROI) وتقليل الهدر الإعلاني",
      "بناء ولاء دائم للعملاء واستعادة السلات المتروكة",
    ],
  });

  const [article, setArticle] = useState<GeneratedArticle>({
    id: "initial-marketing-article",
    title: "أهمية التسويق الرقمي للمتاجر الإلكترونية",
    content: INITIAL_ARTICLE_CONTENT,
    model: "gemini-3.6-flash",
    wordCount: INITIAL_ARTICLE_CONTENT.trim().split(/\s+/).filter(Boolean).length,
    readingTimeMinutes: 3,
    createdAt: new Date().toISOString(),
    prompt: "قم بكتابة مقال مدونة احترافي ومناسب لأصحاب المواقع عن الموضوع التالي:\nأهمية التسويق الرقمي للمتاجر الإلكترونية",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const handleGenerate = async () => {
    if (!options.topic.trim()) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: options.contentType,
          topic: options.topic,
          prompt: options.prompt,
          model: options.model,
          tone: options.tone,
          length: options.length,
          language: options.language || "العربية",
          targetAudience: options.targetAudience,
          aspects: options.aspects,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "تعذر توليد المحتوى من الخادم");
      }

      const words = data.text.trim().split(/\s+/).filter(Boolean).length;
      const readTime = Math.max(1, Math.round(words / 150));

      setArticle({
        id: `article-${Date.now()}`,
        title: `${options.contentType}: ${options.topic.slice(0, 45)}`,
        content: data.text,
        model: data.model || options.model,
        wordCount: words,
        readingTimeMinutes: readTime,
        createdAt: new Date().toISOString(),
        prompt: data.prompt || options.prompt,
      });

      setSuccessNotice("تم توليد المحتوى بنجاح بواسطة الذكاء الاصطناعي!");
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (err: any) {
      console.warn("Generation fallback triggered:", err);
      setErrorMessage(
        err?.message ||
          "تعذر الاتصال بـ Gemini API. يرجى التأكد من مفتاح GEMINI_API_KEY في لوحة الإعدادات (Secrets)."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-['Tajawal',sans-serif]">
      {/* Top Header */}
      <Header
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        isGenerating={isGenerating}
        onRefresh={handleGenerate}
        selectedModel={options.model}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Streamlit feature cards banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">نوع المحتوى المختار</p>
              <p className="text-sm font-bold text-stone-900">{options.contentType}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">الجمهور المستهدف</p>
              <p className="text-sm font-bold text-stone-900">أصحاب المواقع والمتاجر</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">حماية مفتاح الـ API</p>
              <p className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                <span>مشفر ومحمي تلقائياً</span>
              </p>
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">تنبيه أثناء الاتصال بـ Gemini:</p>
              <p className="text-xs mt-1 text-rose-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {successNotice && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
            <p className="font-bold">{successNotice}</p>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <ControlsPanel
              options={options}
              onChangeOptions={setOptions}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Reader / Article Column */}
          <div className="lg:col-span-7 order-1 lg:order-2 min-h-[640px]">
            <ArticleViewer article={article} isGenerating={isGenerating} />
          </div>
        </div>
      </main>

      {/* Code Snippet Modal */}
      <CodeSnippetModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        contentType={options.contentType}
        topic={options.topic}
        currentPrompt={options.prompt}
        selectedModel={options.model}
      />
    </div>
  );
}
