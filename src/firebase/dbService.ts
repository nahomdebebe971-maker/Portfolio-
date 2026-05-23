import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  increment
} from 'firebase/firestore';
import { db } from './config';
import { Profile, Skill, Achievement, Award, Project, Socials, ContactMessage } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial default placeholder values
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
    const path = 'profile';
    try {
      const docRef = doc(db, path, 'default');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Profile;
      } else {
        await setDoc(docRef, INITIAL_PROFILE);
        return INITIAL_PROFILE;
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `${path}/default`);
      return INITIAL_PROFILE;
    }
  },

  async saveProfile(profile: Profile): Promise<void> {
    const path = 'profile';
    try {
      await setDoc(doc(db, path, 'default'), {
        name: profile.name,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        titleText: profile.titleText,
        education: profile.education
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `${path}/default`);
    }
  },

  // SKILLS
  async getSkills(): Promise<Skill[]> {
    const path = 'skills';
    try {
      const snap = await getDocs(collection(db, path));
      if (snap.empty) {
        const promises = INITIAL_SKILLS.map(sk => setDoc(doc(db, path, sk.id), sk));
        await Promise.all(promises);
        return INITIAL_SKILLS;
      }
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },

  async saveSkill(skill: Skill): Promise<void> {
    const path = 'skills';
    try {
      await setDoc(doc(db, path, skill.id), {
        name: skill.name,
        level: skill.level,
        category: skill.category
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `${path}/${skill.id}`);
    }
  },

  async deleteSkill(id: string): Promise<void> {
    const path = 'skills';
    try {
      await deleteDoc(doc(db, path, id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${path}/${id}`);
    }
  },

  // ACHIEVEMENTS
  async getAchievements(): Promise<Achievement[]> {
    const path = 'achievements';
    try {
      const snap = await getDocs(collection(db, path));
      if (snap.empty) {
        const promises = INITIAL_ACHIEVEMENTS.map(ac => setDoc(doc(db, path, ac.id), ac));
        await Promise.all(promises);
        return INITIAL_ACHIEVEMENTS;
      }
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Achievement));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },

  async saveAchievement(achievement: Achievement): Promise<void> {
    const path = 'achievements';
    try {
      await setDoc(doc(db, path, achievement.id), {
        title: achievement.title,
        description: achievement.description,
        date: achievement.date,
        imageUrl: achievement.imageUrl || ''
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `${path}/${achievement.id}`);
    }
  },

  async deleteAchievement(id: string): Promise<void> {
    const path = 'achievements';
    try {
      await deleteDoc(doc(db, path, id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${path}/${id}`);
    }
  },

  // AWARDS
  async getAwards(): Promise<Award[]> {
    const path = 'awards';
    try {
      const snap = await getDocs(collection(db, path));
      if (snap.empty) {
        const promises = INITIAL_AWARDS.map(aw => setDoc(doc(db, path, aw.id), aw));
        await Promise.all(promises);
        return INITIAL_AWARDS;
      }
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Award));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },

  async saveAward(award: Award): Promise<void> {
    const path = 'awards';
    try {
      await setDoc(doc(db, path, award.id), {
        title: award.title,
        description: award.description,
        eventName: award.eventName,
        date: award.date,
        imageUrl: award.imageUrl || ''
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `${path}/${award.id}`);
    }
  },

  async deleteAward(id: string): Promise<void> {
    const path = 'awards';
    try {
      await deleteDoc(doc(db, path, id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${path}/${id}`);
    }
  },

  // PROJECTS
  async getProjects(): Promise<Project[]> {
    const path = 'projects';
    try {
      const snap = await getDocs(collection(db, path));
      if (snap.empty) {
        const promises = INITIAL_PROJECTS.map(pr => setDoc(doc(db, path, pr.id), pr));
        await Promise.all(promises);
        return INITIAL_PROJECTS;
      }
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },

  async saveProject(project: Project): Promise<void> {
    const path = 'projects';
    try {
      await setDoc(doc(db, path, project.id), {
        title: project.title,
        description: project.description,
        tech: project.tech,
        imageUrl: project.imageUrl || '',
        github: project.github || '',
        demo: project.demo || ''
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `${path}/${project.id}`);
    }
  },

  async deleteProject(id: string): Promise<void> {
    const path = 'projects';
    try {
      await deleteDoc(doc(db, path, id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${path}/${id}`);
    }
  },

  // SOCIALS
  async getSocials(): Promise<Socials> {
    const path = 'socials';
    try {
      const docRef = doc(db, path, 'default');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Socials;
      } else {
        await setDoc(docRef, INITIAL_SOCIALS);
        return INITIAL_SOCIALS;
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `${path}/default`);
      return INITIAL_SOCIALS;
    }
  },

  async saveSocials(socials: Socials): Promise<void> {
    const path = 'socials';
    try {
      await setDoc(doc(db, path, 'default'), {
        github: socials.github,
        telegram: socials.telegram,
        linkedin: socials.linkedin,
        instagram: socials.instagram,
        facebook: socials.facebook,
        whatsapp: socials.whatsapp,
        email: socials.email
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `${path}/default`);
    }
  },

  // CONTACTS
  async getContacts(): Promise<ContactMessage[]> {
    const path = 'contacts';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },

  async addContactMessage(message: Omit<ContactMessage, 'id'>): Promise<void> {
    const id = Date.now().toString();
    const path = 'contacts';
    try {
      await setDoc(doc(db, path, id), {
        name: message.name,
        email: message.email,
        message: message.message,
        createdAt: message.createdAt
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `${path}/${id}`);
    }
  },

  async deleteContactMessage(id: string): Promise<void> {
    const path = 'contacts';
    try {
      await deleteDoc(doc(db, path, id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${path}/${id}`);
    }
  },

  // VISITOR ANALYTICS
  async getVisitorCount(): Promise<number> {
    const path = 'metrics';
    try {
      const docRef = doc(db, path, 'visitors');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().count || 0;
      } else {
        await setDoc(docRef, { count: 1 });
        return 1;
      }
    } catch (e) {
      console.warn("Firestore error getVisitorCount, default to 0:", e);
      return 0;
    }
  },

  async incrementVisitorCount(): Promise<number> {
    const path = 'metrics';
    try {
      const docRef = doc(db, path, 'visitors');
      await setDoc(docRef, { count: increment(1) }, { merge: true });
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data().count || 1) : 1;
    } catch (e) {
      console.warn("Firestore error incrementVisitorCount, default to 1:", e);
      return 1;
    }
  }
};
