"use client";

import { useState, useEffect } from "react";
import { updateJealousy, getJealousyLevel } from "@/lib/gameSystems";

interface JealousyNotificationProps {
  currentModelId: string;
}

const modelNames: Record<string, string> = {
  mia: "Mia",
  sakura: "Sakura",
  isabella: "Isabella",
  aaliyah: "Aaliyah",
  riley: "Riley"
};

const modelAvatars: Record<string, string> = {
  mia: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1769080927/13_k3ynrk.png",
  sakura: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770393771/Sakura1_nctckh.png",
  isabella: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770599989/hf_20260209_011732_673f8c7a-41cb-45f6-9cb4-cd071b69f2cd_mwrsey.png",
  aaliyah: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770471473/Isabella1_ifwyap.png",
  riley: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png"
};

export default function JealousyNotification({ currentModelId }: JealousyNotificationProps) {
  const [notifications, setNotifications] = useState<{modelId: string; message: string}[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    // Update jealousy when component mounts (user opened this model's chat)
    const result = updateJealousy(currentModelId);
    
    // Filter out already dismissed notifications
    const newNotifications = result.messages
      .map((msg: string, index: number) => ({ modelId: result.jealousModels[index], message: msg }))
      .filter((n: {modelId: string; message: string}) => !dismissed.includes(n.modelId));
    
    setNotifications(newNotifications);
  }, [currentModelId]);

  const dismissNotification = (modelId: string) => {
    setDismissed([...dismissed, modelId]);
    setNotifications(notifications.filter(n => n.modelId !== modelId));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[150] space-y-2 max-w-sm">
      {notifications.map((notification) => {
        const jealousyLevel = getJealousyLevel(notification.modelId);
        return (
          <div
            key={notification.modelId}
            className="bg-gradient-to-r from-red-900/90 to-pink-900/90 backdrop-blur-xl p-4 rounded-2xl border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-in slide-in-from-right"
          >
            <div className="flex items-start gap-3">
              <img
                src={modelAvatars[notification.modelId]}
                alt={modelNames[notification.modelId]}
                className="w-12 h-12 rounded-full border-2 border-red-500 object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white">{modelNames[notification.modelId]}</span>
                  <span className="text-xs bg-red-500/30 px-2 py-0.5 rounded-full text-red-300">
                    Jealousy: {jealousyLevel}%
                  </span>
                </div>
                <p className="text-sm text-gray-200">{notification.message}</p>
                <button
                  onClick={() => dismissNotification(notification.modelId)}
                  className="mt-2 text-xs text-red-300 hover:text-white transition"
                >
                  Visit her now →
                </button>
              </div>
              <button
                onClick={() => dismissNotification(notification.modelId)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            {/* Jealousy bar */}
            <div className="mt-3 w-full bg-black/30 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-red-500 to-pink-500 h-full rounded-full transition-all"
                style={{ width: `${jealousyLevel}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
