import time
import streamlit as st
from google import genai

# إعداد واجهة التطبيق
st.set_page_config(
    page_title="المساعد التعليمي الذكي", page_icon="🎓", layout="centered"
)

# عرض اللوجو والعنوان الرئيسي
col_logo, col_title = st.columns([1, 4])
with col_logo:
    st.image(
        "https://cdn-icons-png.flaticon.com/512/3429/3429402.png",
        use_container_width=True,
    )

with col_title:
    st.title("🎓 المساعد التعليمي الذكي")
    st.caption("أداة صياغة التحضير، الاختبارات، والأنشطة للمعلمين والتربويين")

st.divider()

# قراءة مفتاح الـ API تلقائياً من Streamlit Secrets
api_key = st.secrets.get("GEMINI_API_KEY")

st.subheader("⚙️ إعدادات المحتوى التعليمي")

col1, col2 = st.columns(2)

with col1:
    content_type = st.selectbox(
        "اختر نوع المحتوى المطلوب:",
        [
            "خطة درس (تحضير كامل)",
            "أسئلة اختبار / تقييم",
            "ملخص مادة / درس",
            "نشاط تفاعلي وصفّي",
            "ورقة عمل للطلاب",
            "رسالة توجيهية لأولياء الأمور",
        ],
    )

    grade_level = st.selectbox(
        "المرحلة الدراسية:",
        [
            "رياض الأطفال",
            "المرحلة الابتدائية (الصفوف الأولى)",
            "المرحلة الابتدائية (الصفوف العليا)",
            "المرحلة المتوسطة",
            "المرحلة الثانوية",
            "التعليم الجامعي / الأكاديمي",
        ],
    )

with col2:
    tone = st.selectbox(
        "أسلوب ونبرة الشرح:",
        [
            "مبسط وممتع للأطفال",
            "أكاديمي ومنهجي منظم",
            "حماسي وتفاعلي",
            "توجيهي وإرشادي",
        ],
    )

    subject = st.text_input(
        "المادة الدراسية:",
        placeholder="مثال: العلوم، الرياضيات، اللغة العربية...",
    )

topic = st.text_area(
    "عنوان الدرس أو الموضوع والتفاصيل:",
    placeholder="اكتب هنا عنوان الدرس والأهداف أو النقاط الأساسية التي تريد تغطيتها...",
)

st.divider()

if st.button("🚀 توليد المحتوى التعليمي الآن", use_container_width=True):
    if not api_key:
        st.error(
            "لم يتم العثور على مفتاح API. يرجى إضافته في Secrets على Streamlit Cloud."
        )
    elif not topic or not subject:
        st.warning("رجاءً أدخل اسم المادة والموضوع بالتفصيل.")
    else:
        prompt = f"""
أنت مستشار تربوي وخبير في إعداد المناهج والوسائل التعليمية الحديثة.
قم بكتابة {content_type} باللغة العربية الفصحى وبشكل احترافي ومتقن.

المواصفات والمعايير المطلوبة:
- المادة الدراسية: {subject}
- المرحلة الدراسية: {grade_level}
- موضوع الدرس / المحتوى: {topic}
- أسلوب ونبرة الشرح: {tone}

المطلوب:
1. تقديم المحتوى بشكل منظم جداً باستخدام عناوين جانبية وجداول ونقاط إن أمكن.
2. التأكد من مناسبة المفردات والأنشطة للمرحلة الدراسية المستهدفة ({grade_level}).
3. إضافة أهداف تعليمية واضحة ومخرجات تعلم متوقعة في البداية.
"""

        max_retries = 3
        for attempt in range(max_retries):
            try:
                client = genai.Client(api_key=api_key)

                with st.spinner("جاري إعداد المحتوى التعليمي..."):
                    response = client.models.generate_content(
                        model="gemini-3.6-flash",
                        contents=prompt,
                    )

                generated_text = response.text

                st.success("✨ تم إعداد المحتوى التعليمي بنجاح!")
                st.markdown("---")
                st.markdown(generated_text)

                st.divider()

                st.download_button(
                    label="📥 تحميل المحتوى التعليمي (.txt)",
                    data=generated_text,
                    file_name=f"educational_plan_{subject}.txt",
                    mime="text/plain",
                    use_container_width=True,
                )
                break

            except Exception as e:
                err_msg = str(e)
                if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
                    st.error(
                        "⚠️ تم الوصول للحد الأقصى المسموح به مجاناً من طلبات API لهذا اليوم. يرجى الانتظار قليلاً أو استخدام مفتاح API جديد."
                    )
                    break
                elif "503" in err_msg and attempt < max_retries - 1:
                    time.sleep(3)
                    continue
                else:
                    st.error(f"حدث خطأ أثناء الاتصال: {e}")
                    break
