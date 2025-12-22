
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  color: string;
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

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  color: string;
}
