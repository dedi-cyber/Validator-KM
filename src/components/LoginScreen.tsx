/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, User as UserIcon, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  darkMode: boolean;
}

export default function LoginScreen({ onLoginSuccess, darkMode }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Quick select accounts
  const quickAccounts = [
    {
      name: 'Dedi Hermawan, S.Pd.I',
      role: 'kepala_madrasah' as UserRole,
      roleLabel: 'Kepala Madrasah',
      username: 'kepala.man1',
      desc: 'MAN 1 Tanah Datar',
      email: 'dedi.gce@madrasah.id'
    },
    {
      name: 'Drs. H. Erman, M.Pd.',
      role: 'pengawas' as UserRole,
      roleLabel: 'Pengawas Madrasah',
      username: 'pengawas.erman',
      desc: 'Wilayah Binaan Sungayang',
      email: 'erman.pengawas@kemenag.go.id'
    },
    {
      name: 'H. Mas’ud, M.Ag.',
      role: 'admin_kemenag' as UserRole,
      roleLabel: 'Admin Kemenag Kab',
      username: 'admin.tanahdatar',
      desc: 'Seksi Pendidikan Madrasah',
      email: 'masud.kemenag@kemenag.go.id'
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Silakan masukkan nama pengguna dan kata sandi.');
      return;
    }

    // Try finding in quick accounts
    const match = quickAccounts.find(
      (a) => a.username.toLowerCase() === username.toLowerCase().trim()
    );

    if (match) {
      onLoginSuccess({
        id: match.username === 'kepala.man1' ? 'u-1' : match.username === 'pengawas.erman' ? 'u-2' : 'u-3',
        name: match.name,
        username: match.username,
        email: match.email,
        role: match.role,
        madrasahId: match.role === 'kepala_madrasah' ? 'm1' : undefined
      });
    } else {
      // Fallback default login
      if (username.startsWith('kepala')) {
        onLoginSuccess({
          id: 'u-custom-1',
          name: 'Kepala Madrasah',
          username,
          email: `${username}@madrasah.id`,
          role: 'kepala_madrasah',
          madrasahId: 'm2'
        });
      } else if (username.startsWith('pengawas')) {
        onLoginSuccess({
          id: 'u-custom-2',
          name: 'Pengawas Satuan Pendidikan',
          username,
          email: `${username}@kemenag.go.id`,
          role: 'pengawas'
        });
      } else {
        onLoginSuccess({
          id: 'u-custom-3',
          name: 'Admin Kemenag RI',
          username,
          email: `${username}@kemenag.go.id`,
          role: 'admin_kemenag'
        });
      }
    }
  };

  const handleQuickLogin = (acc: typeof quickAccounts[0]) => {
    setUsername(acc.username);
    setPassword('********');
    onLoginSuccess({
      id: acc.username === 'kepala.man1' ? 'u-1' : acc.username === 'pengawas.erman' ? 'u-2' : 'u-3',
      name: acc.name,
      username: acc.username,
      email: acc.email,
      role: acc.role,
      madrasahId: acc.role === 'kepala_madrasah' ? 'm1' : undefined
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50/50 text-zinc-950'
    }`}>
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 dark:opacity-2">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-600 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-500 blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border flex flex-col md:flex-row transition-all ${
          darkMode ? 'bg-zinc-900/80 border-zinc-800 shadow-emerald-950/20' : 'bg-white/95 border-emerald-100'
        }`}
      >
        {/* Left Side: Brand presentation (Kemenag Green style) */}
        <div className="md:w-1/2 bg-gradient-to-br from-emerald-800 to-teal-950 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Overlay pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/a/af/Kementerian_Agama_Logo.png" 
                alt="Logo Kemenag" 
                referrerPolicy="no-referrer"
                className="w-12 h-12 object-contain bg-white rounded-full p-1 shadow-md"
              />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold font-display">Kementerian Agama RI</p>
                <h2 className="text-sm font-semibold font-display tracking-tight text-white">Seksi Pendidikan Madrasah</h2>
              </div>
            </div>

            <div className="mt-12 md:mt-20">
              <span className="bg-emerald-700/80 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-600/50 inline-flex items-center gap-1.5 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Instrumen TA 2026/2027
              </span>
              <h1 className="text-3xl md:text-4xl font-bold font-display leading-tight text-white">
                Validasi <br/>
                <span className="text-amber-400">Kurikulum Madrasah</span>
              </h1>
              <p className="mt-4 text-emerald-100/90 text-sm leading-relaxed font-sans max-w-sm">
                Sistem Penjaminan Mutu Internal (SPMI) terpadu untuk validasi draf KOSP/KTSP Madrasah Ibtidaiyah, Tsanawiyah, Aliyah, dan Kejuruan secara real-time.
              </p>
            </div>
          </div>

          <div className="relative mt-8 md:mt-0 pt-6 border-t border-emerald-700/50 text-[11px] text-emerald-200 font-mono flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span>Standardisasi:</span>
              <span className="text-amber-400">Keputusan Dirjen Pendis Kemenag</span>
            </div>
            <div className="flex justify-between">
              <span>Sertifikasi Keamanan:</span>
              <span className="text-emerald-300 flex items-center gap-1">
                <Shield className="w-3 h-3" /> SSL Secured
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Log-in controls */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold font-display tracking-tight">Selamat Datang</h3>
            <p className={`text-xs mt-1 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Silakan login atau klik Akun Pintar di bawah ini untuk mencoba sistem
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-xs bg-rose-500/10 border border-rose-500/20 text-rose-500 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-zinc-500 dark:text-zinc-400">
                Nama Pengguna (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: kepala.man1 atau pengawas.erman"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    darkMode 
                      ? 'bg-zinc-800 border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white' 
                      : 'bg-zinc-50 border-zinc-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 text-zinc-950'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-zinc-500 dark:text-zinc-400">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    darkMode 
                      ? 'bg-zinc-800 border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white' 
                      : 'bg-zinc-50 border-zinc-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 text-zinc-950'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all group font-display text-sm cursor-pointer"
            >
              Masuk ke Aplikasi
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Login Section */}
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 block mb-3">
              Akses Instan (Akun Pintar)
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {quickAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.01] flex items-center justify-between group cursor-pointer ${
                    darkMode 
                      ? 'bg-zinc-800/40 border-zinc-800 hover:bg-zinc-800 hover:border-emerald-500/50' 
                      : 'bg-emerald-50/20 border-emerald-100/50 hover:bg-emerald-50/50 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 ${
                      darkMode ? 'bg-zinc-800' : 'bg-emerald-50'
                    }`}>
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {acc.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        {acc.roleLabel} • <span className="italic">{acc.desc}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-100/60 dark:bg-zinc-800 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Pilih
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
