"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

/**
 * ImageWithLoading — Next.js Image wrapper dengan skeleton "Memuat foto..."
 *
 * Props:
 *   src, alt, fill, width, height — sama seperti Next.js <Image>
 *   className   — class untuk <Image> itu sendiri (object-cover, dll)
 *   wrapperClassName — class tambahan untuk div pembungkus
 *   skeletonText — teks pada skeleton (default "Memuat foto...")
 *   priority    — sama seperti Next.js Image priority
 */
export default function ImageWithLoading({
  src,
  alt = "",
  fill,
  width,
  height,
  className = "object-cover",
  wrapperClassName = "",
  skeletonText = "Memuat foto...",
  priority = false,
  style,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full ${wrapperClassName}`}>
      {/* Skeleton shown while image is loading */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse">
          <div className="p-3 bg-white/60 rounded-2xl shadow-sm">
            <ImageIcon className="w-7 h-7 text-slate-300" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {skeletonText}
          </span>
        </div>
      )}

      {/* Actual image — invisible until loaded */}
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
          onLoad={() => setLoaded(true)}
          style={style}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
          onLoad={() => setLoaded(true)}
          style={style}
        />
      )}
    </div>
  );
}
