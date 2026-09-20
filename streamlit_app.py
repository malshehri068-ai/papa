import os
import time
import streamlit as st
from google import genai

# إعداد واجهة التطبيق
st.set_page_config(
    page_title="مولد المحتوى الذكي",
    page_icon="✍️",
    layout="centered"
)

st.title("✍️ مولد المحتوى الذكي والتسويقي")
st.markdown("قم بتوليد مقالات ومحتوى تسويقي احترافي متوافق مع SEO باللغة العربية بواسطة Gemini AI.")

# التحقق من وجود مفتاح API في البيئة أو إعدادات Streamlit Secrets
default_api_key = os.environ.get("GEMINI_API_KEY", "")
if not default_api_key and "GEMINI_API_KEY" in st.secrets:
    default_api_key = st.secrets["GEMINI_API_KEY"]

# حقل إدخال مفتاح الـ API
if not default_api_key:
    api_key = st.text_input("أدخل مفتاح Gemini API Key الخاص بك:", type="password")
else:
    api_key = default_api_key
    st.info("🔑 تم اكتشاف مفتاح API بنجاح.")

st.divider()
st.subheader("⚙️ إعدادات المحتوى")

col1, col2 = st.columns(2)

with col1:
    content_type = st.selectbox(
        "اختر نوع المحتوى:",
        [
            "مقال مدونة",
            "منشور منصات التواصل الاجتماعي",
            "وصف منتج للمتجر",
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
        placeholder="مثال: أصحاب المتاجر الإلكترونية",
    )

topic = st.text_area(
    "أدخل موضوع المحتوى والتفاصيل الأساسية:",
    placeholder="اكتب هنا فكرة المقال أو النقاط الرئيسية التي تريد تغطيتها...",
)

st.divider()

if st.button("🚀 توليد المحتوى الآن", use_container_width=True):
    if not api_key:
        st.error("رجاءً أدخل مفتاح Gemini API أولاً.")
    elif not topic:
        st.warning("رجاءً أدخل الموضوع والتفاصيل.")
    else:
        prompt = f"""
أنت خبير تسويق رقمي وصانع محتوى محترف.
قم بكتابة {content_type} باللغة العربية الفصحى السليمة والجذابة.

المواصفات المطلوبة:
- الموضوع الرئيسي: {topic}
- نبرة الصوت: {tone}
- الطول المطلوب: {length}
- الجمهور المستهدف: {target_audience if target_audience else "عامة القراء والمشترين"}

احرص على تنسيق المحتوى بعناوين ونقاط واضحة، وجعله متوافقاً مع قواعد الـ SEO.
"""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                client = genai.Client(api_key=api_key)

                with st.spinner("جاري صياغة المحتوى بالذكاء الاصطناعي..."):
                    response = client.models.generate_content(
                        model="gemini-2.5-flash",
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
                    break
