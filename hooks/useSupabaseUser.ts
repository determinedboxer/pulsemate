import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

interface UserData {
  id: string;
  gems_balance: number;
  sparks_balance: number;
}

interface UnlockedItem {
  content_type: string;
  content_id: string;
  model_id: string;
}

export function useSupabaseUser() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [gemsBalance, setGemsBalance] = useState(0);
  const [unlockedContent, setUnlockedContent] = useState<UnlockedItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync user with Supabase on login
  const syncUser = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/user/sync', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setGemsBalance(data.user.gems_balance);
      }
    } catch (error) {
      console.error('Failed to sync user:', error);
    }
  }, [user]);

  // Load gems balance from Supabase
  const loadGemsBalance = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/gems');
      if (response.ok) {
        const data = await response.json();
        setGemsBalance(data.gemsBalance);
      }
    } catch (error) {
      console.error('Failed to load gems:', error);
    }
  }, [user]);

  // Load unlocked content from Supabase
  const loadUnlockedContent = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/unlock/list');
      if (response.ok) {
        const data = await response.json();
        setUnlockedContent(data.unlocked);
      }
    } catch (error) {
      console.error('Failed to load unlocked content:', error);
    }
  }, [user]);

  // Unlock content and deduct gems
  const unlockContent = useCallback(async (
    contentType: string,
    contentId: string,
    modelId: string,
    gemsSpent: number
  ) => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    try {
      const response = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, contentId, modelId, gemsSpent }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setGemsBalance(data.gemsBalance);
        await loadUnlockedContent();
        return { success: true, gemsBalance: data.gemsBalance };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }, [user, loadUnlockedContent]);

  // Add gems (after purchase)
  const addGems = useCallback(async (amount: number) => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    try {
      const response = await fetch('/api/gems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setGemsBalance(data.gemsBalance);
        return { success: true, gemsBalance: data.gemsBalance };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }, [user]);

  // Check if content is unlocked
  const isUnlocked = useCallback((contentType: string, contentId: string) => {
    return unlockedContent.some(
      item => item.content_type === contentType && item.content_id === contentId
    );
  }, [unlockedContent]);

  // Initial load
  useEffect(() => {
    if (isLoaded && user) {
      setLoading(true);
      Promise.all([syncUser(), loadGemsBalance(), loadUnlockedContent()])
        .finally(() => setLoading(false));
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user, syncUser, loadGemsBalance, loadUnlockedContent]);

  return {
    userData,
    gemsBalance,
    unlockedContent,
    loading,
    unlockContent,
    addGems,
    isUnlocked,
    refresh: () => {
      loadGemsBalance();
      loadUnlockedContent();
    },
  };
}
