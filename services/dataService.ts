
import { BlogPost, Achievement } from '../types';
import { BLOG_POSTS as INITIAL_BLOGS, ACHIEVEMENTS as INITIAL_ACHIEVEMENTS } from '../constants';

const BLOGS_KEY = 'Manish_portfolio_blogs_v2';
const ACHIEVEMENTS_KEY = 'Manish_portfolio_achievements_v2';
const SYNC_KEY = 'Manish_portfolio_sync_hash';

// Helper to check if initial data changed
const checkAndSync = (key: string, initialData: any, type: 'blogs' | 'achievements') => {
  const currentHash = JSON.stringify(initialData);
  const storedHash = localStorage.getItem(`${SYNC_KEY}_${type}`);

  if (storedHash !== currentHash) {
    console.log(`[DataService] Syncing ${type} from code constants...`);
    localStorage.setItem(key, currentHash); // Using currentHash as the stringified data
    localStorage.setItem(`${SYNC_KEY}_${type}`, currentHash);
    return initialData;
  }

  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : initialData;
};

export const getBlogs = (): BlogPost[] => {
  return checkAndSync(BLOGS_KEY, INITIAL_BLOGS, 'blogs');
};

export const addBlog = (blog: BlogPost) => {
  const blogs = getBlogs();
  const updated = [blog, ...blogs];
  localStorage.setItem(BLOGS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteBlog = (id: string) => {
  const blogs = getBlogs();
  const updated = blogs.filter(b => b.id !== id);
  localStorage.setItem(BLOGS_KEY, JSON.stringify(updated));
  return updated;
};

// Achievement Methods
export const getAchievements = (): Achievement[] => {
  return checkAndSync(ACHIEVEMENTS_KEY, INITIAL_ACHIEVEMENTS, 'achievements');
};

export const addAchievement = (achievement: Achievement) => {
  const achievements = getAchievements();
  const updated = [achievement, ...achievements];
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
  // Note: We don't update the sync hash here, so next code change will still override this unless we are careful.
  // Actually, if we add an item, the local storage content is now different from initial constants.
  // But the 'storedHash' is still the hash of the OLD initial constants.
  // If user modifies constants, 'currentHash' changes. 
  // 'storedHash' (old) != 'currentHash' (new) -> Reset to constants.
  // This means: Code changes > User admins changes. This is acceptable for a portfolio.
  return updated;
};

export const deleteAchievement = (id: string) => {
  const achievements = getAchievements();
  const updated = achievements.filter(a => a.id !== id);
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
  return updated;
};
