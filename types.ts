
export interface BlogSection {
  type: 'heading' | 'subheading' | 'paragraph' | 'markdown' | 'image' | 'code' | 'note' | 'text';
  content: string;
  caption?: string;
  language?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content?: string; // Legacy support
  sections?: BlogSection[];
  category: string;
  color: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  color: string;
  link: string;
  disabled: boolean;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  icon: string;
  color: string;
}
