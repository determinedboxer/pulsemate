"use client";

import { useState, useEffect } from "react";
import { ratePhoto, getPhotoRating, getTopRatedPhotos } from "@/lib/gameSystems";

interface PhotoRatingProps {
  modelId: string;
  photoId: string;
  onRate?: (rating: number) => void;
}

export default function PhotoRating({ modelId, photoId, onRate }: PhotoRatingProps) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    const existing = getPhotoRating(modelId, photoId);
    if (existing) {
      setUserRating(existing);
      setHasRated(true);
    }
  }, [modelId, photoId]);

  const handleRate = (rating: number) => {
    ratePhoto(modelId, photoId, rating);
    setUserRating(rating);
    setHasRated(true);
    onRate?.(rating);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !hasRated && handleRate(star)}
            onMouseEnter={() => !hasRated && setHoverRating(star)}
            onMouseLeave={() => !hasRated && setHoverRating(0)}
            className={`text-2xl transition-all ${
              hasRated ? "cursor-default" : "cursor-pointer hover:scale-110"
            }`}
            disabled={hasRated}
          >
            {star <= (hoverRating || userRating || 0) ? "⭐" : "☆"}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        {hasRated 
          ? `You rated this ${userRating}/5 stars`
          : "Rate this photo!"
        }
      </p>
    </div>
  );
}

// Component for showing top rated photos
export function TopRatedPhotos({ modelId }: { modelId: string }) {
  const [topPhotos, setTopPhotos] = useState<any[]>([]);

  useEffect(() => {
    setTopPhotos(getTopRatedPhotos(modelId));
  }, [modelId]);

  if (topPhotos.length === 0) return null;

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-purple-500/30">
      <h3 className="text-lg font-bold mb-3 text-pink-400">⭐ Community Favorites</h3>
      <div className="space-y-2">
        {topPhotos.slice(0, 3).map((photo, index) => (
          <div key={photo.photoId} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
            <span className="text-2xl">
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">Photo #{photo.photoId.slice(-4)}</p>
              <p className="text-xs text-yellow-400">{photo.rating}/5 stars</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
