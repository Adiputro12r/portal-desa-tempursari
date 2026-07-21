"use client";

import { useState } from "react";
import Image from "next/image";

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
      {/* Shimmer skeleton while loading */}
      {!loaded && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-slate-200">
          <div className="shimmer-wave" />
        </div>
      )}

      <style>{`
        .shimmer-wave {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(226,232,240,0) 0%,
            rgba(241,245,249,0.9) 50%,
            rgba(226,232,240,0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

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
