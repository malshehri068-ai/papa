import React, { useState } from "react";
import { X, Copy, Check, Terminal, GraduationCap } from "lucide-react";

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

  const streamlitCode = `import io
import os
import time
import streamlit as st
from google import genai

# إعداد واجهة التطبيق
st.set_page_config(
    page_title="المساعد التربوي والتعليمي الذكي",
    page_icon="🎓",
    layout="centered"
)

# ترويسة التطبيق والشعار
col_logo, col_title = st.columns([1, 4])
with col_logo:
    st.image("https://cdn-icons-png.flaticon.com/512/3135/3135715.png", use_container_width=True)

with col_title:
    st.title("🎓 المساعد التربوي والتعليمي الذكي")
    st.caption("أداة المعلم الذكية لإعداد خطط الدروس، أوراق العمل، الاختبارات، وتبسيط المفاهيم")

st.divider()

# قراءة مفتاح الـ API تلقائياً من Streamlit Secrets أو حقل الإدخال
api_key = None
try:
    if "GEMINI_API_KEY" in st.secrets:
        api_key = st.secrets.get("GEMINI_API_KEY")
except Exception:
    pass

if not api_key:
    api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    api_key = st.text_input("أدخل مفتاح Gemini API Key الخاص بك:", type="password")
    st.caption("💡 نصيحة: أضف المفتاح في Secrets باسم GEMINI_API_KEY ليتم التعرف عليه تلقائياً.")

st.subheader("📚 إعدادات المحتوى التعليمي")

col1, col2 = st.columns(2)

with col1:
    content_type = st.selectbox(
        "نوع المخرج التعليمي:",
        [
            "خطة درس نموذجي",
            "اختبار وأسئلة تقويمية",
            "ورقة عمل تفاعلية",
            "شرح وتبسيط مفاهيم",
            "نشاط صفي ومهمة أدائية",
            "إذاعة مدرسية متكاملة",
            "تقرير ورسالة لأولياء الأمور",
        ],
    )

    subject = st.selectbox(
        "المادة الدراسية:",
        [
            "العلوم العامة والفيزياء والكيمياء",
            "الرياضيات",
            "اللغة العربية (لغتي)",
            "التربية الإسلامية والقرآن",
            "الدراسات الاجتماعية والمواطنة",
            "اللغة الإنجليزية",
            "التقنية الرقمية والحاسب",
            "المهارات الحياتية",
        ],
    )

with col2:
    grade_level = st.selectbox(
        "المرحلة والصف الدراسي:",
        [
            "المرحلة الابتدائية (الصفوف المبكرة 1-3)",
            "المرحلة الابتدائية (الصفوف العليا 4-6)",
            "المرحلة المتوسطة",
            "المرحلة الثانوية (المسارات)",
            "رياض الأطفال",
            "عام / لكافة المراحل",
        ],
    )

    tone = st.selectbox(
        "الأسلوب والنبرة التربوية:",
        [
            "تشجيعي وتحفيزي للطلاب",
            "تربوي رصين ومنهجي",
            "تفاعلي ومبسط بالأمثلة الحياتية",
            "استقصائي يحفز التفكير الناقد",
        ],
    )

topic = st.text_area(
    "عنوان الدرس أو المفهوم التعليمي:",
    placeholder="اكتب هنا عنوان الدرس (مثال: دورة الماء في الطبيعة، جمع الكسور، المبتدأ والخبر)...",
)

st.divider()

if st.button("🚀 إعداد المحتوى التعليمي الآن", use_container_width=True):
    if not api_key:
        st.error("لم يتم العثور على مفتاح API. يرجى إدخاله أعلاه أو في Secrets.")
    elif not topic:
        st.warning("رجاءً أدخل عنوان الدرس أو الموضوع أولاً.")
    else:
        prompt = f"""
أنت مستشار تربوي وخبير في المناهج وطرق التدريس الحديثة.
المهمة: إعداد {content_type} في مادة {subject} لطلاب {grade_level}.
عنوان الدرس: {topic}
الأسلوب التربوي: {tone}

المعايير المطلوبة:
- صياغة أهداف واضحة وفق مستويات بلوم المعرفية والمهارية.
- تضمين أنشطة تفاعلية تراعي الفروق الفردية.
- تنظيم المحتوى بجداول وعناوين واضحة لسهولة الطباعة كملف PDF.
"""

        max_retries = 3
        for attempt in range(max_retries):
            try:
                client = genai.Client(api_key=api_key)

                with st.spinner("جاري إعداد المحتوى التعليمي بواسطة الذكاء الاصطناعي..."):
                    response = client.models.generate_content(
                        model="${selectedModel}",
                        contents=prompt,
                    )

                result_text = response.text

                st.success("✨ تم إعداد المحتوى بنجاح وفق المعايير التربوية!")
                st.markdown("---")
                st.markdown(result_text)

                st.divider()
                st.download_button(
                    label="📥 تحميل كملف نصي (.txt)",
                    data=result_text,
                    file_name="educational_content.txt",
                    mime="text/plain",
                    use_container_width=True,
                )
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

content_type = "${contentType || "خطة درس نموذجي"}"
topic = "${topic || "دورة الماء في الطبيعة"}"

prompt = f"قم بإعداد {content_type} متكامل وفق المعايير التربوية للدرس التالي:\\n{topic}"

print("\\nجاري صياغة المحتوى التعليمي بواسطة الذكاء الاصطناعي...\\n")

max_retries = 3
for attempt in range(max_retries):
    try:
        response = client.models.generate_content(
            model="${selectedModel}",
            contents=prompt,
        )
        print("--- المخرج التعليمي ---")
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

const contentType = "${contentType || "خطة درس نموذجي"}";
const topic = "${topic || "دورة الماء في الطبيعة"}";
const prompt = \`أعد \${contentType} متكامل وفق المعايير التربوية لدرس: \${topic}\`;

async function main() {
  console.log("جاري إعداد المحتوى التربوي...");
  const response = await ai.models.generateContent({
    model: "${selectedModel}",
    contents: prompt,
  });

  console.log(response.text);
}

main();`;

  const getActiveCode = () => {
    switch (tab) {
      case "streamlit":
        return streamlitCode;
      case "python":
        return pythonCliCode;
      case "requirements":
        return requirementsTxt;
      case "typescript":
        return tsCode;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getActiveCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = getActiveCode();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    let filename = "streamlit_app.py";
    let mime = "text/x-python";

    if (tab === "python") {
      filename = "edu_ai.py";
    } else if (tab === "requirements") {
      filename = "requirements.txt";
      mime = "text/plain";
    } else if (tab === "typescript") {
      filename = "edu_gemini.ts";
      mime = "text/typescript";
    }

    const blob = new Blob([getActiveCode()], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                أكواد تطبيق المساعد التربوي (Streamlit & Python)
              </h2>
              <p className="text-xs text-stone-500">
                جاهز للتشغيل على Streamlit Cloud أو حاسوب المعلم محلياً
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 border-b border-stone-200 bg-stone-50">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab("streamlit")}
              className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                tab === "streamlit"
                  ? "border-teal-700 text-teal-900 bg-white"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              🚀 Streamlit App (app.py)
            </button>
            <button
              type="button"
              onClick={() => setTab("requirements")}
              className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                tab === "requirements"
                  ? "border-teal-700 text-teal-900 bg-white"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              📄 requirements.txt
            </button>
            <button
              type="button"
              onClick={() => setTab("python")}
              className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                tab === "python"
                  ? "border-teal-700 text-teal-900 bg-white"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              🐍 كود Python بسيط
            </button>
            <button
              type="button"
              onClick={() => setTab("typescript")}
              className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                tab === "typescript"
                  ? "border-teal-700 text-teal-900 bg-white"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              ⚡ TypeScript SDK
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-xs font-medium text-stone-700 transition cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <span>تنزيل الملف</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-stone-900 overflow-y-auto flex-1 font-mono text-xs text-stone-200 leading-relaxed" dir="ltr">
          <pre>
            <code>{getActiveCode()}</code>
          </pre>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 bg-stone-100 border-t border-stone-200 text-xs text-stone-600 flex items-center justify-between">
          <span>
            طريقة التشغيل: <code className="bg-stone-200 px-1.5 py-0.5 rounded text-stone-800">pip install -r requirements.txt</code> ثم <code className="bg-stone-200 px-1.5 py-0.5 rounded text-stone-800">streamlit run app.py</code>
          </span>
          <span className="font-bold text-teal-800">{selectedModel || "Gemini 3.6 Flash"}</span>
        </div>
      </div>
    </div>
  );
};
