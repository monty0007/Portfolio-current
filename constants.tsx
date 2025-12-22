
import { Project, Skill, BlogPost, Achievement } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Cartoon RAG Assistant',
    description: 'A retrieval-augmented generation system that talks like your favorite 90s cartoon characters using LLM fine-tuning.',
    image: 'https://images.unsplash.com/photo-1675557009875-436f595b295d?auto=format&fit=crop&q=80&w=800',
    tags: ['Python', 'LangChain', 'OpenAI'],
    color: '#FF4B4B'
  },
  {
    id: '2',
    title: 'Visual Prompt Lab',
    description: 'Interactive playground for engineering visual prompts, specifically designed for comic-style image generation.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    tags: ['Stable Diffusion', 'React', 'FastAPI'],
    color: '#00A1FF'
  },
  {
    id: '3',
    title: 'Agentic Workflow Engine',
    description: 'Autonomous AI agents that collaborate to build software, managed through a playful, high-energy UI.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    tags: ['AutoGPT', 'Docker', 'Go'],
    color: '#6B4BFF'
  }
];

export const SKILLS: Skill[] = [
  { name: 'LLM Architect', level: 95 },
  { name: 'PyTorch / JAX', level: 90 },
  { name: 'Prompt Eng', level: 98 },
  { name: 'Vector DBs', level: 85 },
  { name: 'React/Frontend', level: 80 }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Global GenAI Hackathon Winner',
    issuer: 'Google Cloud',
    date: '2024',
    icon: '🏆',
    color: '#FFD600'
  },
  {
    id: '2',
    title: 'Top AI Contributor',
    issuer: 'Open Source Community',
    date: '2023',
    icon: '🌟',
    color: '#00A1FF'
  },
  {
    id: '3',
    title: 'Neural Arts Certified',
    issuer: 'DeepLearning.AI',
    date: '2023',
    icon: '🎨',
    color: '#FF4B4B'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Secret Life of LLMs',
    date: 'Oct 12, 2024',
    excerpt: 'Exploring how hidden states in transformers resemble 90s cartoon logic.',
    content: 'Transformers are essentially vast neural stages where attention mechanisms act as directors, deciding which parts of the input script get the spotlight. Much like a 90s cartoon, where physics can be rewritten for a gag, LLMs can reshape context and meaning through their high-dimensional vector spaces.',
    category: 'AI Research',
    color: '#FF4B4B'
  },
  {
    id: '2',
    title: 'Doraemon\'s Pocket: A RAG Story',
    date: 'Sept 28, 2024',
    excerpt: 'How to build retrieval systems that feel like magic gadget pockets.',
    content: 'Retrieval-Augmented Generation (RAG) is the technological equivalent of Doraemon\'s 4D pocket. Instead of storing every possible gadget inside the model weights, we use a vector database to fetch the exact tool needed for the current situation. This allows for an infinitely expandable knowledge base without the overhead of massive parameter counts.',
    category: 'Engineering',
    color: '#00A1FF'
  },
  {
    id: '3',
    title: 'Shinchan\'s Guide to Prompting',
    date: 'Aug 15, 2024',
    excerpt: 'Mischievous techniques for getting the most out of large language models.',
    content: 'Mischievous prompting involves understanding the model\'s quirks and using creative, high-energy language to steer it away from robotic responses. By treating the AI like a playful companion rather than a sterile machine, we can unlock emergent behaviors that are both surprising and highly effective for creative tasks.',
    category: 'Prompt Eng',
    color: '#FFD600'
  }
];

export const CARTOON_ICONS = [
  { id: 'shinchan', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Shinchan&backgroundColor=FFD600', x: 5, y: 15, scale: 1.2 },
  { id: 'doraemon', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Doraemon&backgroundColor=00A1FF', x: 85, y: 25, scale: 1.5 },
  { id: 'ninja', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ninja&backgroundColor=6B4BFF', x: 15, y: 75, scale: 1.1 },
  { id: 'pika', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Pikachu&backgroundColor=FFD600', x: 80, y: 85, scale: 1.3 },
];
