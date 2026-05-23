export interface Profile {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  titleText: string;
  education: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

export interface Award {
  id: string;
  title: string;
  description: string;
  eventName: string;
  date: string;
  imageUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  imageUrl?: string;
  github?: string;
  demo?: string;
}

export interface Socials {
  id: string;
  github: string;
  telegram: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  email: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}
