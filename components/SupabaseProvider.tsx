"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';

interface SupabaseContextType {
  gemsBalance: number;
  unlockedPhotos: string[];
  unlockedTabs: { [key: string]: boolean };
  loading: boolean;
  unlockPhoto: (photoId: string, price: number, modelId: string) => Promise<boolean>;
  unlockTab: (tabName: string, price: number, modelId: string) => Promise<boolean>;
  refresh: () => void;
}

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const [gemsBalance, setGemsBalance] = useState(0);
  const [unlockedPhotos, setUnlockedPhotos] = useState<string[]>([]);
  const [unlockedTabs, setUnlockedTabs] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  // Sync user and load data
  useEffect(() => {
    if (!isLoaded || !user) {
      setLoading(false);
      return;
    }

    const syncAndLoad = async () => {
      try {
        // Sync user
        await fetch('/api/user/sync', { method: 'POST' });
        
        // Load gems
        const gemsRes = await fetch('/api/gems');
        if (gemsRes.ok) {
          const gemsData = await gemsRes.json();
          setGemsBalance(gemsData.gemsBalance || 0);
        }
        
        // Load unlocked content
        const unlockRes = await fetch('/api/unlock/list');
        if (unlockRes.ok) {
          const unlockData = await unlockRes.json();
          const photos = unlockData.unlocked
            ?.filter((u: any) => u.content_type === 'photo')
            .map((u: any) => u.content_id) || [];
          const tabs = unlockData.unlocked
            ?.filter((u: any) => u.content_type === 'tab')
            .reduce((acc: any, u: any) => ({ ...acc, [u.content_id]: true }), {});
          setUnlockedPhotos(photos);
          setUnlockedTabs(tabs);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    syncAndLoad();
  }, [isLoaded, user]);

  const unlockPhoto = async (photoId: string, price: number, modelId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: 'photo',
          contentId: photoId,
          modelId,
          gemsSpent: price
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setGemsBalance(data.gemsBalance);
        setUnlockedPhotos(prev => [...prev, photoId]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Unlock failed:', error);
      return false;
    }
  };

  const unlockTab = async (tabName: string, price: number, modelId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: 'tab',
          contentId: tabName,
          modelId,
          gemsSpent: price
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setGemsBalance(data.gemsBalance);
        setUnlockedTabs(prev => ({ ...prev, [tabName]: true }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Tab unlock failed:', error);
      return false;
    }
  };

  const refresh = () => {
    if (isLoaded && user) {
      setLoading(true);
      // Re-trigger the effect
    }
  };

  return (
    <SupabaseContext.Provider value={{
      gemsBalance,
      unlockedPhotos,
      unlockedTabs,
      loading,
      unlockPhoto,
      unlockTab,
      refresh
    }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }
  return context;
}
