-- supabase.sql
-- Bootstrap file for Nahom Debebe's Portfolio tables on Supabase
-- Run these queries inside your Supabase project SQL Editor

-- 1. Create Profile Table
CREATE TABLE IF NOT EXISTS profile (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL,
  bio TEXT NOT NULL,
  "avatarUrl" TEXT NOT NULL,
  "titleText" TEXT NOT NULL,
  education TEXT NOT NULL
);

-- Seed Initial Profile
INSERT INTO profile (id, name, bio, "avatarUrl", "titleText", education)
VALUES (
  'default',
  'Nahom Debebe',
  'I am Nahom Debebe, a passionate student developer focused on modern web development, artificial intelligence, cybersecurity awareness, and digital innovation. I enjoy building creative systems that solve real-world problems and improve user experiences. My goal is to become a highly skilled software engineer and technology innovator.',
  'https://i.postimg.cc/Y0yKdbbg/IMG-20260517-213404-358.jpg',
  'Student Developer | Web Developer | AI Enthusiast | Future Software Engineer | Creative Digital Builder',
  'Student at ODA SPECIAL BOARDING SCHOOL'
) ON CONFLICT (id) DO NOTHING;


-- 2. Create Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  category TEXT NOT NULL
);

-- Seed Initial Skills
INSERT INTO skills (id, name, level, category) VALUES
('1', 'React', 90, 'Frontend'),
('2', 'Firebase', 85, 'Backend'),
('3', 'Artificial Intelligence', 80, 'AI & Data'),
('4', 'Video Editing', 85, 'Design & Media'),
('5', 'Cybersecurity', 75, 'Security'),
('6', 'Tailwind CSS', 95, 'Frontend'),
('7', 'Web Development', 90, 'General'),
('8', 'UI/UX Design', 80, 'Design & Media'),
('9', 'Automation', 75, 'AI & Data')
ON CONFLICT (id) DO NOTHING;


-- 3. Create Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  "imageUrl" TEXT
);

-- Seed Initial Achievements
INSERT INTO achievements (id, title, description, date, "imageUrl") VALUES
('1', 'Cybersecurity Awareness Lead', 'Conducted interactive cybersecurity training and workshops targeting online threat prevention and digital hygiene for peers at ODA Special Boarding School.', 'March 2026', ''),
('2', 'AI Automation Hackathon Runner-up', 'Conceptualized and developed an AI chatbot helper designed to assist incoming students with peer learnings and class syllabus guidelines.', 'January 2026', '')
ON CONFLICT (id) DO NOTHING;


-- 4. Create Awards Table
CREATE TABLE IF NOT EXISTS awards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "eventName" TEXT NOT NULL,
  date TEXT NOT NULL,
  "imageUrl" TEXT
);

-- Seed Initial Awards
INSERT INTO awards (id, title, description, "eventName", date, "imageUrl") VALUES
('1', 'Outstanding Innovator Award', 'Recognized for building innovative digital solutions to real-world educational challenges.', 'ODA Special Science Exhibition', '2025-11-12', 'https://i.postimg.cc/gjV6vGmn/5818839401230961874-121.jpg')
ON CONFLICT (id) DO NOTHING;


-- 5. Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech TEXT[] NOT NULL,
  "imageUrl" TEXT,
  github TEXT,
  demo TEXT
);

-- Seed Initial Projects
INSERT INTO projects (id, title, description, tech, "imageUrl", github, demo) VALUES
('1', 'Futuristic Learning Hub', 'A complete custom learning web system built to augment student peer review, optimized with custom study planning algorithms and peer metrics tracker.', ARRAY['React', 'Tailwind CSS', 'Firebase'], 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop', 'https://github.com', 'https://example.com'),
('2', 'Secure Guard Simulation', 'An interactive simulator built to educate students about modern cryptography and strong hashing logic to enhance local cyber-hygiene.', ARRAY['React', 'Tailwind CSS', 'Framer Motion'], 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop', 'https://github.com', 'https://example.com')
ON CONFLICT (id) DO NOTHING;


-- 6. Create Socials Table
CREATE TABLE IF NOT EXISTS socials (
  id TEXT PRIMARY KEY DEFAULT 'default',
  github TEXT NOT NULL,
  telegram TEXT NOT NULL,
  linkedin TEXT NOT NULL,
  instagram TEXT NOT NULL,
  facebook TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL
);

-- Seed Initial Socials
INSERT INTO socials (id, github, telegram, linkedin, instagram, facebook, whatsapp, email)
VALUES (
  'default',
  'https://github.com',
  'https://t.me',
  'https://linkedin.com',
  'https://instagram.com',
  'https://facebook.com',
  'https://wa.me',
  'nahomdebebe971@gmail.com'
) ON CONFLICT (id) DO NOTHING;


-- 7. Create Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  "createdAt" TEXT NOT NULL
);


-- 8. Create Metrics Table
CREATE TABLE IF NOT EXISTS metrics (
  id TEXT PRIMARY KEY DEFAULT 'visitors',
  count INTEGER DEFAULT 1
);

-- Seed Visitor Initial Value
INSERT INTO metrics (id, count) VALUES ('visitors', 1) ON CONFLICT (id) DO NOTHING;

-- ENABLE ALL ROW LEVEL SECURITY (RLS) POLICIES FOR PUBLIC AND READ-ONLY / ADMIN-WRITE ACCESS
-- By default since the portfolio needs to read public data, let's allow select for everyone,
-- and all operations for authenticated users (or anonymous sessions with direct key depending on RLS).
-- Or we can disable RLS for a simplified public API portfolio context since we are using supabase.
-- To allow direct REST calls from the client:
-- (Uncomment and run these if you want to enforce lock down, otherwise leave default or enable public access)

-- ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE socials ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow public read-only access" ON profile FOR SELECT TO anon USING (true);
-- CREATE POLICY "Allow public read-only access" ON skills FOR SELECT TO anon USING (true);
-- CREATE POLICY "Allow public read-only access" ON achievements FOR SELECT TO anon USING (true);
-- CREATE POLICY "Allow public read-only access" ON awards FOR SELECT TO anon USING (true);
-- CREATE POLICY "Allow public read-only access" ON projects FOR SELECT TO anon USING (true);
-- CREATE POLICY "Allow public read-only access" ON socials FOR SELECT TO anon USING (true);
-- CREATE POLICY "Allow public read-write access for messages" ON contacts FOR ALL TO anon USING (true);
-- CREATE POLICY "Allow public updates on metrics" ON metrics FOR ALL TO anon USING (true);
-- CREATE POLICY "Allow public write-only access for admins/all" ON profile FOR ALL TO anon USING (true);
-- CREATE POLICY "Allow public write-only access for admins/all" ON skills FOR ALL TO anon USING (true);
-- CREATE POLICY "Allow public write-only access for admins/all" ON achievements FOR ALL TO anon USING (true);
-- CREATE POLICY "Allow public write-only access for admins/all" ON awards FOR ALL TO anon USING (true);
-- CREATE POLICY "Allow public write-only access for admins/all" ON projects FOR ALL TO anon USING (true);
-- CREATE POLICY "Allow public write-only access for admins/all" ON socials FOR ALL TO anon USING (true);
