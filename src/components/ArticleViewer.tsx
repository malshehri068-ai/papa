import React, { useState, useRef } from "react";
import Markdown from "react-markdown";
import { Copy, Check, Download, BookOpen, Clock, FileText, Share2, FileDown, Loader2 } from "lucide-react";
import { GeneratedArticle } from "../types";

interface ArticleViewerProps {
  article: GeneratedArticle;
  isGenerating: boolean;
}

export const ArticleViewer: React.FC<ArticleViewerProps> = ({
  article,
  isGenerating,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(article.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = article.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([article.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `مقال_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    if (!contentRef.current || isExportingPdf) return;
    setIsExportingPdf(true);

    try {
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = (html2pdfModule as any).default || html2pdfModule;

      const element = contentRef.current;
      const opt = {
        margin: [12, 14, 14, 14] as [number, number, number, number],
        filename: `محتوى_تعليمي_${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          onclone: (clonedDoc: Document) => {
            // Tailwind v4 generates modern CSS with oklch(...) colors which html2canvas fails to parse.
            // Replace any style rules or computed styles containing oklch with standard sRGB/hex equivalents.
            try {
              // 1. Remove or sanitize any style tags containing oklch in the clone
              const styleTags = clonedDoc.querySelectorAll("style");
              styleTags.forEach((styleTag) => {
                if (styleTag.innerHTML.includes("oklch")) {
                  // Replace oklch definitions with safe hex/rgb fallbacks
                  styleTag.innerHTML = styleTag.innerHTML.replace(/oklch\([^)]+\)/g, "#1c1917");
                }
              });

              // 2. Normalize inline and computed colors on all elements in the clone
              const allElements = clonedDoc.querySelectorAll<HTMLElement>("*");
              allElements.forEach((el) => {
                if (!el.style) return;
                const computed = clonedDoc.defaultView?.getComputedStyle(el) || window.getComputedStyle(el);
                
                // Color
                if (computed.color && computed.color.includes("oklch")) {
                  el.style.color = "#1c1917";
                }
                // Background
                if (computed.backgroundColor && computed.backgroundColor.includes("oklch")) {
                  el.style.backgroundColor = el.tagName === "BODY" || el === clonedDoc.body ? "#ffffff" : "transparent";
                }
                // Border colors
                if (computed.borderColor && computed.borderColor.includes("oklch")) {
                  el.style.borderColor = "#e7e5e4";
                }
                if (computed.borderTopColor && computed.borderTopColor.includes("oklch")) {
                  el.style.borderTopColor = "#e7e5e4";
                }
                if (computed.borderBottomColor && computed.borderBottomColor.includes("oklch")) {
                  el.style.borderBottomColor = "#e7e5e4";
                }
                if (computed.borderRightColor && computed.borderRightColor.includes("oklch")) {
                  el.style.borderRightColor = "#e7e5e4";
                }
                if (computed.borderLeftColor && computed.borderLeftColor.includes("oklch")) {
                  el.style.borderLeftColor = "#e7e5e4";
                }
              });
            } catch (e) {
              console.warn("Could not sanitize cloned DOM for PDF:", e);
            }
          },
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation failed, falling back to print window:", err);
      // Fallback to print
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "محتوى تسويقي احترافي",
          text: article.content.slice(0, 180) + "...",
        });
        return;
      } catch {
        // user cancelled or share failed
      }
    }
    handleCopy();
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const fontSizeClass = {
    sm: "text-base leading-relaxed",
    base: "text-lg leading-loose",
    lg: "text-xl leading-loose",
  }[fontSize];

  return (
    <article className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Article Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-4 text-xs sm:text-sm text-stone-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-teal-700" />
            <span>قراءة {article.readingTimeMinutes} دقيقة</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-teal-700" />
            <span>{article.wordCount} كلمة</span>
          </div>
          <span className="text-stone-300 hidden sm:inline">•</span>
          <span className="hidden sm:inline-block text-stone-400">
            النموذج: {article.model}
          </span>
        </div>

        {/* Toolbar buttons */}
        <div className="flex items-center gap-1.5">
          {/* Font size toggle */}
          <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-white text-xs text-stone-600">
            <button
              type="button"
              onClick={() => setFontSize("sm")}
              className={`px-2 py-1 rounded cursor-pointer ${fontSize === "sm" ? "bg-stone-100 font-bold text-stone-900" : "hover:text-stone-900"}`}
              title="خط صغير"
            >
              أ
            </button>
            <button
              type="button"
              onClick={() => setFontSize("base")}
              className={`px-2 py-1 rounded cursor-pointer ${fontSize === "base" ? "bg-stone-100 font-bold text-stone-900" : "hover:text-stone-900"}`}
              title="خط متوسط"
            >
              أ+
            </button>
            <button
              type="button"
              onClick={() => setFontSize("lg")}
              className={`px-2 py-1 rounded cursor-pointer ${fontSize === "lg" ? "bg-stone-100 font-bold text-stone-900" : "hover:text-stone-900"}`}
              title="خط كبير"
            >
              أ++
            </button>
          </div>

          {/* Copy Button */}
          <button
            id="copy-article-btn"
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              copied
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                : "bg-white hover:bg-stone-100 text-stone-700 border border-stone-200"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>نسخ</span>
              </>
            )}
          </button>

          {/* Download PDF Button */}
          <button
            id="download-pdf-btn"
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf || isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="تنزيل المحتوى أو الخطة كملف PDF للطباعة المباشرة"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>جاري تصدير PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-teal-100" />
                <span>تحميل PDF للطباعة</span>
              </>
            )}
          </button>

          {/* Download Markdown Button */}
          <button
            id="download-article-btn"
            type="button"
            onClick={handleDownloadMd}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs sm:text-sm font-medium transition cursor-pointer"
            title="تحميل المقال بصيغة Markdown (.md)"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden md:inline">ملف .md</span>
          </button>

          {/* Share Button */}
          <button
            id="share-article-btn"
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs sm:text-sm font-medium transition cursor-pointer"
            title="مشاركة المقال"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">{shared ? "تم النسخ للمشاركة" : "مشاركة"}</span>
          </button>
        </div>
      </div>

      {/* Article Content Container */}
      <div ref={contentRef} className="relative p-6 sm:p-10 flex-1 overflow-y-auto bg-white" dir="rtl">
        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center z-10 p-6 text-center">
            <div className="w-12 h-12 rounded-full border-3 border-teal-700 border-t-transparent animate-spin mb-4" />
            <p className="text-base font-bold text-stone-900">
              يقوم نموذج الذكاء الاصطناعي بإعداد المحتوى التعليمي والتربوي...
            </p>
            <p className="text-xs text-stone-500 mt-1 max-w-sm">
              صياغة الأهداف السلوكية، تنظيم الأنشطة الصفية، وتطبيق استراتيجيات التدريس والتقويم
            </p>
          </div>
        )}

        {article.quotaNotice && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
            <span className="text-base">💡</span>
            <div className="flex-1">
              <p className="font-bold text-amber-950">ملاحظة الحصة التجريبية (API Quota):</p>
              <p className="text-amber-800 mt-0.5">{article.quotaNotice}</p>
            </div>
          </div>
        )}

        <div className={`prose prose-stone max-w-none ${fontSizeClass}`}>
          <Markdown
            components={{
              h1: ({ ...props }) => (
                <h1
                  className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-6 pb-4 border-b border-stone-200"
                  {...props}
                />
              ),
              h2: ({ ...props }) => (
                <h2
                  className="text-xl sm:text-2xl font-bold text-stone-900 mt-8 mb-4 flex items-center gap-2"
                  {...props}
                />
              ),
              h3: ({ ...props }) => (
                <h3
                  className="text-lg sm:text-xl font-bold text-stone-800 mt-6 mb-3"
                  {...props}
                />
              ),
              p: ({ ...props }) => (
                <p className="text-stone-700 mb-4 text-justify" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul className="list-disc list-inside space-y-2 mb-6 text-stone-700 mr-2" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal list-inside space-y-2 mb-6 text-stone-700 mr-2" {...props} />
              ),
              li: ({ ...props }) => (
                <li className="leading-relaxed" {...props} />
              ),
              blockquote: ({ ...props }) => (
                <blockquote
                  className="my-6 p-4 rounded-xl bg-teal-50/80 border-r-4 border-teal-600 text-stone-800 font-medium not-italic"
                  {...props}
                />
              ),
              hr: ({ ...props }) => (
                <hr className="my-8 border-stone-200" {...props} />
              ),
              strong: ({ ...props }) => (
                <strong className="font-bold text-teal-950" {...props} />
              ),
            }}
          >
            {article.content}
          </Markdown>
        </div>

        {/* Article Footer Note */}
        <div className="mt-12 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
          <span>
            تم الإعداد بواسطة المساعد التربوي والتعليمي الذكي • متوافق مع معايير التدريس الحديثة
          </span>
          <span className="text-stone-400">
            تاريخ الإنشاء: {new Date(article.createdAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      </div>
    </article>
  );
};
