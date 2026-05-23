import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Skill, Project, Award, Achievement, Socials, Profile } from '../types';
import CloudinaryUploader from '../components/CloudinaryUploader';
import { 
  Users, 
  MessageSquare, 
  Activity, 
  Settings, 
  User, 
  Sparkles, 
  FolderKanban, 
  Award as AwardIcon, 
  Calendar, 
  Globe, 
  Trash2, 
  Plus, 
  X, 
  Edit3, 
  LogOut, 
  Save, 
  Terminal, 
  FolderGit, 
  Share2, 
  KeyRound,
  Database,
  Check
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const {
    logoutAdmin,
    profile,
    skills,
    achievements,
    awards,
    projects,
    socials,
    contacts,
    loading,
    visitorCount,
    isFirebaseActive,
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
    removeContactMessage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'skills' | 'projects' | 'awards' | 'achievements' | 'socials' | 'messages'>('overview');

  // Modal / Form States
  const [skillForm, setSkillForm] = useState<Partial<Skill>>({ name: '', level: 80, category: 'Frontend' });
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  const [projectForm, setProjectForm] = useState<Partial<Project>>({ title: '', description: '', tech: [], imageUrl: '', github: '', demo: '' });
  const [techString, setTechString] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [awardForm, setAwardForm] = useState<Partial<Award>>({ title: '', description: '', eventName: '', date: '', imageUrl: '' });
  const [editingAwardId, setEditingAwardId] = useState<string | null>(null);

  const [achievementForm, setAchievementForm] = useState<Partial<Achievement>>({ title: '', description: '', date: '', imageUrl: '' });
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);

  // Profile Form States
  const [profileForm, setProfileForm] = useState<Profile>(() => {
    return profile || {
      id: 'default',
      name: 'Nahom Debebe',
      bio: '',
      avatarUrl: '',
      titleText: '',
      education: ''
    };
  });

  // Socials Form States
  const [socialsForm, setSocialsForm] = useState<Socials>(() => {
    return socials || {
      id: 'default',
      github: '',
      telegram: '',
      linkedin: '',
      instagram: '',
      facebook: '',
      whatsapp: '',
      email: ''
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-mono">
        <div className="h-10 w-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <span>SYNCHRONIZING PORTFOLIO DATABASE...</span>
      </div>
    );
  }

  // Edit Handlers
  const handleProfileFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(profileForm);
  };

  const handleSocialsFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSocials(socialsForm);
  };

  // SKILL ACTIONS
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name || !skillForm.level) return;
    const id = editingSkillId || Date.now().toString();
    await upsertSkill({
      id,
      name: skillForm.name,
      level: Number(skillForm.level),
      category: skillForm.category || 'Frontend'
    });
    setSkillForm({ name: '', level: 80, category: 'Frontend' });
    setEditingSkillId(null);
  };

  const triggerEditSkill = (sk: Skill) => {
    setSkillForm(sk);
    setEditingSkillId(sk.id);
  };

  // PROJECT ACTIONS
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) return;
    const arrayTech = techString.split(',').map(s => s.trim()).filter(Boolean);
    const id = editingProjectId || Date.now().toString();
    await upsertProject({
      id,
      title: projectForm.title,
      description: projectForm.description,
      tech: arrayTech,
      imageUrl: projectForm.imageUrl || '',
      github: projectForm.github || '',
      demo: projectForm.demo || ''
    });
    // Reset
    setProjectForm({ title: '', description: '', tech: [], imageUrl: '', github: '', demo: '' });
    setTechString('');
    setEditingProjectId(null);
  };

  const triggerEditProject = (pr: Project) => {
    setProjectForm(pr);
    setTechString(pr.tech.join(', '));
    setEditingProjectId(pr.id);
  };

  // AWARD ACTIONS
  const handleSaveAward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardForm.title || !awardForm.description || !awardForm.eventName || !awardForm.date) return;
    const id = editingAwardId || Date.now().toString();
    await upsertAward({
      id,
      title: awardForm.title,
      description: awardForm.description,
      eventName: awardForm.eventName,
      date: awardForm.date,
      imageUrl: awardForm.imageUrl || ''
    });
    setAwardForm({ title: '', description: '', eventName: '', date: '', imageUrl: '' });
    setEditingAwardId(null);
  };

  const triggerEditAward = (aw: Award) => {
    setAwardForm(aw);
    setEditingAwardId(aw.id);
  };

  // ACHIEVEMENT ACTIONS
  const handleSaveAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievementForm.title || !achievementForm.description || !achievementForm.date) return;
    const id = editingAchievementId || Date.now().toString();
    await upsertAchievement({
      id,
      title: achievementForm.title,
      description: achievementForm.description,
      date: achievementForm.date,
      imageUrl: achievementForm.imageUrl || ''
    });
    setAchievementForm({ title: '', description: '', date: '', imageUrl: '' });
    setEditingAchievementId(null);
  };

  const triggerEditAchievement = (ac: Achievement) => {
    setAchievementForm(ac);
    setEditingAchievementId(ac.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-16">
      
      {/* Grid Dashboard Header Line */}
      <div className="bg-slate-900 border-b border-blue-500/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-bold font-mono text-white tracking-widest uppercase">
            Nahom's Portfolios Master Console
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/10 text-white text-xs font-mono font-bold transition-all cursor-pointer"
          >
            EXIT CONSOLE
          </button>
          <button
            onClick={logoutAdmin}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/30 hover:text-rose-450 text-slate-400 transition-all cursor-pointer"
            title="Log out from console session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Panel Content with Sidebar Navigation */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar glassmorphic list */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 font-mono text-xs border border-white/5 glass p-2 rounded-2xl shadow-xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview' ? 'sidebar-active text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Overview Stats</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('profile');
              if (profile) setProfileForm(profile);
            }}
            className={`flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile' ? 'sidebar-active text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Home & Bio</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'skills' ? 'sidebar-active text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>My Skills</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'projects' ? 'sidebar-active text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Projects Grid</span>
          </button>

          <button
            onClick={() => setActiveTab('awards')}
            className={`flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'awards' ? 'sidebar-active text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <AwardIcon className="w-4 h-4" />
            <span>Awards Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'achievements' ? 'sidebar-active text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Achievements</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('socials');
              if (socials) setSocialsForm(socials);
            }}
            className={`flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'socials' ? 'sidebar-active text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Social Links</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap relative ${
              activeTab === 'messages' ? 'sidebar-active text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Messages</span>
            {contacts.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-600 text-white text-[10px] font-sans font-extrabold h-4.5 px-1.5 flex items-center justify-center rounded-full">
                {contacts.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Panel details context display */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Stats card indicators grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border border-white/5 glass shadow-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="block text-slate-500 text-[10px] font-mono uppercase tracking-widest">Platform Users Visited</span>
                    <span className="block text-3xl font-extrabold font-mono text-white tracking-widest">{visitorCount}</span>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-white/5 glass shadow-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="block text-slate-500 text-[10px] font-mono uppercase tracking-widest">Inquiries Stored</span>
                    <span className="block text-3xl font-extrabold font-mono text-white tracking-widest">{contacts.length}</span>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center bg-purple-500/10 text-purple-400 rounded-xl">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-white/5 glass shadow-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="block text-slate-500 text-[10px] font-mono uppercase tracking-widest">Database Provider</span>
                    <span className="block text-sm font-extrabold font-mono text-emerald-400 uppercase">
                      {isFirebaseActive ? 'Google Firestore' : 'Caching Fallback'}
                    </span>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Database className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Informative card about fallback syncing */}
              <div className="p-6 rounded-2xl border border-white/5 glass shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <Settings className="w-5 h-5" />
                  <h3 className="font-bold text-white">Dynamic Portfolios CMS Dashboard</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-sans">
                  Welcome to your highly integrated administrative dashboard, Nahom. All inputs and uploads managed under this panel synchronize in real-time to your Firestore collection databases when activated. If Firestore services aren't initialized yet, our fail-safe system automatically caches edits in local client browsers so you can iterate mockup visuals seamlessly!
                </p>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span>Database Connection Status: {isFirebaseActive ? 'Real-time sync to Cloud Firestore is ACTIVE.' : 'Offline preview mode is active. (Connect Firestore in Firebase UI anytime).'}</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileFormSubmit} className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 backdrop-blur-md space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>Modify Presentation Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-sm focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400">Education Details</label>
                  <input
                    type="text"
                    value={profileForm.education}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, education: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-sm focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400">Professional Titles (Vertical Bar separated)</label>
                <input
                  type="text"
                  value={profileForm.titleText}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, titleText: e.target.value }))}
                  placeholder="Student Developer | Web Developer | AI Enthusiast"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400">Biography Main Statement</label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-sm focus:outline-none focus:border-blue-500/50 font-sans leading-relaxed"
                />
              </div>

              {/* Avatar upload system */}
              <div className="border-t border-slate-800 pt-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-8">
                  <CloudinaryUploader
                    folder="portfolio/profile"
                    onUploadSuccess={(url) => setProfileForm(prev => ({ ...prev, avatarUrl: url }))}
                    label="Avatar Profile Picture"
                  />
                </div>
                <div className="sm:col-span-4 flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 font-mono uppercase mb-2">Avatar Active</span>
                  <div className="h-20 w-20 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img src={profileForm.avatarUrl || 'https://i.postimg.cc/Y0yKdbbg/IMG-20260517-213404-358.jpg'} alt="Avatar Active" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs font-mono rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>SAVE GENERAL HOMEPAGE TEXT</span>
              </button>
            </form>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-8">
              {/* Form to append skill */}
              <form onSubmit={handleSaveSkill} className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest text-indigo-400">
                  {editingSkillId ? 'Edit Competency' : 'Add New Competency'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Skill Title / Tool</label>
                    <input
                      type="text"
                      value={skillForm.name}
                      onChange={(e) => setSkillForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="React / NextJS / Hashing"
                      className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Level Level % ({skillForm.level}%)</label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={skillForm.level}
                      onChange={(e) => setSkillForm(prev => ({ ...prev, level: Number(e.target.value) }))}
                      className="w-full h-8 cursor-pointer accent-blue-500 bg-transparent flex items-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Category Tag</label>
                    <select
                      value={skillForm.category}
                      onChange={(e) => setSkillForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800 focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="AI & Data">AI & Data</option>
                      <option value="Security">Security</option>
                      <option value="Design & Media">Design & Media</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingSkillId ? 'UPDATE SKILL' : 'ADD NEW SKILL'}</span>
                  </button>
                  {editingSkillId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSkillId(null);
                        setSkillForm({ name: '', level: 80, category: 'Frontend' });
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-850 text-slate-400 text-xs font-mono cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Skills Index */}
              <div className="border border-slate-850 rounded-2xl overflow-hidden bg-slate-950/20 font-mono">
                <div className="bg-slate-900/60 px-5 py-3 border-b border-slate-850 text-[10px] text-slate-400 uppercase tracking-widest flex justify-between">
                  <span>Resource Name / Category</span>
                  <span>Interactive Admin Actions</span>
                </div>
                
                <div className="divide-y divide-slate-905">
                  {skills.map((sk) => (
                    <div key={sk.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-900/10">
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-white block">{sk.name}</span>
                        <span className="text-[10px] p-1 px-1.5 rounded bg-slate-900 text-blue-400 border border-slate-850/30">
                          {sk.category} ({sk.level}%)
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => triggerEditSkill(sk)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/30 text-blue-400 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeSkill(sk.id)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/30 text-rose-450 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              {/* Form grid insert project */}
              <form onSubmit={handleSaveProject} className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest text-indigo-400">
                  {editingProjectId ? 'Modify Project Attributes' : 'Deploy New Project Showcase'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Project Title</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                      placeholder="Cyber security matrix simulation"
                      className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Technologies (Comma separated)</label>
                    <input
                      type="text"
                      value={techString}
                      onChange={(e) => setTechString(e.target.value)}
                      placeholder="React, CSS, Firebase"
                      className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Description Body</label>
                  <textarea
                    rows={3}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                    placeholder="Describe how the dynamic layout helps students..."
                    className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">GitHub Link</label>
                    <input
                      type="url"
                      value={projectForm.github}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, github: e.target.value }))}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800 focus:outline-none focus:border-blue-500/50 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Live deployment Link</label>
                    <input
                      type="url"
                      value={projectForm.demo}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, demo: e.target.value }))}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800 focus:outline-none focus:border-blue-500/50 font-mono"
                    />
                  </div>
                </div>

                {/* Cloudinary Integration for Project image preview */}
                <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex-1 w-full">
                    <CloudinaryUploader
                      folder="portfolio/projects"
                      onUploadSuccess={(url) => setProjectForm(prev => ({ ...prev, imageUrl: url }))}
                      label="Upload Showcase Cover Photo"
                    />
                  </div>
                  {projectForm.imageUrl && (
                    <div className="h-16 w-24 rounded border border-slate-800 overflow-hidden bg-slate-950">
                      <img src={projectForm.imageUrl} alt="Project Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold cursor-pointer"
                  >
                    Deploy Project record
                  </button>
                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProjectId(null);
                        setTechString('');
                        setProjectForm({ title: '', description: '', tech: [], imageUrl: '', github: '', demo: '' });
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-850 text-slate-400 text-xs font-mono cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Projects List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((pr) => (
                  <div key={pr.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-sm">{pr.title}</h4>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => triggerEditProject(pr)}
                          className="p-1 rounded bg-slate-900 border border-slate-800 text-blue-400 hover:text-blue-300 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeProject(pr.id)}
                          className="p-1 rounded bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{pr.description}</p>
                    
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <span>{pr.tech.length} Technologies</span>
                      {pr.imageUrl && <span className="text-blue-400">Cover Active</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AWARDS */}
          {activeTab === 'awards' && (
            <div className="space-y-8">
              {/* Form grid insert award */}
              <form onSubmit={handleSaveAward} className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest text-indigo-400">
                  {editingAwardId ? 'Modify Award / Certificate Log' : 'Log New High-Profile Award'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Award Title</label>
                    <input
                      type="text"
                      value={awardForm.title}
                      onChange={(e) => setAwardForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                      placeholder="First Place STEM Inventor"
                      className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Event Name / Institution</label>
                    <input
                      type="text"
                      value={awardForm.eventName}
                      onChange={(e) => setAwardForm(prev => ({ ...prev, eventName: e.target.value }))}
                      required
                      placeholder="ODA Science Exhibition 2026"
                      className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Date Achieved</label>
                    <input
                      type="text"
                      value={awardForm.date || ''}
                      onChange={(e) => setAwardForm(prev => ({ ...prev, date: e.target.value }))}
                      required
                      placeholder="November 2025"
                      className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Brief Overview Context</label>
                    <input
                      type="text"
                      value={awardForm.description || ''}
                      onChange={(e) => setAwardForm(prev => ({ ...prev, description: e.target.value }))}
                      required
                      placeholder="Highly commended certification in software algorithms"
                      className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800"
                    />
                  </div>
                </div>

                {/* Cloudinary Integration for award image */}
                <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex-1 w-full">
                    <CloudinaryUploader
                      folder="portfolio/awards"
                      onUploadSuccess={(url) => setAwardForm(prev => ({ ...prev, imageUrl: url }))}
                      label="Upload Award Trophy Cert (Must load to Postimg fallback default if empty!)"
                    />
                  </div>
                  {awardForm.imageUrl && (
                    <div className="h-16 w-24 rounded border border-slate-800 overflow-hidden bg-slate-950">
                      <img src={awardForm.imageUrl} alt="Award certificate preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold cursor-pointer"
                  >
                    Log Award Certification
                  </button>
                  {editingAwardId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAwardId(null);
                        setAwardForm({ title: '', description: '', eventName: '', date: '', imageUrl: '' });
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-850 text-slate-400 text-xs font-mono cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Awards registry */}
              <div className="divide-y divide-slate-850 border border-slate-850 bg-slate-905/30 rounded-2xl overflow-hidden font-mono text-xs">
                {awards.map((aw) => (
                  <div key={aw.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-900/10">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">{aw.title}</h4>
                      <div className="text-[10px] text-slate-500 flex gap-2">
                        <span>Institution: {aw.eventName}</span>
                        <span>• Date: {aw.date}</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => triggerEditAward(aw)}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-blue-400 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeAward(aw.id)}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-rose-450 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="space-y-8">
              {/* Form achievements */}
              <form onSubmit={handleSaveAchievement} className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest text-indigo-400">
                  {editingAchievementId ? 'Edit Achievement Log' : 'Deploy Landmark Achievement Record'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Achievement Title</label>
                    <input
                      type="text"
                      value={achievementForm.title}
                      onChange={(e) => setAchievementForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                      placeholder="Cyber Security Boarding Lead"
                      className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Date Achieved</label>
                    <input
                      type="text"
                      value={achievementForm.date}
                      onChange={(e) => setAchievementForm(prev => ({ ...prev, date: e.target.value }))}
                      required
                      placeholder="March 2026 / 2025 Winter"
                      className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Achievements Details Description</label>
                  <textarea
                    rows={3}
                    value={achievementForm.description}
                    onChange={(e) => setAchievementForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                    placeholder="Provide depth on how the milestone challenges resolved..."
                    className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                {/* Optional image link */}
                <div className="border-t border-slate-800 pt-4">
                  <CloudinaryUploader
                    folder="portfolio/achievements"
                    onUploadSuccess={(url) => setAchievementForm(prev => ({ ...prev, imageUrl: url }))}
                    label="Landmark image (Optional)"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold cursor-pointer"
                  >
                    Commit Achievement
                  </button>
                  {editingAchievementId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAchievementId(null);
                        setAchievementForm({ title: '', description: '', date: '', imageUrl: '' });
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-850 text-slate-400 text-xs font-mono cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Achievements Registry Index */}
              <div className="border border-slate-850 bg-slate-905/25 rounded-2xl overflow-hidden font-mono text-xs divide-y divide-slate-850">
                {achievements.map((item) => (
                  <div key={item.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-900/10">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-[10px] text-slate-500">Timeline: {item.date}</p>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => triggerEditAchievement(item)}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-blue-400 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeAchievement(item.id)}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-rose-450 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SOCIALS */}
          {activeTab === 'socials' && (
            <form onSubmit={handleSocialsFormSubmit} className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-purple-400" />
                <span>Customize Communication Nodes</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={socialsForm.github}
                    onChange={(e) => setSocialsForm(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">Telegram Channel / User</label>
                  <input
                    type="url"
                    value={socialsForm.telegram}
                    onChange={(e) => setSocialsForm(prev => ({ ...prev, telegram: e.target.value }))}
                    placeholder="https://t.me/..."
                    className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={socialsForm.linkedin}
                    onChange={(e) => setSocialsForm(prev => ({ ...prev, linkedin: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">Instagram Handle</label>
                  <input
                    type="url"
                    value={socialsForm.instagram}
                    onChange={(e) => setSocialsForm(prev => ({ ...prev, instagram: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">Facebook URL</label>
                  <input
                    type="url"
                    value={socialsForm.facebook}
                    onChange={(e) => setSocialsForm(prev => ({ ...prev, facebook: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">WhatsApp Send API URL</label>
                  <input
                    type="url"
                    value={socialsForm.whatsapp}
                    onChange={(e) => setSocialsForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="https://wa.me/251..."
                    className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Direct Workspace Email Inbox</label>
                <input
                  type="email"
                  value={socialsForm.email}
                  onChange={(e) => setSocialsForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="nahomdebebe971@gmail.com"
                  className="w-full px-4 py-2 bg-slate-950 rounded-lg text-sm border border-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs font-mono rounded-lg hover:from-blue-500 hover:to-purple-500"
              >
                SAVE COMMUNICATION CHANNELS INDEX
              </button>
            </form>
          )}

          {/* TAB 8: CONTACT INBOX MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <span>Submitted Contact Messages ({contacts.length})</span>
              </h3>

              {contacts.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500 font-mono text-xs">
                  NO TRANSMITTED PACKETS RECORDED IN FIREBASE INBOX YET.
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((c) => (
                    <div key={c.id} className="p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-3 relative overflow-hidden">
                      {/* Subtitle bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
                        <div className="space-y-0.5">
                          <span className="block text-sm font-bold text-white font-sans">{c.name}</span>
                          <span className="block text-xs text-blue-400/80 font-mono">{c.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-550 font-mono text-slate-500">{new Date(c.createdAt).toLocaleString()}</span>
                          <button
                            onClick={() => removeContactMessage(c.id)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-rose-450 border border-slate-800 hover:border-rose-500/20 cursor-pointer"
                            title="Delete this message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Msg text */}
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {c.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
