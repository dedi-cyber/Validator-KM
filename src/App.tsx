/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Building2, ClipboardCheck, LogOut, Sun, Moon, 
  Menu, X, Bell, Mail, BookOpen, ShieldCheck, Sparkles, User as UserIcon
} from 'lucide-react';
import { User, ValidationSession, ActivityLog, NotificationLog, MadrasahProfile } from './types';
import { INITIAL_SESSIONS, generateEmptyGradings, ALL_ITEMS_COUNT } from './instrumentData';
import LoginScreen from './components/LoginScreen';
import DashboardOverview from './components/DashboardOverview';
import ValidationSheet from './components/ValidationSheet';
import MadrasahList from './components/MadrasahList';

export default function App() {
  // Theme Management (Supports Dark Mode)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sivakum_dark_mode');
    return saved === 'true';
  });

  // User Authentication & Roles
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sivakum_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Active view states: 'dashboard' | 'madrasahs' | 'sheet'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'madrasahs' | 'sheet'>('dashboard');

  // Sessions database (persisted to localStorage)
  const [sessions, setSessions] = useState<ValidationSession[]>([]);

  // Selected session for detailed grading / check
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Simulated activity logs & Outgoing notification email database
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);

  // Mobile Drawer Toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync dark mode class on HTML root element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sivakum_dark_mode', String(darkMode));
  }, [darkMode]);

  // Load Initial Database from LocalStorage or seed defaults
  useEffect(() => {
    const savedSessions = localStorage.getItem('sivakum_sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    } else {
      setSessions(INITIAL_SESSIONS);
      localStorage.setItem('sivakum_sessions', JSON.stringify(INITIAL_SESSIONS));
    }

    // Seed logs
    const savedLogs = localStorage.getItem('sivakum_activity_logs');
    if (savedLogs) {
      setActivityLogs(JSON.parse(savedLogs));
    } else {
      const defaultLogs: ActivityLog[] = [
        {
          id: 'log-1',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hrs ago
          username: 'Dedi Hermawan, S.Pd.I',
          role: 'kepala_madrasah',
          madrasahName: 'MAN 1 Tanah Datar',
          action: 'Membuat Draf',
          details: 'Melakukan unggahan awal kelengkapan kurikulum madrasah.'
        },
        {
          id: 'log-2',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hr ago
          username: 'Drs. H. Erman, M.Pd.',
          role: 'pengawas',
          madrasahName: 'MTsS Thawalib Sungayang',
          action: 'Melakukan Validasi',
          details: 'Memberikan penilaian berkas draf dan menetapkan status layak (Divalidasi).'
        }
      ];
      setActivityLogs(defaultLogs);
      localStorage.setItem('sivakum_activity_logs', JSON.stringify(defaultLogs));
    }

    // Seed email notifications logs
    const savedNotifs = localStorage.getItem('sivakum_notification_logs');
    if (savedNotifs) {
      setNotificationLogs(JSON.parse(savedNotifs));
    } else {
      const defaultNotifs: NotificationLog[] = [
        {
          id: 'n-1',
          timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
          sender: 'sistem.valkur@kemenag.go.id',
          recipientEmail: 'erman.pengawas@kemenag.go.id',
          subject: 'PEMBERITAHUAN: Dokumen Kurikulum MAN 1 Tanah Datar Diajukan',
          body: 'Yth. Pengawas Drs. H. Erman, M.Pd., Kepala Madrasah MAN 1 Tanah Datar telah mengajukan draf KOSP TA 2026/2027 untuk divalidasi. Mohon periksa lampiran instrumen di SIVAKUM.',
          status: 'Terkirim'
        }
      ];
      setNotificationLogs(defaultNotifs);
      localStorage.setItem('sivakum_notification_logs', JSON.stringify(defaultNotifs));
    }
  }, []);

  // Save changes to localStorage on database update
  const saveSessionsDatabase = (updatedSessions: ValidationSession[]) => {
    setSessions(updatedSessions);
    localStorage.setItem('sivakum_sessions', JSON.stringify(updatedSessions));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('sivakum_user', JSON.stringify(user));
    setIsMobileMenuOpen(false);
    
    // Redirect appropriately
    if (user.role === 'kepala_madrasah') {
      setActiveTab('madrasahs');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sivakum_user');
    setSelectedSessionId(null);
    setActiveTab('dashboard');
    setIsMobileMenuOpen(false);
  };

  // Add a new session draft for a school
  const handleAddNewSession = (profile: MadrasahProfile) => {
    const newSession: ValidationSession = {
      id: `sess-${Date.now()}`,
      madrasahId: profile.id,
      profile: profile,
      academicYear: profile.academicYear || '2026/2027',
      status: 'Draft',
      score: 0,
      updatedAt: new Date().toISOString(),
      gradings: generateEmptyGradings()
    };

    const updated = [newSession, ...sessions];
    saveSessionsDatabase(updated);

    // Activity log entry
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      username: currentUser?.name || 'Sistem',
      role: currentUser?.role || 'kepala_madrasah',
      madrasahName: profile.name,
      action: 'Membuat Berkas Baru',
      details: 'Memulai pengisian draf instrumen kurikulum baru'
    };
    const updatedLogs = [newLog, ...activityLogs];
    setActivityLogs(updatedLogs);
    localStorage.setItem('sivakum_activity_logs', JSON.stringify(updatedLogs));

    // Redirect to sheet automatically to start filling
    setSelectedSessionId(newSession.id);
    setActiveTab('sheet');
  };

  // Update validation items status / feedback
  const handleSaveSession = (
    updatedSession: ValidationSession, 
    triggerEmailNotification: boolean,
    actionLabel: string,
    details: string
  ) => {
    const oldSession = sessions.find(s => s.id === updatedSession.id);
    const oldStatus = oldSession ? oldSession.status : '';

    // 1. Update in database
    const updatedSessions = sessions.map(s => s.id === updatedSession.id ? updatedSession : s);
    saveSessionsDatabase(updatedSessions);

    // 2. Add activity log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      username: currentUser?.name || 'Sistem',
      role: currentUser?.role || 'kepala_madrasah',
      madrasahName: updatedSession.profile.name,
      action: actionLabel,
      details: details
    };
    const updatedLogs = [newLog, ...activityLogs];
    setActivityLogs(updatedLogs);
    localStorage.setItem('sivakum_activity_logs', JSON.stringify(updatedLogs));

    // 3. Dispatch automated email notification (Simulated)
    if (triggerEmailNotification && currentUser) {
      let recipientEmail = 'pengawas.erman@kemenag.go.id'; // default fallback
      let subject = `PEMBERITAHUAN SIVAKUM: Perubahan Berkas ${updatedSession.profile.name}`;
      let body = '';

      if (updatedSession.status === 'Diajukan') {
        recipientEmail = 'erman.pengawas@kemenag.go.id';
        subject = `PEMBERITAHUAN: Dokumen Kurikulum ${updatedSession.profile.name} Diajukan`;
        body = `Yth. Pengawas Drs. H. Erman, M.Pd., Kepala Madrasah ${updatedSession.profile.name} telah mengajukan draf kurikulum untuk divalidasi. Mohon tinjau kesesuaian 51 indikator instrumen pada dashboard SIVAKUM Anda. Terima kasih.`;
      } else if (updatedSession.status === 'Divalidasi') {
        recipientEmail = updatedSession.profile.id === 'm1' ? 'dedi.gce@madrasah.id' : 'kepala.madrasah@madrasah.id';
        subject = `PENGESAHAN: Dokumen Kurikulum ${updatedSession.profile.name} divalidasi (LAYAK)`;
        body = `Selamat! Berkas draf kurikulum madrasah Anda (${updatedSession.profile.name}) telah diperiksa secara seksama oleh Pengawas Pembina (${currentUser.name}) dan dinyatakan LAYAK/VALID dengan skor ${updatedSession.score}%. Dokumen rekomendasi sah dapat diunduh di dashboard.`;
      } else if (updatedSession.status === 'Perbaikan') {
        recipientEmail = updatedSession.profile.id === 'm1' ? 'dedi.gce@madrasah.id' : 'kepala.madrasah@madrasah.id';
        subject = `ATENSI REVISI: Dokumen Kurikulum ${updatedSession.profile.name} butuh perbaikan`;
        body = `Yth. Kepala Madrasah ${updatedSession.profile.name}, berkas draf kurikulum Anda telah ditinjau dengan hasil: PERLU REVISI (Skor kelayakan saat ini: ${updatedSession.score}%). Catatan dari pengawas: "${updatedSession.notes}". Silakan lakukan perbaikan di aplikasi.`;
      }

      const newNotif: NotificationLog = {
        id: `n-${Date.now()}`,
        timestamp: new Date().toISOString(),
        sender: 'no-reply.valkur@kemenag.go.id',
        recipientEmail,
        subject,
        body,
        status: 'Terkirim'
      };
      
      const updatedNotifs = [newNotif, ...notificationLogs];
      setNotificationLogs(updatedNotifs);
      localStorage.setItem('sivakum_notification_logs', JSON.stringify(updatedNotifs));
    }

    // Go back to list/dashboard on critical status movements (Diajukan/Divalidasi/Perbaikan)
    if (updatedSession.status !== oldStatus) {
      if (currentUser?.role === 'kepala_madrasah') {
        setActiveTab('madrasahs');
      } else {
        setActiveTab('dashboard');
      }
      setSelectedSessionId(null);
    }
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${
      darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50/50 text-zinc-950'
    }`}>
      
      {/* If user is not logged in, show Login Screen */}
      {!currentUser ? (
        <LoginScreen 
          onLoginSuccess={handleLogin} 
          darkMode={darkMode} 
        />
      ) : (
        /* Authenticated Application Layout */
        <div className="flex flex-col min-h-screen">
          
          {/* TOP BAR / NAVIGATION HEADER (Kemenag branding) */}
          <header className={`sticky top-0 z-40 border-b transition-colors shadow-sm ${
            darkMode 
              ? 'bg-zinc-900/90 border-zinc-800/80 backdrop-blur-md' 
              : 'bg-[#064E3B] text-white border-[#065F46]'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                
                {/* Logo & Branding */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/a/af/Kementerian_Agama_Logo.png" 
                    alt="Emblem Kemenag" 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-contain bg-white rounded-full p-0.5 shadow-md shrink-0"
                  />
                  <div>
                    <h1 className="text-sm font-extrabold font-display tracking-tight flex items-center gap-1">
                      SIVAKUM <span className="text-[10px] font-bold bg-amber-400 text-emerald-950 px-1.5 py-0.5 rounded-full">KEMENAG</span>
                    </h1>
                    <p className={`text-[9px] font-medium tracking-wider uppercase ${darkMode ? 'text-zinc-400' : 'text-emerald-100/80'}`}>
                      Validasi Kurikulum Madrasah
                    </p>
                  </div>
                </div>

                {/* Desktop Tabs */}
                <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
                  
                  {currentUser.role !== 'kepala_madrasah' && (
                    <button
                      onClick={() => { setActiveTab('dashboard'); setSelectedSessionId(null); }}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                        activeTab === 'dashboard'
                          ? darkMode ? 'bg-emerald-600 text-white shadow-sm' : 'bg-[#059669] text-white shadow-sm'
                          : darkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-emerald-100 hover:bg-[#065F46]'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 opacity-80" />
                      Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => { setActiveTab('madrasahs'); setSelectedSessionId(null); }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                      activeTab === 'madrasahs' || activeTab === 'sheet'
                        ? darkMode ? 'bg-emerald-600 text-white shadow-sm' : 'bg-[#059669] text-white shadow-sm'
                        : darkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-emerald-100 hover:bg-[#065F46]'
                    }`}
                  >
                    <Building2 className="w-4 h-4 opacity-80" />
                    {currentUser.role === 'kepala_madrasah' ? 'Dokumen Madrasah Anda' : 'Daftar Madrasah'}
                  </button>

                </nav>

                {/* Right controls (User badge, Dark Mode Toggle, Mobile menu trigger) */}
                <div className="flex items-center gap-3">
                  
                  {/* Theme toggler */}
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      darkMode 
                        ? 'border-zinc-800 bg-zinc-800 text-amber-400 hover:bg-zinc-700' 
                        : 'border-[#065F46] bg-[#065F46] text-emerald-100 hover:bg-[#059669]'
                    }`}
                    title="Ganti Mode Tampilan"
                  >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>

                  {/* Active user status badge */}
                  <div className={`hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-left ${
                    darkMode ? 'bg-zinc-800/50 border-zinc-800' : 'bg-[#065F46]/50 border-[#065F46]'
                  }`}>
                    <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-tight text-zinc-100 leading-tight truncate max-w-[120px]">
                        {currentUser.name}
                      </p>
                      <p className={`text-[8px] uppercase tracking-wider font-semibold ${darkMode ? 'text-zinc-400' : 'text-emerald-200'}`}>
                        {currentUser.role === 'kepala_madrasah' ? 'Kepala Madrasah' : currentUser.role === 'pengawas' ? 'Pengawas Madrasah' : 'Admin Kemenag'}
                      </p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className={`hidden sm:flex items-center gap-1.5 p-2 rounded-xl text-xs font-semibold cursor-pointer border transition-colors ${
                      darkMode 
                        ? 'border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800' 
                        : 'border-[#065F46] text-emerald-100 hover:bg-[#065F46] hover:text-white'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                  </button>

                  {/* Mobile Menu trigger */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-xl border border-transparent hover:bg-[#065F46] text-white shrink-0 cursor-pointer"
                  >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>

                </div>

              </div>
            </div>

            {/* Mobile Drawer Navigation Panel */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`md:hidden border-t px-4 py-3 space-y-2 ${
                    darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-[#064E3B] border-[#065F46] text-white'
                  }`}
                >
                  {/* User credentials banner on mobile */}
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-black/10 border border-white/10 mb-2">
                    <UserIcon className="w-5 h-5 text-amber-300" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{currentUser.name}</h4>
                      <p className="text-[10px] text-emerald-200 uppercase tracking-wider">
                        {currentUser.role === 'kepala_madrasah' ? 'Kepala Madrasah' : 'Pengawas Satuan'}
                      </p>
                    </div>
                  </div>

                  {currentUser.role !== 'kepala_madrasah' && (
                    <button
                      onClick={() => { setActiveTab('dashboard'); setSelectedSessionId(null); setIsMobileMenuOpen(false); }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#059669]"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard Utama
                    </button>
                  )}

                  <button
                    onClick={() => { setActiveTab('madrasahs'); setSelectedSessionId(null); setIsMobileMenuOpen(false); }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#059669]"
                  >
                    <Building2 className="w-4 h-4" />
                    {currentUser.role === 'kepala_madrasah' ? 'Dokumen Madrasah Anda' : 'Daftar Madrasah'}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-500/10 mt-4"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar Sesi
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* MAIN CONTAINER CONTENT BODY */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + (selectedSessionId || '')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="focus:outline-none"
              >
                {activeTab === 'dashboard' && currentUser.role !== 'kepala_madrasah' && (
                  <DashboardOverview
                    sessions={sessions}
                    activityLogs={activityLogs}
                    notificationLogs={notificationLogs}
                    currentUser={currentUser}
                    onSelectSession={(s) => { setSelectedSessionId(s.id); setActiveTab('sheet'); }}
                    darkMode={darkMode}
                  />
                )}

                {(activeTab === 'madrasahs' || (activeTab === 'dashboard' && currentUser.role === 'kepala_madrasah')) && (
                  <MadrasahList
                    sessions={sessions}
                    currentUser={currentUser}
                    onSelectSession={(s) => { setSelectedSessionId(s.id); setActiveTab('sheet'); }}
                    onAddNewSession={handleAddNewSession}
                    darkMode={darkMode}
                  />
                )}

                {activeTab === 'sheet' && selectedSession && (
                  <ValidationSheet
                    session={selectedSession}
                    currentUser={currentUser}
                    onSaveSession={handleSaveSession}
                    onBack={() => {
                      if (currentUser.role === 'kepala_madrasah') {
                        setActiveTab('madrasahs');
                      } else {
                        setActiveTab('dashboard');
                      }
                      setSelectedSessionId(null);
                    }}
                    darkMode={darkMode}
                  />
                )}
              </motion.div>
            </AnimatePresence>

          </main>

          {/* FOOTER */}
          <footer className={`mt-auto py-5 border-t text-center text-xs font-medium ${
            darkMode 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-500' 
              : 'bg-zinc-100 text-zinc-500 border-zinc-200'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>
                &copy; 2026 Kementerian Agama Republik Indonesia &bull; Penjaminan Mutu Kurikulum Madrasah.
              </p>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <span>Versi 2.4.0 (Aktif)</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Standardisasi KOSP Pendis</span>
              </div>
            </div>
          </footer>

        </div>
      )}

    </div>
  );
}
