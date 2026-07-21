"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  Bold, Italic, Heading2, Heading3,
  List, AlignLeft, Type, Minus
} from "lucide-react";

const ToolbarBtn = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    className={`p-1.5 rounded-md text-sm transition-colors ${
      active ? "bg-emerald-600 text-white" : "hover:bg-slate-100 text-slate-600"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-slate-200 mx-1" />;

export default function RichTextEditor({ value, onChange, placeholder = "Tulis isi artikel di sini..." }) {
  const editorRef = useRef(null);

  // Sync external value into editor (only on mount)
  useEffect(() => {
    if (editorRef.current && value !== undefined && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, []); // intentionally run once on mount

  const exec = useCallback((command, val = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleInput();
  }, []);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const setFontSize = (size) => {
    // execCommand fontSize uses 1-7 range; we map to actual sizes via CSS
    exec("fontSize", size);
  };

  const insertHeading = (tag) => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
    handleInput();
  };

  const insertDivider = () => {
    editorRef.current?.focus();
    document.execCommand("insertHorizontalRule", false, null);
    handleInput();
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-slate-50 border-b border-slate-200">
        {/* Text Style */}
        <ToolbarBtn onClick={() => exec("bold")} title="Tebal (Bold)">
          <Bold className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("italic")} title="Miring (Italic)">
          <Italic className="w-4 h-4" />
        </ToolbarBtn>

        <Divider />

        {/* Headings */}
        <ToolbarBtn onClick={() => insertHeading("h2")} title="Judul Besar">
          <Heading2 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => insertHeading("h3")} title="Judul Kecil">
          <Heading3 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => insertHeading("p")} title="Paragraf Normal">
          <AlignLeft className="w-4 h-4" />
        </ToolbarBtn>

        <Divider />

        {/* Font Size */}
        <ToolbarBtn onClick={() => setFontSize("3")} title="Ukuran Normal">
          <Type className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => setFontSize("5")} title="Ukuran Besar">
          <Type className="w-4.5 h-4.5 font-black" style={{ fontSize: 18 }} />
        </ToolbarBtn>

        <Divider />

        {/* List */}
        <ToolbarBtn onClick={() => exec("insertUnorderedList")} title="Daftar Poin">
          <List className="w-4 h-4" />
        </ToolbarBtn>

        {/* Divider line */}
        <ToolbarBtn onClick={insertDivider} title="Garis Pemisah">
          <Minus className="w-4 h-4" />
        </ToolbarBtn>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        className="min-h-[240px] p-4 text-sm text-slate-700 leading-relaxed focus:outline-none prose prose-sm max-w-none
          [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-slate-800 [&_h2]:mt-4 [&_h2]:mb-2
          [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-700 [&_h3]:mt-3 [&_h3]:mb-1
          [&_strong]:font-bold [&_em]:italic
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
          [&_hr]:border-slate-200 [&_hr]:my-4
          empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  );
}
