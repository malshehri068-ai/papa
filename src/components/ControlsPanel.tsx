import React from "react";
import { Sparkles, Sliders, Lightbulb, MessageSquareText, Layers, FileText, Send } from "lucide-react";
import { GenerationOptions, MarketingTopic } from "../types";
import { SUGGESTED_TOPICS } from "../data/marketingTemplates";

interface ControlsPanelProps {
  options: GenerationOptions;
  onChangeOptions: (opts: GenerationOptions) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const CONTENT_TYPES = [
  { id: "مقال مدونة", label: "مقال مدونة", desc: "مقال مفصل ومحسّن لمحركات البحث (SEO)" },
  { id: "منشور منصات التواصل الاجتماعي", label: "منشور تواصل اجتماعي", desc: "تغريدة، ثريد، أو منشور لينكد إن/إنستغرام" },
  { id: "وصف منتج", label: "وصف منتج", desc: "نص إقناعي وجذاب لزيادة مبيعات المتجر" },
  { id: "نص صفحة هبوط (Landing Page)", label: "نص صفحة هبوط", desc: "عناوين وفوائد قوية لتحفيز التحويل (CRO)" },
  { id: "بريد إلكتروني تسويقي", label: "بريد إلكتروني تسويقي", desc: "رسالة تسويقية جاذبة لزيادة التفاعل والمبيعات" },
];

const TONES = [
  "احترافي ورسمي",
  "تسويقي حماسي ومقنع",
  "ودود وبسيط",
  "تعليمي وإرشادي",
];

const LENGTHS = [
  "قصير وموجز",
  "متوسط",
  "مفصل وشامل",
];

const MODELS = [
  { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash", desc: "النموذج الذكي والسريع لمعالجة وصناعة المحتوى" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", desc: "سريع ومثالي للمهام الخفيفة" },
];

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  options,
  onChangeOptions,
  onGenerate,
  isGenerating,
}) => {
  const handleSelectContentType = (type: string) => {
    const updated = {
      ...options,
      contentType: type,
      prompt: `قم بكتابة ${type} احترافي ومناسب لأصحاب المواقع عن الموضوع التالي:\n${options.topic || "أهمية التسويق الرقمي للمتاجر الإلكترونية"}`,
    };
    onChangeOptions(updated);
  };

  const handleTopicChange = (newTopic: string) => {
    onChangeOptions({
      ...options,
      topic: newTopic,
      prompt: `قم بكتابة ${options.contentType || "مقال مدونة"} احترافي ومناسب لأصحاب المواقع عن الموضوع التالي:\n${newTopic}`,
    });
  };

  const handleSelectSuggestedTopic = (topic: MarketingTopic) => {
    onChangeOptions({
      ...options,
      topic: topic.title,
      prompt: `قم بكتابة ${options.contentType || "مقال مدونة"} احترافي ومناسب لأصحاب المواقع عن الموضوع التالي:\n${topic.title}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Input Builder */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>مدخلات توليد المحتوى الديناميكية</span>
          </div>
          <span className="text-[11px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
            input()
          </span>
        </div>

        {/* 1. Content Type Input */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            1. نوع المحتوى (Content Type):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2">
            {CONTENT_TYPES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectContentType(item.id)}
                className={`p-2 rounded-xl text-xs text-right border transition cursor-pointer flex flex-col justify-between ${
                  options.contentType === item.id
                    ? "bg-amber-50 border-amber-500 text-amber-900 font-bold shadow-2xs"
                    : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-stone-400 font-normal line-clamp-1">
                  {item.desc}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="custom-content-type"
              type="text"
              value={options.contentType}
              onChange={(e) => handleSelectContentType(e.target.value)}
              placeholder="أو اكتب نوع مخصص (مثال: بريد ترحيبي، تغريدة، إعلان سناب)..."
              className="w-full text-xs sm:text-sm rounded-xl border border-stone-300 px-3 py-2 bg-stone-50/50 text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>
        </div>

        {/* 2. Topic Input */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            2. الموضوع (Topic):
          </label>
          <textarea
            id="topic-input"
            rows={2}
            value={options.topic}
            onChange={(e) => handleTopicChange(e.target.value)}
            placeholder="أدخل الموضوع (مثال: أهمية التسويق الرقمي للمتاجر الإلكترونية)..."
            className="w-full rounded-xl border border-stone-300 p-3 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition resize-none leading-relaxed"
          />

          {/* Quick Suggestions for topic */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUGGESTED_TOPICS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSuggestedTopic(item)}
                className={`text-[11px] px-2 py-1 rounded-lg border transition cursor-pointer ${
                  options.topic === item.title
                    ? "bg-amber-100/70 border-amber-400 text-amber-900 font-bold"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Resulting Prompt Display (f-string in Python) */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5 font-medium">
            <span className="flex items-center gap-1">
              <MessageSquareText className="w-3.5 h-3.5 text-amber-600" />
              الأمر المرسل للنموذج (Prompt Engineering):
            </span>
            <span className="text-[10px] text-stone-400 font-mono">f-string</span>
          </div>
          <div className="bg-stone-900 text-stone-200 text-xs p-3 rounded-xl border border-stone-800 font-mono leading-relaxed whitespace-pre-wrap" dir="rtl">
            <span className="text-amber-400">{`أنت خبير في صناعة المحتوى والتسويق الرقمي.\nقم بكتابة `}</span>
            <span className="text-emerald-400 underline decoration-dotted font-semibold">{options.contentType || "مقال مدونة"}</span>
            <span className="text-amber-400">{` باللغة العربية الفصحى السليمة والجذابة.\n\nالتفاصيل والمواصفات المطلوب الالتزام بها:\n- الموضوع الرئيسي: `}</span>
            <span className="text-sky-300 underline decoration-dotted">{options.topic || "..."}</span>
            <span className="text-amber-400">{`\n- نبرة الصوت: `}</span>
            <span className="text-amber-200">{options.tone || "تسويقي حماسي ومقنع"}</span>
            <span className="text-amber-400">{`\n- الطول المطلوب: `}</span>
            <span className="text-amber-200">{options.length || "متوسط"}</span>
            <span className="text-amber-400">{`\n- الجمهور المستهدف: `}</span>
            <span className="text-amber-200">{options.targetAudience || "عامة القراء وأصحاب المواقع"}</span>
            <span className="text-stone-400">{`\n\nاحرص على تنظيم المحتوى باستخدام عناوين فرعية ونقاط واضحة، وجعله متوافقاً مع قواعد SEO وجذاباً للقارئ.`}</span>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            id="generate-article-btn"
            type="button"
            disabled={isGenerating || !options.topic.trim()}
            onClick={onGenerate}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-sm transition cursor-pointer"
          >
            <Sparkles className={`w-5 h-5 ${isGenerating ? "animate-spin" : ""}`} />
            <span>
              {isGenerating
                ? "جارِ جلب المحتوى بواسطة Gemini..."
                : `توليد ${options.contentType || "المحتوى"} الآن`}
            </span>
          </button>
        </div>
      </div>

      {/* Advanced Customization Options */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-stone-900 pb-2 border-b border-stone-100">
          <Sliders className="w-4 h-4 text-amber-600" />
          <span>المعايير المتقدمة للأسلوب والنموذج</span>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            نبرة المحتوى:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TONES.map((toneOption) => (
              <button
                key={toneOption}
                type="button"
                onClick={() => onChangeOptions({ ...options, tone: toneOption })}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm text-right border transition cursor-pointer ${
                  options.tone === toneOption
                    ? "bg-amber-50 border-amber-500 text-amber-900 font-bold"
                    : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                }`}
              >
                {toneOption}
              </button>
            ))}
          </div>
        </div>

        {/* Length Selector */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            حجم/طول المحتوى:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {LENGTHS.map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => onChangeOptions({ ...options, length: len })}
                className={`px-3 py-2 rounded-xl text-xs text-right border transition cursor-pointer ${
                  options.length === len
                    ? "bg-amber-50 border-amber-500 text-amber-900 font-bold"
                    : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>

        {/* Target Audience Input */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            الجمهور المستهدف (اختياري):
          </label>
          <input
            type="text"
            value={options.targetAudience}
            onChange={(e) => onChangeOptions({ ...options, targetAudience: e.target.value })}
            placeholder="مثال: أصحاب المتاجر الإلكترونية المبتدئين"
            className="w-full text-xs sm:text-sm rounded-xl border border-stone-300 px-3 py-2 bg-stone-50/50 text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </div>

        {/* Model Selector */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            نموذج Gemini:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {MODELS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onChangeOptions({ ...options, model: m.id })}
                className={`p-3 rounded-xl text-right border transition cursor-pointer flex flex-col gap-0.5 ${
                  options.model === m.id
                    ? "bg-amber-50/80 border-amber-500 text-stone-900"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-stone-900">
                    {m.name}
                  </span>
                  {options.model === m.id && (
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      محدد
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-500">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
