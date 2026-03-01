"use client";

import { useState, useEffect } from "react";
import { loadModelMood, MOOD_CONFIGS, ModelMood as MoodType } from "@/lib/gameSystems";

interface ModelMoodProps {
  modelId: string;
  modelName: string;
}

export default function ModelMood({ modelId, modelName }: ModelMoodProps) {
  const [mood, setMood] = useState<MoodType>("playful");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const moodData = loadModelMood(modelId);
    setMood(moodData.mood);
  }, [modelId]);

  const config = MOOD_CONFIGS[mood];

  const moodDescriptions: Record<MoodType, string> = {
    playful: `${modelName} is feeling playful and teasing! Perfect time for fun banter 😋`,
    flirty: `${modelName} is in a flirty mood... She's been thinking about you 💕`,
    horny: `${modelName} is feeling extra spicy right now! 🔥 Don't miss this chance!`,
    tired: `${modelName} is a bit tired... Maybe send her a gift to cheer her up? 😴`,
    dominant: `${modelName} is feeling dominant. She wants to take control tonight 👑`,
    submissive: `${modelName} is feeling submissive. She wants you to take charge 🥺`,
  };

  return (
    <div 
      className="relative inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="text-sm">Current Mood:</span>
      <span className={`font-bold ${config.color} flex items-center gap-1`}>
        {config.emoji} {config.label}
      </span>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black/90 backdrop-blur-xl rounded-xl border border-pink-500/30 text-sm text-center z-50 shadow-xl">
          <p className="text-gray-200">{moodDescriptions[mood]}</p>
          <p className="text-xs text-gray-500 mt-2">
            Mood changes every 4 hours
          </p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/90" />
        </div>
      )}
    </div>
  );
}
