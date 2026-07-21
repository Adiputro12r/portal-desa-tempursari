"use client";

import { useRef } from "react";
import Image from "next/image";
import { Upload, X, ImagePlus } from "lucide-react";

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 2;

export default function MultiImageUpload({ images = [], onChange, label = "Foto" }) {
  const inputRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_IMAGES - images.length;
    const toProcess = files.slice(0, remaining);

    toProcess.forEach((file) => {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`File "${file.name}" melebihi batas ${MAX_SIZE_MB}MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUri = ev.target?.result;
        if (dataUri) {
          onChange([...images, dataUri]);
        }
      };
      reader.readAsDataURL(file);
    });

    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const removeImage = (idx) => {
    const updated = images.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const moveImage = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    [updated[from], updated[to]] = [updated[to], updated[from]];
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}
        <span className="ml-2 text-slate-400 font-normal normal-case">
          ({images.length}/{MAX_IMAGES} gambar · maks {MAX_SIZE_MB}MB/gambar)
        </span>
      </label>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((src, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-50">
              <Image src={src} alt={`Gambar ${idx + 1}`} fill className="object-cover" />

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(idx, idx - 1)}
                    className="bg-white/90 text-slate-700 text-xs font-bold px-2 py-1 rounded-lg hover:bg-white"
                    title="Geser kiri"
                  >←</button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="bg-red-500 text-white rounded-lg p-1.5 hover:bg-red-600"
                  title="Hapus gambar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {idx < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(idx, idx + 1)}
                    className="bg-white/90 text-slate-700 text-xs font-bold px-2 py-1 rounded-lg hover:bg-white"
                    title="Geser kanan"
                  >→</button>
                )}
              </div>

              {/* Cover badge */}
              {idx === 0 && (
                <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < MAX_IMAGES && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-slate-400 hover:text-emerald-600"
        >
          <ImagePlus className="w-8 h-8" />
          <span className="text-xs font-bold">
            Klik untuk pilih gambar ({MAX_IMAGES - images.length} slot tersisa)
          </span>
          <span className="text-[10px]">PNG, JPG, WEBP · Maks {MAX_SIZE_MB}MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
    </div>
  );
}
