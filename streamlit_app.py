import io
import os
import time
import streamlit as st
from google import genai

# إعداد واجهة التطبيق
st.set_page_config(
    page_title="مولد المحتوى الذكي", page_icon="✍️", layout="centered"
)

# عرض اللوجو والعنوان الرئيسي
col_logo, col_title = st.columns([1, 4])
with col_logo:
    st.image(
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        use_container_width=True,
    )

with col_title:
    st.title("مولد المحتوى الذكي")
    st.caption("أداة التوليد السريع والمخصص لأصحاب المتاجر والمواقع")

st.divider()

# قراءة مفتاح الـ API تلقائياً من Streamlit Secrets أو متغيرات البيئة مع إمكانية الإدخال اليدوي
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
    st.caption("💡 نصيحة: يمكنك إضافة المفتاح بشكل دائم في Secrets على Streamlit Cloud باسم `GEMINI_API_KEY`.")

st.subheader("⚙️ إعدادات المحتوى")

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
        st.error(
            "لم يتم العثور على مفتاح API. يرجى إضافته في Secrets على Streamlit Cloud أو إدخاله في الحقل أعلاه."
        )
    elif not topic:
        st.warning("رجاءً أدخل الموضوع والتفاصيل.")
    else:
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
                    # استخدام نموذج gemini-2.5-flash المتوفر في Google GenAI
                    response = client.models.generate_content(
model="gemini-3.6-flash",

                        contents=prompt,
                    )

                generated_text = response.text

                st.success("✨ تم توليد المحتوى بنجاح!")
                st.markdown("---")
                st.markdown(generated_text)

                st.divider()

                # خيار تحميل الملف النصي مباشرة
                st.download_button(
                    label="📥 تحميل المحتوى كملف نصي (.txt)",
                    data=generated_text,
                    file_name="generated_content.txt",
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
                    break
