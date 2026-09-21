import io
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

# عرض الشعار والترويسة
col_logo, col_title = st.columns([1, 4])
with col_logo:
    st.image(
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        use_container_width=True,
    )

with col_title:
    st.title("🎓 المساعد التربوي والتعليمي الذكي")
    st.caption("أداة المعلم الذكية لإعداد خطط الدروس، الاختبارات، أوراق العمل، وتبسيط المفاهيم")

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

st.subheader("📚 إعدادات المحتوى التعليمي")

col1, col2 = st.columns(2)

with col1:
    content_type = st.selectbox(
        "اختر نوع المخرج التعليمي:",
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
            "التربية الإسلامية والقرآن الكريم",
            "الدراسات الاجتماعية والمواطنة",
            "اللغة الإنجليزية",
            "التقنية الرقمية والحاسب الآلي",
            "المهارات الحياتية والتربية الأسرية",
        ],
    )

with col2:
    grade_level = st.selectbox(
        "المرحلة والصف الدراسي:",
        [
            "المرحلة الابتدائية (الصفوف المبكرة 1-3)",
            "المرحلة الابتدائية (الصفوف العليا 4-6)",
            "المرحلة المتوسطة",
            "المرحلة الثانوية (نظام المسارات)",
            "رياض الأطفال والطفولة المبكرة",
            "التعليم العام / الجامعي",
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
    "عنوان الدرس أو المفهوم التعليمي المراد إعداده:",
    placeholder="اكتب هنا عنوان الدرس (مثال: دورة الماء في الطبيعة، جمع وطرح الكسور، الفاعل ونائب الفاعل)...",
)

st.divider()

if st.button("🚀 إعداد المحتوى التعليمي الآن", use_container_width=True):
    if not api_key:
        st.error(
            "لم يتم العثور على مفتاح API. يرجى إضافته في Secrets على Streamlit Cloud أو إدخاله في الحقل أعلاه."
        )
    elif not topic:
        st.warning("رجاءً أدخل عنوان الدرس أو الموضوع أولاً.")
    else:
        prompt = f"""
أنت مستشار تربوي وخبير في المناهج وطرق التدريس الحديثة للتربية والتعليم.
المهمة: قم بإعداد {content_type} في مادة {subject} لطلاب {grade_level}.

المعلومات والبيانات الأساسية:
- نوع المحتوى المطلوب: {content_type}
- المادة الدراسية: {subject}
- المرحلة والصف الدراسي: {grade_level}
- عنوان الموضوع / الدرس: {topic}
- النبرة والأسلوب التربوي: {tone}

إرشادات ومعايير الجودة التربوية المطلوب تطبيقها:
1. الالتزام بالأهداف التعليمية الواضحة (وفق تصنيف بلوم للمستويات المعرفية والمهارية والوجدانية).
2. استخدام لغة عربية سليمة وجذابة تناسب الفئة العمرية والصف الدراسي المذكور.
3. تضمين أنشطة تفاعلية تراعي الفروق الفردية للطلاب.
4. إذا كان المحتوى خطة درس: يجب أن تشمل (التهيئة الحافزة، سير الأنشطة واستراتيجيات التدريس، التقويم التكويني والختامي، تذكرة الخروج والواجب المنزلي).
5. إذا كان اختباراً أو ورقة عمل: يجب وضع الأسئلة بوضوح مع نموذج الإجابة وسلم التصحيح وتوزيع الدرجات.
6. إذا كان شرحاً لمفهوم: يجب استخدام أمثلة واقعية وتشبيهات تبسط الفكرة بذكاء.
7. تنسيق المحتوى بعناوين بارزة وجداول ونقاط لتسهيل قراءته وطباعته.
"""

        max_retries = 3
        for attempt in range(max_retries):
            try:
                client = genai.Client(api_key=api_key)

                with st.spinner("جاري إعداد المحتوى التربوي بواسطة الذكاء الاصطناعي..."):
                    # استخدام نموذج gemini-3.6-flash المتوفر في Google GenAI
                    response = client.models.generate_content(
                        model="gemini-3.6-flash",
                        contents=prompt,
                    )

                generated_text = response.text

                st.success("✨ تم إعداد المحتوى التعليمي بنجاح وفق المعايير التربوية!")
                st.markdown("---")
                st.markdown(generated_text)

                st.divider()

                # خيار تحميل الملف النصي مباشرة
                st.download_button(
                    label="📥 تحميل المحتوى التعليمي كملف نصي (.txt)",
                    data=generated_text,
                    file_name="educational_plan.txt",
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
