import React from "react";
import {
  Sparkles,
  Sliders,
  GraduationCap,
  BookOpen,
  Layers,
  FileSpreadsheet,
  HelpCircle,
  Users,
  Radio,
  MailCheck,
  CheckCircle2,
  Lightbulb
} from "lucide-react";
import { GenerationOptions, EducationalTopic } from "../types";
import { SUGGESTED_EDUCATIONAL_TOPICS } from "../data/educationalTemplates";

interface ControlsPanelProps {
  options: GenerationOptions;
  onChangeOptions: (opts: GenerationOptions) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const EDUCATIONAL_CONTENT_TYPES = [
  {
    id: "خطة درس نموذجي",
    label: "خطة درس نموذجي",
    desc: "أهداف سلوكية، تهيئة حافزة، أنشطة، تقويم ختامي وتذكرة خروج",
    icon: BookOpen,
  },
  {
    id: "اختبار وأسئلة تقويمية",
    label: "اختبار وتقويم تحصيلي",
    desc: "أسئلة موضوعية ومقالية مع نموذج الإجابة وسلم الدرجات",
    icon: HelpCircle,
  },
  {
    id: "ورقة عمل تفاعلية",
    label: "ورقة عمل وتدريبات",
    desc: "أنشطة صفية متدرجة تراعي الفروق الفردية للطلاب",
    icon: FileSpreadsheet,
  },
  {
    id: "شرح وتبسيط مفاهيم",
    label: "شرح وتبسيط المفهوم",
    desc: "أمثلة وتشبيهات واقعية لترسيخ المفاهيم الصعبة",
    icon: Lightbulb,
  },
  {
    id: "نشاط صفي ومهمة أدائية",
    label: "نشاط تعلم نشط",
    desc: "تعلم تعاوني، حل مشكلات، فكر-زاوج-شارك، تمثيل أدوار",
    icon: Users,
  },
  {
    id: "إذاعة مدرسية متكاملة",
    label: "برنامج إذاعة مدرسية",
    desc: "مقدمة، قرآن، حديث، حكمة، وكلمة الصباح الهادفة",
    icon: Radio,
  },
  {
    id: "تقرير ورسالة لأولياء الأمور",
    label: "رسالة تربوية لولي الأمر",
    desc: "ملاحظات تعزيزية، تقارير متابعة، وشراكة أسرية مدروسة",
    icon: MailCheck,
  },
];

const SUBJECTS = [
  "العلوم العامة والفيزياء والكيمياء",
  "الرياضيات",
  "اللغة العربية (لغتي)",
  "التربية الإسلامية والقرآن",
  "الدراسات الاجتماعية والمواطنة",
  "اللغة الإنجليزية",
  "التقنية الرقمية والحاسب",
  "المهارات الحياتية والأسرية",
];

const GRADE_LEVELS = [
  "المرحلة الابتدائية (الصفوف المبكرة 1-3)",
  "المرحلة الابتدائية (الصفوف العليا 4-6)",
  "المرحلة المتوسطة",
  "المرحلة الثانوية (المسارات)",
  "رياض الأطفال والطفولة المبكرة",
  "التعليم الجامعي / العام",
];

const LEARNING_STRATEGIES = [
  "التعلم النشط والاستقصاء الموجه",
  "استراتيجية فكر - زاوج - شارك (Think-Pair-Share)",
  "التعلم التعاوني وحل المشكلات",
  "التعليم المتمايز (مراعاة الفروق الفردية)",
  "العصف الذهني والخرائط المعرفية",
  "التعلم القائم على المشاريع (PBL)",
];

const PEDAGOGICAL_TONES = [
  "تشجيعي وتحفيزي للطلاب",
  "تربوي رصين ومنهجي",
  "تفاعلي ومبسط بالأمثلة الحياتية",
  "استقصائي يحفز التفكير الناقد",
];

const LENGTHS = [
  "موجز ومركّز (نشاط سريع)",
  "نموذجي ومتوازن (حصة صفية كاملة)",
  "مفصل وشامل (وحدة متكاملة)",
];

const MODELS = [
  { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash (الموصى به)", desc: "النموذج الأحدث والأفضل للمهام التربوية والتحليلية المتقدمة" },
  { id: "gemini-flash-latest", name: "Gemini Flash Latest", desc: "إصدار فائق السرعة للمعالجة الفورية والاستجابة اللحظية" },
  { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash", desc: "صياغة تربوية متوازنة ودقيقة" },
];

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  options,
  onChangeOptions,
  onGenerate,
  isGenerating,
}) => {
  const handleSelectContentType = (type: string) => {
    onChangeOptions({
      ...options,
      contentType: type,
    });
  };

  const handleSelectSuggestedTopic = (t: EducationalTopic) => {
    onChangeOptions({
      ...options,
      topic: t.title.replace(/^[^:]+:\s*/, ""),
      subject: t.subject,
      gradeLevel: t.gradeLevel,
      contentType: t.contentType,
    });
  };

  return (
    <div className="space-y-6">
      {/* Educational Form Builder */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
            <GraduationCap className="w-5 h-5 text-teal-700" />
            <span>منشئ المحتوى والخطط التربوية</span>
          </div>
          <span className="text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md">
            معايير تربوية معتمدة
          </span>
        </div>

        {/* 1. Content Type Grid */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-2">
            1. نوع المخرج التعليمي المطلوب:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EDUCATIONAL_CONTENT_TYPES.map((item) => {
              const Icon = item.icon;
              const isSelected = options.contentType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectContentType(item.id)}
                  className={`p-2.5 rounded-xl text-right border transition cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? "bg-teal-50/90 border-teal-600 text-teal-950 font-bold shadow-2xs"
                      : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/80"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg mt-0.5 ${isSelected ? "bg-teal-600 text-white" : "bg-stone-200/60 text-stone-600"}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-semibold">{item.label}</div>
                    <div className="text-[11px] text-stone-500 font-normal line-clamp-1 mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Subject & Grade Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              2. المادة الدراسية:
            </label>
            <select
              value={options.subject}
              onChange={(e) => onChangeOptions({ ...options, subject: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-stone-300 px-3 py-2 bg-stone-50 text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              3. المرحلة والصف الدراسي:
            </label>
            <select
              value={options.gradeLevel}
              onChange={(e) => onChangeOptions({ ...options, gradeLevel: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-stone-300 px-3 py-2 bg-stone-50 text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition"
            >
              {GRADE_LEVELS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Lesson / Topic Title */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            4. عنوان الدرس أو الموضوع التعليمي:
          </label>
          <textarea
            id="topic-input"
            rows={2}
            value={options.topic}
            onChange={(e) => onChangeOptions({ ...options, topic: e.target.value })}
            placeholder="اكتب عنوان الدرس أو الفكرة الأساسية (مثال: دورة الماء في الطبيعة، حالات المادة، الفاعل ونائب الفاعل)..."
            className="w-full rounded-xl border border-stone-300 p-3 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition resize-none leading-relaxed"
          />

          {/* Quick Educational Suggestions */}
          <div className="mt-2.5">
            <span className="text-[11px] font-semibold text-stone-500 block mb-1">
              نماذج وأفكار تعليمية جاهزة للاقتباس السريع:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_EDUCATIONAL_TOPICS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSuggestedTopic(item)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                    options.topic.includes(item.subject) || options.topic === item.title.replace(/^[^:]+:\s*/, "")
                      ? "bg-teal-100/80 border-teal-500 text-teal-950 font-bold"
                      : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Learning Strategy */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            5. استراتيجية التدريس المفضلة:
          </label>
          <select
            value={options.learningStrategy}
            onChange={(e) => onChangeOptions({ ...options, learningStrategy: e.target.value })}
            className="w-full text-xs sm:text-sm rounded-xl border border-stone-300 px-3 py-2 bg-stone-50 text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition"
          >
            {LEARNING_STRATEGIES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            id="generate-educational-content-btn"
            type="button"
            disabled={isGenerating || !options.topic.trim()}
            onClick={onGenerate}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-sm transition cursor-pointer"
          >
            <Sparkles className={`w-5 h-5 ${isGenerating ? "animate-spin" : ""}`} />
            <span>
              {isGenerating
                ? "جارِ إعداد المحتوى التعليمي بواسطة الذكاء الاصطناعي..."
                : `إعداد ${options.contentType} الآن`}
            </span>
          </button>
        </div>
      </div>

      {/* Advanced Pedagogical Options */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-stone-900 pb-2 border-b border-stone-100">
          <Sliders className="w-4 h-4 text-teal-700" />
          <span>المعايير التربوية والأسلوب التدريسي</span>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            الأسلوب والنبرة التربوية:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PEDAGOGICAL_TONES.map((toneOption) => (
              <button
                key={toneOption}
                type="button"
                onClick={() => onChangeOptions({ ...options, tone: toneOption })}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm text-right border transition cursor-pointer ${
                  options.tone === toneOption
                    ? "bg-teal-50 border-teal-600 text-teal-900 font-bold"
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
            عمق وحجم المحتوى:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {LENGTHS.map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => onChangeOptions({ ...options, length: len })}
                className={`px-3 py-2 rounded-xl text-xs text-right border transition cursor-pointer ${
                  options.length === len
                    ? "bg-teal-50 border-teal-600 text-teal-900 font-bold"
                    : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>

        {/* Model Selector */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            نموذج الذكاء الاصطناعي (Gemini):
          </label>
          <div className="grid grid-cols-1 gap-2">
            {MODELS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onChangeOptions({ ...options, model: m.id })}
                className={`p-3 rounded-xl text-right border transition cursor-pointer flex flex-col gap-0.5 ${
                  options.model === m.id
                    ? "bg-teal-50/80 border-teal-600 text-stone-900"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-stone-900">
                    {m.name}
                  </span>
                  {options.model === m.id && (
                    <span className="text-[11px] font-medium text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
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
