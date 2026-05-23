/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import ParticlesBackground from './components/ParticlesBackground';
import PortfolioHome from './pages/PortfolioHome';
import AdminPasswordModal from './components/AdminPasswordModal';
import AdminDashboard from './admin/AdminDashboard';
import ToastContainer from './components/ToastContainer';

function MainAppContent() {
  const { isAdmin } = useApp();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [showAdminConsole, setShowAdminConsole] = useState(false);

  return (
    <div className="relative min-h-screen text-slate-100 select-none">
      {/* Dynamic Cyber starfield backdrop */}
      <ParticlesBackground />

      {/* Primary header navbar */}
      <Navbar 
        onAdminClick={() => setPasswordModalOpen(true)}
        onAdminToggle={() => setShowAdminConsole(!showAdminConsole)}
      />

      {/* Screen Routing selector */}
      {isAdmin && showAdminConsole ? (
        <AdminDashboard onClose={() => setShowAdminConsole(false)} />
      ) : (
        <PortfolioHome />
      )}

      {/* Security authenticate modal prompt */}
      <AdminPasswordModal 
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSuccess={() => setShowAdminConsole(true)}
      />

      {/* Micro sliding Toasts alerts list overlay */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

