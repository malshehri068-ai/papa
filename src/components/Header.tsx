import React, { useState } from "react";
import { Sparkles, Code2, RefreshCw } from "lucide-react";

interface HeaderProps {
  onOpenCodeModal: () => void;
  isGenerating: boolean;
  onRefresh: () => void;
  selectedModel: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCodeModal,
  isGenerating,
  onRefresh,
  selectedModel,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-stone-50/90 backdrop-blur-md px-4 sm:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
            <span className="text-xl">✍️</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                مولد المحتوى الذكي لأصحاب المواقع
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                {selectedModel}
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              توليد مقالات مدونة، منشورات تواصل، وصف منتجات وصفحات هبوط بواسطة Google Gemini
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="view-python-code-btn"
            type="button"
            onClick={onOpenCodeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 hover:text-stone-900 text-xs sm:text-sm font-medium transition cursor-pointer"
            title="عرض كود Streamlit و Python الخاص بـ Gemini"
          >
            <Code2 className="w-4 h-4 text-amber-600" />
            <span>كود Streamlit (app.py)</span>
          </button>

          <button
            id="quick-regenerate-btn"
            type="button"
            onClick={onRefresh}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs sm:text-sm font-medium shadow-xs transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
            <span>{isGenerating ? "جارِ الصياغة..." : "توليد المحتوى"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
