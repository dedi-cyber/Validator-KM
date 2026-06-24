/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Building2, Layers, CheckCircle2, AlertTriangle, Clock, ArrowRight, Award, Plus } from 'lucide-react';
import { ValidationSession, User, MadrasahProfile } from '../types';
import { calculateSessionScore, PRESET_MADRASAH_PROFILES, generateEmptyGradings } from '../instrumentData';

interface MadrasahListProps {
  sessions: ValidationSession[];
  currentUser: User;
  onSelectSession: (session: ValidationSession) => void;
  onAddNewSession: (profile: MadrasahProfile) => void;
  darkMode: boolean;
}

export default function MadrasahList({
  sessions,
  currentUser,
  onSelectSession,
  onAddNewSession,
  darkMode
}: MadrasahListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Draft' | 'Diajukan' | 'Divalidasi' | 'Perbaikan'>('ALL');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'MI' | 'MTs' | 'MA' | 'MAK'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const isKepala = currentUser.role === 'kepala_madrasah';

  // Filter sessions
  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.profile.npsn.includes(searchTerm) ||
                          s.profile.nsm.includes(searchTerm) ||
                          s.profile.headmasterName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' ? true : s.status === statusFilter;
    const matchesLevel = levelFilter === 'ALL' ? true : s.profile.level === levelFilter;

    // If Kepala Madrasah, they should only see their own school(s)
    if (isKepala && currentUser.madrasahId) {
      return matchesSearch && matchesStatus && matchesLevel && s.madrasahId === currentUser.madrasahId;
    }

    return matchesSearch && matchesStatus && matchesLevel;
  });

  // For Kepala Madrasah, find if they have a school that doesn't have a draft yet
  const availablePresetProfiles = PRESET_MADRASAH_PROFILES.filter(p => {
    // If kepala, only let them add their assigned school
    if (isKepala) {
      return p.id === currentUser.madrasahId && !sessions.some(s => s.madrasahId === p.id);
    }
    // Else, let supervisor/admin add any school that doesn't have an active session
    return !sessions.some(s => s.madrasahId === p.id);
  });

  return (
    <div className="space-y-6">
      
      {/* Search and Filters header */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display tracking-tight">Daftar Madrasah Binaan</h2>
          <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Kelola dan evaluasi instrumen draf kurikulum madrasah yang diajukan.
          </p>
        </div>

        {availablePresetProfiles.length > 0 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2 px-4 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Mulai Pengisian Baru
          </button>
        )}
      </div>

      {/* Grid of filtering widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari nama, NSM, NPSN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs outline-none transition-all ${
              darkMode 
                ? 'bg-zinc-900 border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white' 
                : 'bg-white border-zinc-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 text-zinc-950'
            }`}
          />
        </div>

        {/* Level filter */}
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as any)}
          className={`w-full px-3 py-2 rounded-xl border text-xs outline-none transition-all ${
            darkMode 
              ? 'bg-zinc-900 border-zinc-800 focus:border-emerald-500 text-white' 
              : 'bg-white border-zinc-200 focus:border-emerald-600 text-zinc-950'
          }`}
        >
          <option value="ALL">Semua Jenjang (MI / MTs / MA / MAK)</option>
          <option value="MI">Madrasah Ibtidaiyah (MI)</option>
          <option value="MTs">Madrasah Tsanawiyah (MTs)</option>
          <option value="MA">Madrasah Aliyah (MA)</option>
          <option value="MAK">MA Kejuruan (MAK)</option>
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className={`w-full px-3 py-2 rounded-xl border text-xs outline-none transition-all ${
            darkMode 
              ? 'bg-zinc-900 border-zinc-800 focus:border-emerald-500 text-white' 
              : 'bg-white border-zinc-200 focus:border-emerald-600 text-zinc-950'
          }`}
        >
          <option value="ALL">Semua Status Validasi</option>
          <option value="Draft">Draft (Dalam Pengisian)</option>
          <option value="Diajukan">Diajukan (Menunggu Validasi)</option>
          <option value="Divalidasi">Divalidasi (Disetujui)</option>
          <option value="Perbaikan">Perbaikan (Butuh Revisi)</option>
        </select>
      </div>

      {/* Madrasahs Card Grid */}
      {filteredSessions.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border border-dashed ${
          darkMode ? 'bg-zinc-900/10 border-zinc-800' : 'bg-zinc-50/50 border-zinc-200'
        }`}>
          <Building2 className="w-10 h-10 mx-auto text-zinc-400 mb-2.5" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Tidak Ada Berkas Ditemukan</h3>
          <p className="text-xs text-zinc-500 mt-1">Silakan sesuaikan kriteria pencarian atau filter Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.map((session) => {
            const { score, adaCount, tidakCount } = calculateSessionScore(session.gradings);
            
            // Render Status Color scheme
            const statusTheme = {
              Draft: { bg: 'bg-zinc-100 dark:bg-zinc-800/80', text: 'text-zinc-600 dark:text-zinc-400', icon: <Clock className="w-3.5 h-3.5" /> },
              Diajukan: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: <Clock className="w-3.5 h-3.5 animate-pulse" /> },
              Divalidasi: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
              Perbaikan: { bg: 'bg-amber-500/10', text: 'text-amber-500', icon: <AlertTriangle className="w-3.5 h-3.5" /> }
            }[session.status];

            return (
              <div
                key={session.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between hover:shadow-md ${
                  darkMode 
                    ? 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700' 
                    : 'bg-white border-zinc-100 hover:border-emerald-200 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                        {session.profile.level}
                      </span>
                      <span className="text-[10px] font-semibold text-zinc-400">
                        {session.profile.status}
                      </span>
                    </div>

                    <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusTheme.bg} ${statusTheme.text}`}>
                      {statusTheme.icon}
                      {session.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm font-display tracking-tight mt-3 text-zinc-900 dark:text-white">
                    {session.profile.name}
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    NSM: {session.profile.nsm} &bull; NPSN: {session.profile.npsn}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="text-center bg-zinc-100 dark:bg-zinc-800 rounded-lg px-2.5 py-1 shrink-0">
                      <span className="text-xs font-bold font-mono block text-emerald-600 dark:text-emerald-400">{score}%</span>
                      <span className="text-[8px] uppercase font-bold text-zinc-400">Kelayakan</span>
                    </div>
                    <div className="text-xs space-y-0.5 text-zinc-600 dark:text-zinc-400">
                      <p>&bull; Ada: <strong>{adaCount} indikator</strong></p>
                      <p>&bull; Tidak: <strong>{tidakCount} indikator</strong></p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-zinc-400">
                    Sirkulasi: {new Date(session.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>

                  <button
                    onClick={() => onSelectSession(session)}
                    className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-bold text-xs cursor-pointer"
                  >
                    {currentUser.role === 'pengawas' ? 'Validasi Sekarang' : 'Buka Lembar Validasi'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Session Modal (Simulating starting validation for a preset profile) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border ${
            darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-emerald-100 text-zinc-950'
          }`}>
            <h3 className="text-lg font-bold font-display">Mulai Pengisian Instrumen Baru</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              Silakan pilih salah satu madrasah binaan di bawah ini yang akan draf kurikulumnya mulai diunggah/diisi instrumennya:
            </p>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {availablePresetProfiles.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => {
                    onAddNewSession(p);
                    setShowAddModal(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all hover:border-emerald-600 hover:scale-[1.01] ${
                    darkMode ? 'bg-zinc-800/50 border-zinc-800' : 'bg-emerald-50/15 border-emerald-100/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded font-mono uppercase">
                      {p.level}
                    </span>
                    <span className="text-[10px] text-zinc-500">{p.status}</span>
                  </div>
                  <h4 className="font-bold text-xs mt-2 text-zinc-900 dark:text-white">{p.name}</h4>
                  <p className="text-[10px] text-zinc-400">Kepala: {p.headmasterName}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3.5">
              <button
                onClick={() => setShowAddModal(false)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                  darkMode ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700' : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
