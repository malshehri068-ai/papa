import React, { useState } from "react";
import { X, Copy, Check, Terminal } from "lucide-react";

interface CodeSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: string;
  topic: string;
  currentPrompt: string;
  selectedModel: string;
}

export const CodeSnippetModal: React.FC<CodeSnippetModalProps> = ({
  isOpen,
  onClose,
  contentType,
  topic,
  selectedModel,
}) => {
  const [tab, setTab] = useState<"streamlit" | "python" | "requirements" | "typescript">("streamlit");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const requirementsTxt = `streamlit>=1.42.0
google-genai>=1.0.0`;

  const streamlitCode = `import time
import streamlit as st
from google import genai

# إعداد واجهة التطبيق
st.set_page_config(
    page_title="مولد المحتوى الذكي", page_icon="✍️", layout="centered"
)
st.title("✍️ مولد المحتوى الذكي المتقدم لأصحاب المواقع")

# حقل إدخال مفتاح الـ API
api_key = st.text_input("أدخل مفتاح Gemini API Key الخاص بك:", type="password")

st.divider()
st.subheader("⚙️ إعدادات المحتوى (باللغة العربية)")

col1, col2 = st.columns(2)

with col1:
    content_type = st.selectbox(
        "اختر نوع المحتوى:",
        [
            "مقال مدونة",
            "منشور منصات التواصل الاجتماعي",
            "وصف منتج",
            "نص صفحة هبوط (Landing Page)",
            "بريد إلكتروني تسويقي",
        ],
    )

    tone = st.selectbox(
        "اختر نبرة الصوت:",
        [
            "احترافي ورسمي",
            "تسويقي حماسي ومقنع",
            "ودود وبسيط",
            "تعليمي وإرشادي",
        ],
    )

with col2:
    length = st.selectbox(
        "حجم/طول المحتوى:",
        [
            "قصير وموجز",
            "متوسط",
            "مفصل وشامل",
        ],
    )

target_audience = st.text_input(
    "الجمهور المستهدف (اختياري):",
    placeholder="مثال: أصحاب المتاجر الإلكترونية المبتدئين",
)

topic = st.text_area(
    "أدخل موضوع المحتوى والتفاصيل الأساسية:",
    placeholder="اكتب هنا التفاصيل أو النقاط الرئيسية التي تريد تغطيتها...",
)

st.divider()

if st.button("🚀 توليد المحتوى الآن", use_container_width=True):
    if not api_key:
        st.error("رجاءً أدخل مفتاح API أولاً.")
    elif not topic:
        st.warning("رجاءً أدخل الموضوع والتفاصيل.")
    else:
        # صياغة الـ Prompt الموحدة للغة العربية
        prompt = f"""
أنت خبير في صناعة المحتوى والتسويق الرقمي.
قم بكتابة {content_type} باللغة العربية الفصحى السليمة والجذابة.

التفاصيل والمواصفات المطلوب الالتزام بها:
- الموضوع الرئيسي: {topic}
- نبرة الصوت: {tone}
- الطول المطلوب: {length}
- الجمهور المستهدف: {target_audience if target_audience else "عامة القراء وأصحاب المواقع"}

احرص على تنظيم المحتوى باستخدام عناوين فرعية ونقاط واضحة، وجعله متوافقاً مع قواعد SEO وجذاباً للقارئ.
"""

        max_retries = 3
        for attempt in range(max_retries):
            try:
                client = genai.Client(api_key=api_key)

                with st.spinner("جاري صياغة المحتوى بالعربية..."):
                    response = client.models.generate_content(
                        model="${selectedModel}",
                        contents=prompt,
                    )

                st.success("✨ تم توليد المحتوى بنجاح!")
                st.markdown("---")
                st.markdown(response.text)
                break

            except Exception as e:
                if "503" in str(e) and attempt < max_retries - 1:
                    time.sleep(2)
                    continue
                else:
                    st.error(f"حدث خطأ أثناء الاتصال: {e}")
                    break`;

  const pythonCliCode = `import time
from google import genai

client = genai.Client()

content_type = "${contentType || "مقال مدونة"}"
topic = "${topic || "أهمية التسويق الرقمي للمتاجر الإلكترونية"}"

prompt = f"قم بكتابة {content_type} احترافي ومناسب لأصحاب المواقع عن الموضوع التالي:\\n{topic}"

print("\\nجاري صياغة المحتوى بواسطة الذكاء الاصطناعي...\\n")

max_retries = 3
for attempt in range(max_retries):
    try:
        response = client.models.generate_content(
            model="${selectedModel}",
            contents=prompt,
        )
        print("--- النتيجة ---")
        print(response.text)
        break
    except Exception as e:
        if "503" in str(e) and attempt < max_retries - 1:
            time.sleep(2)
            continue
        else:
            print(f"حدث خطأ: {e}")
            break`;

  const tsCode = `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const contentType = "${contentType || "مقال مدونة"}";
const topic = "${topic || "أهمية التسويق الرقمي للمتاجر الإلكترونية"}";
const prompt = \`قم بكتابة \${contentType} احترافي ومناسب لأصحاب المواقع عن الموضوع التالي:\\n\${topic}\`;

async function main() {
  console.log("جاري صياغة المحتوى...");
  const response = await ai.models.generateContent({
    model: "${selectedModel}",
    contents: prompt,
  });

  console.log("--- النتيجة ---");
  console.log(response.text);
}

main();`;

  const activeCode =
    tab === "streamlit"
      ? streamlitCode
      : tab === "python"
      ? pythonCliCode
      : tab === "requirements"
      ? requirementsTxt
      : tsCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="bg-stone-900 text-stone-100 rounded-2xl border border-stone-800 w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        dir="ltr"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm sm:text-base text-stone-100">
              Streamlit & Gemini Python Script
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Action Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-stone-950 border-b border-stone-800 overflow-x-auto gap-2">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setTab("streamlit")}
              className={`px-3 py-1.5 rounded-md font-mono font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                tab === "streamlit"
                  ? "bg-amber-600/30 text-amber-400 border border-amber-500/40 font-bold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <span>⭐ Streamlit Code (app.py)</span>
            </button>

            <button
              type="button"
              onClick={() => setTab("python")}
              className={`px-3 py-1.5 rounded-md font-mono font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                tab === "python"
                  ? "bg-amber-600/30 text-amber-400 border border-amber-500/40 font-bold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <span>Python CLI</span>
            </button>

            <button
              type="button"
              onClick={() => setTab("requirements")}
              className={`px-3 py-1.5 rounded-md font-mono font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                tab === "requirements"
                  ? "bg-amber-600/30 text-amber-400 border border-amber-500/40 font-bold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <span>📄 requirements.txt</span>
            </button>

            <button
              type="button"
              onClick={() => setTab("typescript")}
              className={`px-3 py-1.5 rounded-md font-mono font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                tab === "typescript"
                  ? "bg-amber-600/30 text-amber-400 border border-amber-500/40 font-bold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <span>TypeScript (@google/genai)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-md transition cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-x-auto max-h-[460px] bg-stone-950/80 font-mono text-xs sm:text-sm text-stone-300 leading-relaxed">
          <pre>
            <code>{activeCode}</code>
          </pre>
        </div>

        {/* Note footer */}
        <div className="px-6 py-3 bg-stone-900 border-t border-stone-800 text-xs text-stone-400 flex flex-wrap items-center justify-between gap-2" dir="rtl">
          <span>
            كود Streamlit المتكامل لتوليد المحتوى الذكي بواسطة <code className="text-amber-300 font-mono">gemini-2.5-flash</code>.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
