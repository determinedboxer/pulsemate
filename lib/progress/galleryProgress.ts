// Gallery Progress Module
// Specialized functions for gallery and photo tracking

import { GalleryProgress } from "./types";
import { ProgressManager } from "./index";

// Hook for React components
export const useGalleryProgress = () => {
  return {
    // Mark a photo as viewed
    markViewed: (photoId: string): boolean => {
      return ProgressManager.gallery.markPhotoViewed(photoId);
    },

    // Check if photo was viewed
    isViewed: (photoId: string): boolean => {
      return ProgressManager.gallery.isPhotoViewed(photoId);
    },

    // Toggle favorite status
    toggleFavorite: (photoId: string): boolean => {
      return ProgressManager.gallery.toggleFavorite(photoId);
    },

    // Check if photo is favorited
    isFavorited: (photoId: string): boolean => {
      return ProgressManager.gallery.isPhotoFavorited(photoId);
    },

    // Get all progress data
    getProgress: (): GalleryProgress => {
      return ProgressManager.gallery.getProgress();
    },

    // Get view count for a specific photo
    getPhotoViews: (photoId: string): number => {
      const progress = ProgressManager.gallery.getProgress();
      return progress.lastViewed[photoId] ? 1 : 0;
    },

    // Get last viewed timestamp
    getLastViewed: (photoId: string): number | null => {
      const progress = ProgressManager.gallery.getProgress();
      return progress.lastViewed[photoId] || null;
    },

    // Get total views across all photos
    getTotalViews: (): number => {
      const progress = ProgressManager.gallery.getProgress();
      return progress.totalViews;
    },

    // Get all viewed photos
    getViewedPhotos: (): string[] => {
      const progress = ProgressManager.gallery.getProgress();
      return progress.viewedPhotos;
    },

    // Get all favorited photos
    getFavoritedPhotos: (): string[] => {
      const progress = ProgressManager.gallery.getProgress();
      return progress.favoritePhotos;
    },

    // Clear all gallery progress
    clearAll: (): boolean => {
      return ProgressManager.gallery.saveProgress({
        viewedPhotos: [],
        favoritePhotos: [],
        totalViews: 0,
        lastViewed: {},
      });
    },
  };
};

// Track photo unlock and view together
export const trackPhotoUnlock = (photoId: string, model: string): void => {
  // Add to unlocked photos
  ProgressManager.photos.addUnlocked(model, photoId);
  
  // Mark as viewed
  ProgressManager.gallery.markPhotoViewed(photoId);
};

// Get gallery stats for a model
export const getModelGalleryStats = (
  model: string, 
  totalPhotos: number
): {
  unlocked: number;
  viewed: number;
  favorited: number;
  completion: number;
} => {
  const unlocked = ProgressManager.photos.getUnlocked(model).length;
  const galleryProgress = ProgressManager.gallery.getProgress();
  
  // Count viewed and favorited for this model's photos
  const modelPrefix = `${model}_`;
  const viewed = galleryProgress.viewedPhotos.filter(id => 
    id.startsWith(modelPrefix)
  ).length;
  const favorited = galleryProgress.favoritePhotos.filter(id => 
    id.startsWith(modelPrefix)
  ).length;
  
  return {
    unlocked,
    viewed,
    favorited,
    completion: totalPhotos > 0 ? Math.round((unlocked / totalPhotos) * 100) : 0,
  };
};

// Get recent activity (last viewed photos)
export const getRecentActivity = (limit: number = 10): Array<{
  photoId: string;
  timestamp: number;
}> => {
  const progress = ProgressManager.gallery.getProgress();
  
  return Object.entries(progress.lastViewed)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([photoId, timestamp]) => ({ photoId, timestamp }));
};
