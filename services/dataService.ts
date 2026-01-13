
import { BlogPost, Achievement } from '../types';
import { BLOG_POSTS as INITIAL_BLOGS, ACHIEVEMENTS as INITIAL_ACHIEVEMENTS } from '../constants';

const BLOGS_KEY = 'Manish_portfolio_blogs_v2';
const ACHIEVEMENTS_KEY = 'Manish_portfolio_achievements_v2';

export const getBlogs = (): BlogPost[] => {
  const stored = localStorage.getItem(BLOGS_KEY);
  if (!stored) {
    localStorage.setItem(BLOGS_KEY, JSON.stringify(INITIAL_BLOGS));
    return INITIAL_BLOGS;
  }
  return JSON.parse(stored);
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
  const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (!stored) {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(INITIAL_ACHIEVEMENTS));
    return INITIAL_ACHIEVEMENTS;
  }
  return JSON.parse(stored);
};

export const addAchievement = (achievement: Achievement) => {
  const achievements = getAchievements();
  const updated = [achievement, ...achievements];
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteAchievement = (id: string) => {
  const achievements = getAchievements();
  const updated = achievements.filter(a => a.id !== id);
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
  return updated;
};
