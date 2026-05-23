import { supabase } from './config';
import { Profile, Skill, Achievement, Award, Project, Socials, ContactMessage } from '../types';

// Initial default placeholder values for fallback / auto-hydrate
const INITIAL_PROFILE: Profile = {
  id: 'default',
  name: 'Nahom Debebe',
  bio: 'I am Nahom Debebe, a passionate student developer focused on modern web development, artificial intelligence, cybersecurity awareness, and digital innovation. I enjoy building creative systems that solve real-world problems and improve user experiences. My goal is to become a highly skilled software engineer and technology innovator.',
  avatarUrl: 'https://i.postimg.cc/Y0yKdbbg/IMG-20260517-213404-358.jpg',
  titleText: 'Student Developer | Web Developer | AI Enthusiast | Future Software Engineer | Creative Digital Builder',
  education: 'Student at ODA SPECIAL BOARDING SCHOOL'
};

const INITIAL_SKILLS: Skill[] = [
  { id: '1', name: 'React', level: 90, category: 'Frontend' },
  { id: '2', name: 'Firebase', level: 85, category: 'Backend' },
  { id: '3', name: 'Artificial Intelligence', level: 80, category: 'AI & Data' },
  { id: '4', name: 'Video Editing', level: 85, category: 'Design & Media' },
  { id: '5', name: 'Cybersecurity', level: 75, category: 'Security' },
  { id: '6', name: 'Tailwind CSS', level: 95, category: 'Frontend' },
  { id: '7', name: 'Web Development', level: 90, category: 'General' },
  { id: '8', name: 'UI/UX Design', level: 80, category: 'Design & Media' },
  { id: '9', name: 'Automation', level: 75, category: 'AI & Data' }
];

const INITIAL_AWARDS: Award[] = [
  {
    id: '1',
    title: 'Outstanding Innovator Award',
    description: 'Recognized for building innovative digital solutions to real-world educational challenges.',
    eventName: 'ODA Special Science Exhibition',
    date: '2025-11-12',
    imageUrl: 'https://i.postimg.cc/gjV6vGmn/5818839401230961874-121.jpg'
  }
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Cybersecurity Awareness Lead',
    description: 'Conducted interactive cybersecurity training and workshops targeting online threat prevention and digital hygiene for peers at ODA Special Boarding School.',
    date: 'March 2026',
    imageUrl: ''
  },
  {
    id: '2',
    title: 'AI Automation Hackathon Runner-up',
    description: 'Conceptualized and developed an AI chatbot helper designed to assist incoming students with peer learnings and class syllabus guidelines.',
    date: 'January 2026',
    imageUrl: ''
  }
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Futuristic Learning Hub',
    description: 'A complete custom learning web system built to augment student peer review, optimized with custom study planning algorithms and peer metrics tracker.',
    tech: ['React', 'Tailwind CSS', 'Firebase'],
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    github: 'https://github.com',
    demo: 'https://example.com'
  },
  {
    id: '2',
    title: 'Secure Guard Simulation',
    description: 'An interactive simulator built to educate students about modern cryptography and strong hashing logic to enhance local cyber-hygiene.',
    tech: ['React', 'Tailwind CSS', 'Framer Motion'],
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop',
    github: 'https://github.com',
    demo: 'https://example.com'
  }
];

const INITIAL_SOCIALS: Socials = {
  id: 'default',
  github: 'https://github.com',
  telegram: 'https://t.me',
  linkedin: 'https://linkedin.com',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  whatsapp: 'https://wa.me',
  email: 'nahomdebebe971@gmail.com'
};

