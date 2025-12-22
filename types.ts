
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

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}
