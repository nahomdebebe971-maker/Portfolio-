import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../firebase/dbService';
import { Profile, Skill, Achievement, Award, Project, Socials, ContactMessage } from '../types';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Authentication & Sessions
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  
  // Toasts
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // DB States
  profile: Profile | null;
  skills: Skill[];
  achievements: Achievement[];
  awards: Award[];
  projects: Project[];
  socials: Socials | null;
  contacts: ContactMessage[];
  loading: boolean;
  isFirebaseActive: boolean;

  // DB Sync Actions
  refreshAll: () => Promise<void>;
  updateProfile: (data: Profile) => Promise<void>;
  upsertSkill: (data: Skill) => Promise<void>;
  removeSkill: (id: string) => Promise<void>;
  upsertAchievement: (data: Achievement) => Promise<void>;
  removeAchievement: (id: string) => Promise<void>;
  upsertAward: (data: Award) => Promise<void>;
  removeAward: (id: string) => Promise<void>;
  upsertProject: (data: Project) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  updateSocials: (data: Socials) => Promise<void>;
  submitContact: (name: string, email: string, message: string) => Promise<void>;
  removeContactMessage: (id: string) => Promise<void>;

  // Metrics tracking (for visitor analytics)
  visitorCount: number;
  messageCount: number;
  incrementVisitorCount: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('nahom_admin_active') === 'true';
  });
  
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [socials, setSocials] = useState<Socials | null>(null);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(false);
  const [visitorCount, setVisitorCount] = useState<number>(0);

  // Load visitor counts dynamically from Firestore on startup
  useEffect(() => {
    const sessionActive = sessionStorage.getItem('nahom_portfolio_session_active');
    if (!sessionActive) {
      dbService.incrementVisitorCount().then(count => {
        setVisitorCount(count);
        sessionStorage.setItem('nahom_portfolio_session_active', 'true');
      }).catch(err => {
        console.warn("Could not increment visitor count:", err);
      });
    } else {
      dbService.getVisitorCount().then(count => {
        setVisitorCount(count);
      }).catch(err => {
        console.warn("Could not load visitor count:", err);
      });
    }
  }, []);

  const incrementVisitorCount = async () => {
    try {
      const updated = await dbService.incrementVisitorCount();
      setVisitorCount(updated);
    } catch (err) {
      console.warn("Could not increment visitor count dynamically:", err);
    }
  };

  // Toast controls
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().substring(2, 5);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Admin session authentication
  const loginAdmin = (password: string): boolean => {
    const isCorrect = password === 'Eyudd@110108';
    if (isCorrect) {
      setIsAdmin(true);
      sessionStorage.setItem('nahom_admin_active', 'true');
      showToast('Welcome inside, Nahom! Access granted successfully.', 'success');
    } else {
      showToast('Incorrect passcode authorization. Access denied.', 'error');
    }
    return isCorrect;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('nahom_admin_active');
    showToast('Securely logged out from Admin Session.', 'info');
  };

  // Async refresh all data
  const refreshAll = async () => {
    setLoading(true);
    try {
      const [p, s, ac, aw, pr, sc, ct, vc] = await Promise.all([
        dbService.getProfile(),
        dbService.getSkills(),
        dbService.getAchievements(),
        dbService.getAwards(),
        dbService.getProjects(),
        dbService.getSocials(),
        dbService.getContacts(),
        dbService.getVisitorCount()
      ]);

      setProfile(p);
      setSkills(s);
      setAchievements(ac);
      setAwards(aw);
      setProjects(pr);
      setSocials(sc);
      setContacts(ct);
      setVisitorCount(vc);
      
      const { isRealFirebase } = await import('../firebase/config');
      setIsFirebaseActive(isRealFirebase);
    } catch (err: any) {
      console.error('Failed to perform sync refresh', err);
      showToast('Failed to load portfolio database records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Sync operations
  const updateProfile = async (data: Profile) => {
    try {
      await dbService.saveProfile(data);
      setProfile(data);
      showToast('Homepage presentation updated successfully!', 'success');
    } catch (e: any) {
      showToast('Profile save encountered warning error', 'error');
    }
  };

  const upsertSkill = async (data: Skill) => {
    try {
      await dbService.saveSkill(data);
      setSkills(prev => {
        const idx = prev.findIndex(s => s.id === data.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = data;
          return next;
        }
        return [...prev, data];
      });
      showToast(`Skill "${data.name}" updated successfully!`, 'success');
    } catch (e) {
      showToast('Failed to write skill attributes.', 'error');
    }
  };

  const removeSkill = async (id: string) => {
    try {
      await dbService.deleteSkill(id);
      setSkills(prev => prev.filter(s => s.id !== id));
      showToast('Skill deleted successfully', 'success');
    } catch (e) {
      showToast('Failed to delete skill.', 'error');
    }
  };

  const upsertAchievement = async (data: Achievement) => {
    try {
      await dbService.saveAchievement(data);
      setAchievements(prev => {
        const idx = prev.findIndex(a => a.id === data.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = data;
          return next;
        }
        return [...prev, data];
      });
      showToast(`Achievement "${data.title}" updated!`, 'success');
    } catch (e) {
      showToast('Failed to write achievement logs.', 'error');
    }
  };

  const removeAchievement = async (id: string) => {
    try {
      await dbService.deleteAchievement(id);
      setAchievements(prev => prev.filter(a => a.id !== id));
      showToast('Achievement dynamic log entry removed.', 'success');
    } catch (e) {
      showToast('Failed to delete achievement log.', 'error');
    }
  };

  const upsertAward = async (data: Award) => {
    try {
      await dbService.saveAward(data);
      setAwards(prev => {
        const idx = prev.findIndex(a => a.id === data.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = data;
          return next;
        }
        return [...prev, data];
      });
      showToast(`Award "${data.title}" logged successfully!`, 'success');
    } catch (e) {
      showToast('Failed to save award certificate.', 'error');
    }
  };

  const removeAward = async (id: string) => {
    try {
      await dbService.deleteAward(id);
      setAwards(prev => prev.filter(a => a.id !== id));
      showToast('Award entry deleted.', 'success');
    } catch (e) {
      showToast('Failed to delete award certification document.', 'error');
    }
  };

  const upsertProject = async (data: Project) => {
    try {
      await dbService.saveProject(data);
      setProjects(prev => {
        const idx = prev.findIndex(p => p.id === data.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = data;
          return next;
        }
        return [...prev, data];
      });
      showToast(`Project "${data.title}" updated successfully!`, 'success');
    } catch (e) {
      showToast('Failed to save project item.', 'error');
    }
  };

  const removeProject = async (id: string) => {
    try {
      await dbService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      showToast('Project showcase record deleted.', 'success');
    } catch (e) {
      showToast('Failed to delete project item.', 'error');
    }
  };

  const updateSocials = async (data: Socials) => {
    try {
      await dbService.saveSocials(data);
      setSocials(data);
      showToast('Social platforms contact links updated!', 'success');
    } catch (e) {
      showToast('Failed to save social connections.', 'error');
    }
  };

  const submitContact = async (name: string, email: string, message: string) => {
    try {
      const msg: Omit<ContactMessage, 'id'> = {
        name,
        email,
        message,
        createdAt: new Date().toISOString()
      };
      await dbService.addContactMessage(msg);
      // Retrieve updated contacts list
      const updated = await dbService.getContacts();
      setContacts(updated);
      showToast('Message submitted safely. Thank you, Nahom will be in touch!', 'success');
    } catch (e) {
      showToast('Failed to send message. Please trace network.', 'error');
    }
  };

  const removeContactMessage = async (id: string) => {
    try {
      await dbService.deleteContactMessage(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      showToast('Inquiry message removed.', 'info');
    } catch (e) {
      showToast('Failed to delete contact entry.', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAdmin,
        loginAdmin,
        logoutAdmin,
        toasts,
        showToast,
        removeToast,
        profile,
        skills,
        achievements,
        awards,
        projects,
        socials,
        contacts,
        loading,
        isFirebaseActive,
        refreshAll,
        updateProfile,
        upsertSkill,
        removeSkill,
        upsertAchievement,
        removeAchievement,
        upsertAward,
        removeAward,
        upsertProject,
        removeProject,
        updateSocials,
        submitContact,
        removeContactMessage,
        visitorCount,
        messageCount: contacts.length,
        incrementVisitorCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used inside an AppProvider wrapper');
  }
  return context;
};
