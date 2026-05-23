import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { uploadToCloudinary } from '../cloudinary/uploadService';
import { 
  ArrowUpRight, 
  Github, 
  Linkedin, 
  Send, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  Compass, 
  ShieldAlert, 
  Terminal, 
  Award as AwardIcon, 
  Eye, 
  Check, 
  Calendar, 
  Clock, 
  Smartphone, 
  ChevronUp, 
  Mail, 
  Globe, 
  FolderGit2, 
  Flame, 
  Users, 
  Activity,
  MessageSquare,
  Facebook,
  Instagram,
  MessageCircle
} from 'lucide-react';

// Custom typewriter effect hooks
function useTypewriter(words: string[], speed = 75, delayBeforeDelete = 2000) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = words[currentWordIndex] || '';

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayedText(prev => prev.substring(0, prev.length - 1));
      }, speed / 2);
    } else {
      timer = setTimeout(() => {
        setDisplayedText(currentWord.substring(0, displayedText.length + 1));
      }, speed);
    }

    if (!isDeleting && displayedText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), delayBeforeDelete);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentWordIndex, words, speed, delayBeforeDelete]);

  return displayedText;
}

export default function PortfolioHome() {
  const {
    profile, 
    skills, 
    achievements, 
    awards, 
    projects, 
    socials, 
    loading, 
    submitContact,
    visitorCount,
    messageCount,
    incrementVisitorCount,
    isFirebaseActive
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedAwardImage, setSelectedAwardImage] = useState<string | null>(null);
  const [timeUTC, setTimeUTC] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    // Increment visitor metric
    incrementVisitorCount();

    // Scroll to top listener
    const toggleScrollBtn = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    // Live clock update for UTC elements
    const updateTime = () => {
      const now = new Date();
      setTimeUTC(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };

    window.addEventListener('scroll', toggleScrollBtn);
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('scroll', toggleScrollBtn);
      clearInterval(interval);
    };
  }, []);

  const typewriterTitles = [
    'Student Developer',
    'Web Developer',
    'AI Enthusiast',
    'Future Software Engineer',
    'Creative Digital Builder'
  ];
  
  const typedTitle = useTypewriter(typewriterTitles);

  const categories = ['All', 'Frontend', 'Backend', 'AI & Data', 'Security', 'Design & Media'];

  const filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    
    setFormSubmitting(true);
    try {
      await submitContact(contactForm.name, contactForm.email, contactForm.message);
      setContactForm({ name: '', email: '', message: '' });
    } catch (e) {
      console.error(e);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get social icons
  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'github': return <Github className="w-5 h-5" />;
      case 'telegram': return <MessageCircle className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'whatsapp': return <MessageSquare className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  // Safe variables fallback if profile is loading
  const safeProfile = profile || {
    name: 'Nahom Debebe',
    bio: 'I am Nahom Debebe, a passionate student developer focused on modern web development, artificial intelligence, cybersecurity awareness, and digital innovation. I enjoy building creative systems that solve real-world problems and improve user experiences.',
    avatarUrl: 'https://i.postimg.cc/Y0yKdbbg/IMG-20260517-213404-358.jpg',
    education: 'Student at ODA SPECIAL BOARDING SCHOOL',
    titleText: 'Student Developer | Web Developer | AI Enthusiast'
  };

  const safeSocials = socials || {
    github: 'https://github.com',
    telegram: 'https://t.me',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    whatsapp: 'https://wa.me',
    email: 'nahomdebebe971@gmail.com'
  };

  return (
    <div className="w-full relative min-h-screen text-slate-100 overflow-x-hidden pt-20">
      
      {/* Scroll Reveal Progress and Background Effects */}
      <div className="absolute top-[25%] left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[65%] right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section id="home" className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center px-6 py-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text metadata */}
          <div className="lg:col-span-7 space-y-6 text-left max-w-2xl relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400">
              <Sparkles className="w-3.5 h-3.5 animate-spin [animation-duration:4s]" />
              <span>FUTURISTIC TECHNOLOGY PORTFOLIO</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-sans font-extrabold text-white tracking-tight">
              Hello, I'm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500">
                {safeProfile.name}
              </span>
            </h1>

            {/* Simulated typing animation */}
            <div className="h-10 flex items-center">
              <span className="text-lg sm:text-2xl font-mono text-indigo-300 font-semibold tracking-wide">
                &gt; {typedTitle}
              </span>
              <span className="w-2.5 h-6 ml-1 bg-white animate-pulse" />
            </div>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Crafting premium digital experiences, coding complex secure frameworks, and discovering automated pipelines. Transforming lines of logic into beautiful digital realities.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => handleScrollTo('#projects')}
                className="px-8 py-3 bg-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-700 glow-blue transition-all duration-300 flex items-center gap-2 cursor-pointer text-white"
              >
                <span>View Projects</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleScrollTo('#contact')}
                className="px-8 py-3 glass rounded-lg font-semibold text-sm border border-white/10 hover:bg-white/5 transition-all duration-300 flex items-center gap-2 cursor-pointer text-slate-200"
              >
                <span>Get in Touch</span>
                <Mail className="w-4 h-4" />
              </button>
            </div>

            {/* Quick stats grid inside hero */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-900 max-w-lg">
              <div className="space-y-1">
                <span className="block text-2xl font-bold font-mono text-white">09+</span>
                <span className="text-[10px] text-slate-500 font-mono text-uppercase tracking-widest">Mastered Techs</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl font-bold font-mono text-white">02+</span>
                <span className="text-[10px] text-slate-500 font-mono text-uppercase tracking-widest">Active Solutions</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl font-bold font-mono text-white">ODA</span>
                <span className="text-[10px] text-slate-500 font-mono text-uppercase tracking-widest">Boarding Scholar</span>
              </div>
            </div>
          </div>

          {/* Floating avatar system */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative group">
              {/* Outer light aura */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-[10px] group-hover:opacity-40 transition-opacity duration-300" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-10 animate-pulse [animation-duration:4s]" />

              {/* Real profile avatar frame */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl neon-border glow-purple overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                <img
                  src={safeProfile.avatarUrl}
                  alt={safeProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-700"
                  onError={(e) => {
                    // Fallback to postimg fallback
                    e.currentTarget.src = "https://i.postimg.cc/Y0yKdbbg/IMG-20260517-213404-358.jpg";
                  }}
                />
              </div>

              {/* Floating tech nodes */}
              <div className="absolute -top-4 -right-4 h-11 w-11 rounded-lg bg-slate-950 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-xl shadow-purple-950/20 animate-bounce [animation-duration:5s]">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-4 -left-4 h-11 w-11 rounded-lg bg-slate-950 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xl shadow-blue-950/20 animate-bounce [animation-duration:4s]">
                <Terminal className="w-5 h-5" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative bg-slate-950/20 border-y border-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-mono font-bold block">
              &gt; Background Chronicle
            </span>
            <h2 className="text-3xl font-sans font-bold text-white tracking-tight">
              About Nahom Debebe
            </h2>
            <div className="h-[2px] w-12 bg-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            
            {/* Visual Frame */}
            <div className="md:col-span-5 flex flex-col justify-between p-6 rounded-2xl glass border border-white/10 shadow-2xl">
              <div className="space-y-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-white tracking-wide">
                  Academic & Engineering Creed
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed font-mono uppercase tracking-wider">
                  {safeProfile.education}
                </p>
              </div>

              <div className="pt-8 border-t border-white/10 mt-8">
                <span className="text-xs text-slate-500 block uppercase font-mono tracking-widest">
                  Status Code
                </span>
                <span className="text-xs text-blue-400 font-mono font-medium block mt-1">
                  SYS_ONLINE_EXCELLENT
                </span>
              </div>
            </div>

            {/* Content Frame */}
            <div className="md:col-span-7 p-8 rounded-2xl glass border border-white/10 flex flex-col justify-between shadow-2xl">
              <div className="space-y-6">
                <span className="text-xs font-mono text-purple-400">
                  $ cat profile_statement.log
                </span>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                  {safeProfile.bio}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-10 mt-8 border-t border-white/10">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block">Focus Field</span>
                  <span className="text-sm font-semibold text-slate-300 block mt-1">Fullstack Software</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block">Institution Location</span>
                  <span className="text-sm font-semibold text-slate-300 block mt-1">ODA Special Boarding</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-mono font-bold block">
              &gt; Technical Matrix
            </span>
            <h2 className="text-3xl font-sans font-bold text-white tracking-tight">
              Aptitude & Abilities
            </h2>
            <div className="h-[2px] w-12 bg-blue-500 mx-auto rounded-full" />
          </div>

          {/* Categories Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wide transition-all border cursor-pointer ${
                  activeCategory === cat 
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/40' 
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skills Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((sk, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  key={sk.id}
                  className="p-5 rounded-2xl glass border border-white/5 hover:border-blue-500/25 shadow-2xl transition-all duration-300 group overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-slate-500 select-none group-hover:text-slate-300 transition-colors">
                    {sk.category}
                  </div>

                  <h4 className="text-base font-bold text-white tracking-wide pr-14 group-hover:text-blue-400 transition-colors">
                    {sk.name}
                  </h4>

                  <div className="mt-8 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-500 group-hover:text-slate-400">Proficiency</span>
                      <span className="text-blue-400 font-bold font-mono text-xs">{sk.level}%</span>
                    </div>

                    {/* Progress indicators */}
                    <div className="relative h-1.5 w-full bg-white/5 overflow-hidden rounded-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${sk.level}%` }}
                        transition={{ duration: 0.8, delay: index * 0.05 }}
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Aesthetic card corner highlight */}
                  <div className="absolute top-0 left-0 w-2 h-0 group-hover:h-full bg-blue-500 transition-all duration-300" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 bg-slate-950/20 border-t border-slate-900/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-mono font-bold block">
              &gt; Dynamic Repositories
            </span>
            <h2 className="text-3xl font-sans font-bold text-white tracking-tight">
              Featured Showcase Projects
            </h2>
            <div className="h-[2px] w-12 bg-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj) => (
              <div 
                key={proj.id}
                className="group rounded-2xl overflow-hidden glass border border-white/5 hover:border-blue-500/30 transition-all duration-300 shadow-2xl"
              >
                {/* Project Screen Image */}
                <div className="relative h-48 sm:h-56 bg-black/40 overflow-hidden">
                  <img
                    src={proj.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop"}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 pointer-events-none" />
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-purple-400 transition-colors font-sans">
                      {proj.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>

                  {/* Tech Tags Wrap */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.tech.map((t, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-white/5 text-[10px] font-mono font-bold text-blue-400 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Link action list */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10 text-xs font-mono">
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                      >
                        <FolderGit2 className="w-4 h-4 text-purple-400" />
                        <span>Codebase</span>
                      </a>
                    )}
                    {proj.demo && (
                      <a
                        href={proj.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors ml-auto group/demo"
                      >
                        <span>Interactive Demo</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/demo:translate-x-0.5 group-hover/demo:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section id="awards" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-mono font-bold block">
              &gt; Accolades & Trophies
            </span>
            <h2 className="text-3xl font-sans font-bold text-white tracking-tight">
              Awards Showcase
            </h2>
            <div className="h-[2px] w-12 bg-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {awards.map((aw) => (
              <div 
                key={aw.id}
                className="group rounded-2xl border border-white/5 glass hover:border-purple-500/30 p-5 flex flex-col justify-between transition-all duration-300 shadow-2xl"
              >
                <div className="space-y-4">
                  
                  {/* Image container with expand trigger */}
                  {aw.imageUrl && (
                    <div className="relative rounded-lg overflow-hidden h-40 bg-black/40 border border-white/5">
                      <img
                        src={aw.imageUrl}
                        alt={aw.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setSelectedAwardImage(aw.imageUrl || null)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-300 cursor-pointer"
                      >
                        <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <Eye className="w-4 h-4" />
                        </div>
                      </button>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-blue-400/80 uppercase tracking-widest block font-bold">
                      {aw.eventName}
                    </span>
                    <h3 className="text-sm font-bold text-white tracking-wide leading-snug group-hover:text-blue-400 transition-colors">
                      {aw.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">
                    {aw.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <AwardIcon className="w-3 h-3 text-purple-400" />
                    Verified Certificate
                  </span>
                  <span className="text-slate-400">{aw.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Timeline Section */}
      <section id="achievements" className="py-24 px-6 bg-slate-950/20 border-y border-slate-900/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-mono font-bold block">
              &gt; Historic Milestones
            </span>
            <h2 className="text-3xl font-sans font-bold text-white tracking-tight">
              Achievements System
            </h2>
            <div className="h-[2px] w-12 bg-blue-500 mx-auto rounded-full" />
          </div>

          {/* Timeline Layout */}
          <div className="relative max-w-3xl mx-auto">
            
            {/* Vertical timeline trunk */}
            <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-[1px] bg-gradient-to-b from-blue-500 via-purple-500 to-transparent" />

            <div className="space-y-12">
              {achievements.map((item, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div 
                    key={item.id}
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                      isLeft ? 'sm:flex-row-reverse' : ''
                    }`}
                  >
                    
                    {/* Spine bullet node */}
                    <div className="absolute left-4 sm:left-1/2 h-4 w-4 rounded-full border border-purple-500 bg-slate-950 translate-x-[-7.5px] z-10 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    </div>

                    {/* Timeline card */}
                    <div className="w-full sm:w-[45%] pl-10 sm:pl-0">
                      <div className="p-5 rounded-2xl glass border border-white/5 hover:border-purple-500/30 shadow-2xl transition-all duration-300 relative">
                        {/* Glowing node edge */}
                        <div className="absolute top-4 left-0 h-4 w-[1px] bg-blue-500 sm:hidden" />
                        
                        <div className="space-y-3">
                          <span className="inline-block px-2.5 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono font-bold text-purple-400">
                            {item.date}
                          </span>
                          
                          <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                            {item.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans mt-1">
                            {item.description}
                          </p>

                          {item.imageUrl && (
                            <div className="rounded-lg overflow-hidden h-28 bg-black/40 border border-white/5 mt-2">
                              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden sm:block w-[10%]" />
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Contacts and Inquiry feedback */}
      <section id="contact" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-blue-400 font-mono font-bold block">
              &gt; Secure Channels
            </span>
            <h2 className="text-3xl font-sans font-bold text-white tracking-tight">
              Get in Touch
            </h2>
            <div className="h-[2px] w-12 bg-blue-500 mx-auto rounded-full" />
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Meta context cards */}
            <div className="md:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border border-white/5 glass shadow-2xl">
                <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono text-purple-400">
                  Secure Direct Email
                </h4>
                <a 
                  href={`mailto:${safeSocials.email}`}
                  className="text-xs font-mono text-slate-400 hover:text-white transition-colors break-all block mt-2"
                >
                  {safeSocials.email}
                </a>
              </div>

              <div className="p-5 rounded-2xl border border-white/5 glass space-y-4 shadow-2xl">
                <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono text-blue-400">
                  Cyber Connections index
                </h4>
                
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(safeSocials).map(([name, url]) => {
                    if (name === 'id') return null;
                    return (
                      <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        title={name}
                        className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/40 hover:bg-white/10 text-slate-400 hover:text-purple-400 flex items-center justify-center transition-all cursor-pointer"
                      >
                        {getSocialIcon(name)}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Input Inquiry Form */}
            <div className="md:col-span-7">
              <form onSubmit={handleContactSubmit} className="p-6 sm:p-8 rounded-2xl border border-white/5 glass space-y-4 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold font-mono text-slate-500 uppercase tracking-widest block">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="Identify your name..."
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-slate-200 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold font-mono text-slate-500 uppercase tracking-widest block">
                      Secure Email
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      placeholder="name@server.com"
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-slate-200 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold font-mono text-slate-500 uppercase tracking-widest block">
                    Telemetry / Message text
                  </label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    required
                    placeholder="Enter details of your dynamic proposal..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-slate-200 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting || !contactForm.name || !contactForm.email || !contactForm.message}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg glow-blue transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {formSubmitting ? (
                    <>
                      <div className="h-4.5 w-4.5 border-2 border-slate-100 border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Packet...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Visitor Analytics Panel */}
      <section className="py-12 glass border-t border-white/10 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left">
          
          <div className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/5">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-mono uppercase text-blue-400">
              <Users className="w-4 h-4" />
              <span>Visitor Analytics</span>
            </div>
            <p className="text-2xl font-bold font-mono text-white mt-1">
              {visitorCount}
            </p>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Global Platform Loads
            </span>
          </div>

          <div className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/5">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-mono uppercase text-purple-400">
              <Flame className="w-4 h-4 text-purple-400" />
              <span>Streak Index</span>
            </div>
            <p className="text-2xl font-bold font-mono text-white mt-1">
              Active Special
            </p>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              ODA Scholar Stream
            </span>
          </div>

          <div className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/5">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-mono uppercase text-emerald-400">
              <Activity className="w-4 h-4" />
              <span>Inquiries Registered</span>
            </div>
            <p className="text-2xl font-bold font-mono text-white mt-1">
              {messageCount} Messages
            </p>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Sync Inbox Records
            </span>
          </div>

          <div className="space-y-2 p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-mono uppercase text-indigo-400">
              <Clock className="w-4 h-4" />
              <span>Telemetry Timestamp</span>
            </div>
            <p className="text-xs font-mono text-slate-300 tracking-tight mt-1 truncate">
              {timeUTC}
            </p>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Coordinated Universal Time
            </span>
          </div>

        </div>
      </section>

      {/* Footer copyright */}
      <footer className="py-6 text-center text-[10px] font-mono uppercase tracking-widest text-slate-600 bg-[#020205] border-t border-white/10">
        © 2026 Nahom Debebe Portfolio • System Live Node
      </footer>

      {/* Scroll to Top floating Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-40 h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-slate-400 hover:text-white flex items-center justify-center transition-all shadow-xl shadow-black/40 cursor-pointer"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Lightbox certificate photo Modal */}
      <AnimatePresence>
        {selectedAwardImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAwardImage(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md cursor-pointer"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-slate-950 border border-slate-800"
            >
              <img 
                src={selectedAwardImage} 
                alt="Award view" 
                className="w-auto max-h-[80vh] object-contain rounded-t-xl" 
                referrerPolicy="no-referrer"
              />
              <div className="p-4 flex justify-between items-center text-xs font-mono uppercase tracking-wide bg-slate-900 border-t border-slate-800">
                <span className="text-slate-400">Award Certificate Lightbox</span>
                <button 
                  onClick={() => setSelectedAwardImage(null)}
                  className="px-3 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded text-slate-300 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
