
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
  },
  {
    id: '4',
    title: 'Oryn',
    description: 'A prompt board that helps users craft precise, structured prompts to generate accurate AI images — no more guessing what to type.',
    image: '/oryn.png',
    tags: ['AI', 'Prompt Engineering', 'Image Generation', 'React'],
    color: '#FF6B35',
    link: 'https://oryn.maoverse.xyz/',
    disabled: false
  },
  {
    id: '5',
    title: 'Doc Reaper',
    description: 'A web tool that converts HTML to PDF on the fly — built because no reliable online solution existed for this seemingly simple need.',
    image: '/docreaper.png',
    tags: ['Node.js', 'HTML to PDF', 'Web Tool'],
    color: '#E91E63',
    link: 'https://docreaper.maoverse.xyz/',
    disabled: false
  },
  {
    id: '6',
    title: 'Mario Kart',
    description: 'Hackathon-winning game: an extended Mario experience where the player navigates through levels inside a kart, blending classic platformer mechanics with kart gameplay.',
    image: '/mariokart.png',
    tags: ['JavaScript', 'Canvas', 'Game Dev', 'Hackathon Winner'],
    color: '#E53935',
    link: 'https://super-mario-kart-902002915057.asia-south1.run.app/',
    disabled: false
  },
  {
    id: '7',
    title: 'Reportix',
    description: 'An intelligent document system built on the Microsoft Power Platform that automates the otherwise manual, time-consuming process of generating reports inside enterprise workflows.',
    image: '/reportix.png',
    tags: ['Power Platform', 'Power Automate', 'SharePoint', 'Automation'],
    color: '#1565C0',
    link: '',
    disabled: true
  },
  {
    id: '8',
    title: 'InspectIQ',
    description: 'Digitized a critical inspection report that was previously near-impossible to standardize, and built automation to proactively track and flag machines approaching their expiry dates.',
    image: '',
    tags: ['Power Apps', 'Power Automate', 'Digitization', 'Automation'],
    color: '#37474F',
    link: '',
    disabled: true
  },
  {
    id: '9',
    title: 'Azure Pricing Calculator',
    description: 'A smarter alternative to the official Azure pricing page — users can manually configure BOQs in a cleaner interface, or let AI generate them automatically. Supports saving quotes and side-by-side VM comparisons.',
    image: '/azurecalc.png',
    tags: ['React', 'Azure', 'AI', 'BOQ', 'VM Comparison'],
    color: '#0078D4',
    link: 'http://calcai.maoverse.xyz/',
    disabled: false
  },
  {
    id: '10',
    title: 'BizForge',
    description: 'An end-to-end business operations suite tailored for SMBs — covers the full cycle from quotation creation and approvals to accounts payable, payment processing, and Tally push integration. Includes RBAC, admin dashboards, and financial graphs.',
    image: '/foetronlab.png',
    tags: ['React', 'Finance', 'RBAC', 'Tally Integration', 'SMB', 'ERP'],
    color: '#2E7D32',
    link: '',
    disabled: true
  },
  {
    id: '11',
    title: 'Cookie Craze',
    description: 'A delightful, fully animated cookie-themed website with smooth transitions and playful UI interactions.',
    image: '/cookie.png',
    tags: ['HTML', 'CSS', 'Animation'],
    color: '#FF9800',
    link: '',
    disabled: false
  },
  {
    id: '12',
    title: 'Yojana AI',
    description: 'Simply describe yourself and Yojana AI surfaces all government schemes you are eligible for — eliminating the need to manually browse through hundreds of scheme listings across portals.',
    image: '/yojana.png',
    tags: ['AI', 'React', 'Government Schemes', 'NLP'],
    color: '#6A1B9A',
    link: '',
    disabled: false
  },
  {
    id: '13',
    title: 'Promptboard',
    description: 'A sleek prompt board for AI image generation — same core idea as Oryn but rebuilt from scratch with a completely different UI/UX direction, exploring an alternate design language for the same problem.',
    image: '/promptboard.png',
    tags: ['AI', 'Prompt Engineering', 'Image Generation', 'React'],
    color: '#00BCD4',
    link: 'https://promptboard.zero1studio.xyz/',
    disabled: false
  },
  {
    id: '14',
    title: 'ReelTrace',
    description: 'Drop any Instagram reel link and ReelTrace pinpoints the exact filming location on a map — or generates a ready-to-use travel itinerary based on the spots featured in the reel.',
    image: '/reeltrace.png',
    tags: ['AI', 'React', 'Location Detection', 'Travel', 'Instagram'],
    color: '#F06292',
    link: 'https://itinerary-planner-liard.vercel.app/plan',
    disabled: false
  },
  {
    id: '15',
    title: 'Only4You',
    description: 'India\'s learning platform for Ethical Hacking, Python, Web Development & AI — with 300+ lessons, live safe labs, an in-browser code editor, and an Azure AI Mentor, all for ₹99/year.',
    image: '/only4you.png',
    tags: ['React', 'Node.js', 'Learning Platform', 'Real-time'],
    color: '#43A047',
    link: 'https://only4you-app.vercel.app/',
    disabled: false
  },
  {
    id: '16',
    title: 'MSPulse',
    description: 'Got tired of digging through Microsoft\'s website for real updates — so built a personal dashboard that auto-fetches and surfaces the latest Microsoft product and security updates on a clean, scheduled feed.',
    image: '/mspulse.png',
    tags: ['React', 'Automation', 'Microsoft', 'Scheduled Fetch', 'Dashboard'],
    color: '#0078D4',
    link: 'https://microsoftupdates.co.in/',
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