export const dbService = {
  // PROFILE
  async getProfile(): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return data as Profile;
      } else {
        const { error: insertError } = await supabase
          .from('profile')
          .insert(INITIAL_PROFILE);
        
        if (insertError) console.warn("Failed to auto-seed profile, returning default:", insertError);
        return INITIAL_PROFILE;
      }
    } catch (e) {
      console.error("Error loading profile from Supabase:", e);
      return INITIAL_PROFILE;
    }
  },

  async saveProfile(profile: Profile): Promise<void> {
    try {
      const { error } = await supabase
        .from('profile')
        .upsert({
          id: 'default',
          name: profile.name,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          titleText: profile.titleText,
          education: profile.education
        });
      
      if (error) throw error;
    } catch (e) {
      console.error("Error saving profile to Supabase:", e);
      throw e;
    }
  },

  // SKILLS
  async getSkills(): Promise<Skill[]> {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*');

      if (error) throw error;

      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from('skills')
          .insert(INITIAL_SKILLS);

        if (insertError) console.warn("Failed to auto-seed skills:", insertError);
        return INITIAL_SKILLS;
      }

      return data as Skill[];
    } catch (e) {
      console.error("Error loading skills from Supabase:", e);
      return [];
    }
  },

  async saveSkill(skill: Skill): Promise<void> {
    try {
      const { error } = await supabase
        .from('skills')
        .upsert({
          id: skill.id,
          name: skill.name,
          level: skill.level,
          category: skill.category
        });

      if (error) throw error;
    } catch (e) {
      console.error("Error saving skill to Supabase:", e);
      throw e;
    }
  },

  async deleteSkill(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      console.error("Error deleting skill from Supabase:", e);
      throw e;
    }
  },

  // ACHIEVEMENTS
  async getAchievements(): Promise<Achievement[]> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*');

      if (error) throw error;

      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from('achievements')
          .insert(INITIAL_ACHIEVEMENTS);

        if (insertError) console.warn("Failed to auto-seed achievements:", insertError);
        return INITIAL_ACHIEVEMENTS;
      }

      return data as Achievement[];
    } catch (e) {
      console.error("Error loading achievements from Supabase:", e);
      return [];
    }
  },

  async saveAchievement(achievement: Achievement): Promise<void> {
    try {
      const { error } = await supabase
        .from('achievements')
        .upsert({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          date: achievement.date,
          imageUrl: achievement.imageUrl || ''
        });

      if (error) throw error;
    } catch (e) {
      console.error("Error saving achievement to Supabase:", e);
      throw e;
    }
  },

  async deleteAchievement(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      console.error("Error deleting achievement from Supabase:", e);
      throw e;
    }
  },

  // AWARDS
  async getAwards(): Promise<Award[]> {
    try {
      const { data, error } = await supabase
        .from('awards')
        .select('*');

      if (error) throw error;

      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from('awards')
          .insert(INITIAL_AWARDS);

        if (insertError) console.warn("Failed to auto-seed awards:", insertError);
        return INITIAL_AWARDS;
      }

      return data as Award[];
    } catch (e) {
      console.error("Error loading awards from Supabase:", e);
      return [];
    }
  },

  async saveAward(award: Award): Promise<void> {
    try {
      const { error } = await supabase
        .from('awards')
        .upsert({
          id: award.id,
          title: award.title,
          description: award.description,
          eventName: award.eventName,
          date: award.date,
          imageUrl: award.imageUrl || ''
        });

      if (error) throw error;
    } catch (e) {
      console.error("Error saving award to Supabase:", e);
      throw e;
    }
  },

  async deleteAward(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('awards')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      console.error("Error deleting award from Supabase:", e);
      throw e;
    }
  },

  // PROJECTS
  async getProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*');

      if (error) throw error;

      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from('projects')
          .insert(INITIAL_PROJECTS);

        if (insertError) console.warn("Failed to auto-seed projects:", insertError);
        return INITIAL_PROJECTS;
      }

      return data as Project[];
    } catch (e) {
      console.error("Error loading projects from Supabase:", e);
      return [];
    }
  },

  async saveProject(project: Project): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .upsert({
          id: project.id,
          title: project.title,
          description: project.description,
          tech: project.tech,
          imageUrl: project.imageUrl || '',
          github: project.github || '',
          demo: project.demo || ''
        });

      if (error) throw error;
    } catch (e) {
      console.error("Error saving project to Supabase:", e);
      throw e;
    }
  },

  async deleteProject(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      console.error("Error deleting project from Supabase:", e);
      throw e;
    }
  },

  // SOCIALS
  async getSocials(): Promise<Socials> {
    try {
      const { data, error } = await supabase
        .from('socials')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return data as Socials;
      } else {
        const { error: insertError } = await supabase
          .from('socials')
          .insert(INITIAL_SOCIALS);

        if (insertError) console.warn("Failed to auto-seed socials, returning default:", insertError);
        return INITIAL_SOCIALS;
      }
    } catch (e) {
      console.error("Error loading socials from Supabase:", e);
      return INITIAL_SOCIALS;
    }
  },

  async saveSocials(socials: Socials): Promise<void> {
    try {
      const { error } = await supabase
        .from('socials')
        .upsert({
          id: 'default',
          github: socials.github,
          telegram: socials.telegram,
          linkedin: socials.linkedin,
          instagram: socials.instagram,
          facebook: socials.facebook,
          whatsapp: socials.whatsapp,
          email: socials.email
        });

      if (error) throw error;
    } catch (e) {
      console.error("Error saving socials to Supabase:", e);
      throw e;
    }
  },

  // CONTACTS
  async getContacts(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*');

      if (error) throw error;

      return (data || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as ContactMessage[];
    } catch (e) {
      console.error("Error loading contacts from Supabase:", e);
      return [];
    }
  },

  async addContactMessage(message: Omit<ContactMessage, 'id'>): Promise<void> {
    try {
      const id = Date.now().toString();
      const { error } = await supabase
        .from('contacts')
        .insert({
          id,
          name: message.name,
          email: message.email,
          message: message.message,
          createdAt: message.createdAt
        });

      if (error) throw error;
    } catch (e) {
      console.error("Error adding contact message to Supabase:", e);
      throw e;
    }
  },

  async deleteContactMessage(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      console.error("Error deleting contact message from Supabase:", e);
      throw e;
    }
  },

  // VISITOR ANALYTICS
  async getVisitorCount(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('metrics')
        .select('count')
        .eq('id', 'visitors')
        .maybeSingle();

      if (error) throw error;

      return data ? (data.count || 0) : 0;
    } catch (e) {
      console.warn("Supabase error getVisitorCount, default to 0:", e);
      return 0;
    }
  },

  async incrementVisitorCount(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('metrics')
        .select('count')
        .eq('id', 'visitors')
        .maybeSingle();

      let currentVal = data ? (data.count || 0) : 0;
      // Safeguard in case DB count initially starts empty
      if (currentVal === 0 && !data) {
        currentVal = 1;
      }
      const newVal = currentVal + 1;

      const { error: upsertError } = await supabase
        .from('metrics')
        .upsert({ id: 'visitors', count: newVal });

      if (upsertError) throw upsertError;

      return newVal;
    } catch (e) {
      console.warn("Supabase error incrementVisitorCount, default to 1:", e);
      return 1;
    }
  }
};
