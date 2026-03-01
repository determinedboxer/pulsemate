"use client";

import { useEffect, useCallback } from "react";

interface LightboxProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  alt?: string;
}

export default function Lightbox({ imageUrl, isOpen, onClose, alt = "Image" }: LightboxProps) {
  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Back Button - Top Left */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 left-4 px-5 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 rounded-xl flex items-center gap-2 text-white font-bold transition-all z-[201] shadow-2xl border border-white/20 hover:scale-105 active:scale-95"
        aria-label="Back"
      >
        <span className="text-xl">←</span>
        <span>Back</span>
      </button>

      {/* Close button - Top Right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl font-bold transition-all z-[201] border border-white/30 shadow-2xl hover:scale-110 active:scale-95"
        aria-label="Close"
      >
        ×
      </button>

      {/* Image container */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Click hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
        Click anywhere to close
      </div>
    </div>
  );
}
