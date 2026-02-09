
import { Project, Skill, BlogPost, Achievement } from './types';

export const PROJECTS: Project[] = [

  {
    id: '1',
    title: 'Trivia Arena',
    description: 'An interactive quiz platform where users can create and play quizzes, featuring authentication and a joyful, user-focused UI/UX.',
    image: '/triviarena.png',
    tags: ['React', 'Firebase', 'MongoDB', 'TailwindCSS'],
    color: '#00A1FF',
    link: 'https://triviarena.maoverse.xyz/',
    disabled: false
  },
  {
    id: '2',
    title: 'Power Quote',
    description: 'A live Power Apps solution for managing quotations and purchase orders, with automated Word and PDF generation.',
    image: '/screen.png',
    tags: ['Power Apps', 'Power Automate', 'SharePoint / Dataverse', 'Word Templates'],
    color: '#FF4B4B',
    link: 'na',
    disabled: true
  },
  {
    id: '3',
    title: 'Automify The Builder',
    description: 'A drag-and-drop automation platform inspired by n8n, enabling users to visually design workflows through a clean interface.',
    image: '/auto.png',
    tags: ['React', 'Automation', 'Workflow Builder'],
    color: '#6B4BFF',
    link: 'https://automify.vercel.app/',
    disabled: false
  }
];

export const SKILLS: Skill[] = [
  { name: 'Power Platform', level: 92 },
  { name: 'Backend', level: 95 },
  { name: 'Prompt Engineering', level: 83 },
  { name: 'Automation', level: 93 },
  { name: 'Frontend', level: 80 }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Midnight Summit Hackathon – 1st Place',
    issuer: 'Midnight Foundation (In-Person)',
    date: '2025',
    icon: '🏆',
    color: '#FFD600'
  },
  {
    id: '2',
    title: 'Microsoft Hackathon & Ideathon – 1st Place',
    issuer: 'Microsoft',
    date: '2025',
    icon: '🥇',
    color: '#00A1FF'
  }
];


export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'guide',
    title: 'Action Bastion Guide to Blogging',
    date: 'Jan 20, 2025',
    excerpt: 'Learn how to use Images, Code, and Notes in your custom blog entries!',
    category: 'Documentation',
    color: '#FFD600',
    sections: [
      { type: 'text', content: 'Welcome to your rich-content editor! Below are examples of everything you can build using the JSON sections in the admin panel.' },
      { type: 'note', content: 'Pro-Tip: You can find the JSON templates for these blocks by clicking "VIEW BLUEPRINT MANUAL" in the Admin Lab!' },
      { type: 'image', content: '', caption: 'High-tech gadgets for your blog posts.' },
      { type: 'text', content: 'You can also drop code snippets that look like real 22nd-century terminals:' },
      { type: 'code', content: 'const powerUp = () => {\n  console.log("ACTION BASTION!!!");\n  return "🚀 Ready for deployment!";\n};', language: 'javascript' },
      { type: 'text', content: 'Every section is framed with neubrutalist borders to keep that premium Awwwards cartoon aesthetic.' }
    ]
  },
  {
    id: '1',
    title: 'The Secret Life of LLMs',
    date: 'Oct 12, 2024',
    excerpt: 'Exploring how hidden states in transformers resemble 90s cartoon logic.',
    category: 'AI Research',
    color: '#FF4B4B',
    sections: [
      { type: 'text', content: 'Transformers are essentially vast neural stages where attention mechanisms act as directors.' },
      { type: 'image', content: '', caption: 'Neural networks visualizing patterns.' },
      { type: 'note', content: 'Attention is all you need, but a good cape helps too!' }
    ]
  }
];

export const CARTOON_ICONS = [
  { id: 'shinchan', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Shinchan&backgroundColor=FFD600', x: 5, y: 15, scale: 1.2 },
  { id: 'doraemon', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Doraemon&backgroundColor=00A1FF', x: 85, y: 25, scale: 1.5 },
  { id: 'ninja', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ninja&backgroundColor=6B4BFF', x: 15, y: 75, scale: 1.1 },
  { id: 'pika', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Pikachu&backgroundColor=FFD600', x: 80, y: 85, scale: 1.3 },
];
