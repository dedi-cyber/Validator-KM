/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, ArrowLeft, Save, Send, CheckCircle, AlertTriangle, Download, 
  Search, Check, X, MessageSquare, ChevronDown, ChevronUp, Lock, HelpCircle 
} from 'lucide-react';
import { ValidationSession, User, ValidationCategory, ItemStatus } from '../types';
import { OFFICIAL_INSTRUMENT, calculateSessionScore } from '../instrumentData';
import { exportSessionToPDF } from '../utils/pdfGenerator';

interface ValidationSheetProps {
  session: ValidationSession;
  currentUser: User;
  onSaveSession: (updatedSession: ValidationSession, triggerEmailNotification: boolean, actionLabel: string, details: string) => void;
  onBack: () => void;
  darkMode: boolean;
}

export default function ValidationSheet({
  session,
  currentUser,
  onSaveSession,
  onBack,
  darkMode
}: ValidationSheetProps) {
  const [gradings, setGradings] = useState<Record<string, { status: ItemStatus; notes: string }>>(
    JSON.parse(JSON.stringify(session.gradings)) // Deep copy
  );
  
  const [overallNotes, setOverallNotes] = useState(session.notes || '');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'SAMPUL': true,
    'PENETAPAN': true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ADA' | 'TDK' | 'EMPTY'>('ALL');

  // Role permissions
  const isKepala = currentUser.role === 'kepala_madrasah';
  const isPengawas = currentUser.role === 'pengawas';
  const isAdmin = currentUser.role === 'admin_kemenag';

  // Determine if editing is allowed
  // Kepala Madrasah can only edit if status is 'Draft' or 'Perbaikan'
  // Pengawas can edit if status is 'Diajukan', 'Draft', or 'Perbaikan'
  const canEdit = isPengawas || (isKepala && (session.status === 'Draft' || session.status === 'Perbaikan'));

  // Calculate current score metrics on the fly based on state
  const { score, adaCount, tidakCount, emptyCount, totalItems } = calculateSessionScore(gradings);

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const expandAll = () => {
    const expanded: Record<string, boolean> = {};
    OFFICIAL_INSTRUMENT.forEach(c => {
      expanded[c.id] = true;
    });
    setExpandedCategories(expanded);
  };

  const collapseAll = () => {
    setExpandedCategories({});
  };

  const handleStatusChange = (itemId: string, status: ItemStatus) => {
    if (!canEdit) return;
    setGradings(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        status: prev[itemId].status === status ? null : status // Toggle off if clicked same
      }
    }));
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    if (!canEdit) return;
    setGradings(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        notes
      }
    }));
  };

  // Actions
  const handleSaveDraft = () => {
    const updated: ValidationSession = {
      ...session,
      gradings,
      notes: overallNotes,
      score,
      updatedAt: new Date().toISOString()
    };
    onSaveSession(
      updated, 
      false, 
      'Menyimpan Draft', 
      `Menyimpan kemajuan evaluasi (${score}% keterisian)`
    );
  };

  const handleSubmitToSupervisor = () => {
    const updated: ValidationSession = {
      ...session,
      status: 'Diajukan',
      gradings,
      notes: overallNotes,
      score,
      updatedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString()
    };
    
    onSaveSession(
      updated, 
      true, // triggers simulated email to supervisor
      'Mengajukan Validasi', 
      `Mengajukan dokumen KOSP/KTSP untuk divalidasi oleh pengawas`
    );
  };

  const handleApproveValidation = () => {
    const updated: ValidationSession = {
      ...session,
      status: 'Divalidasi',
      gradings,
      notes: overallNotes,
      score,
      updatedAt: new Date().toISOString(),
      validatedAt: new Date().toISOString(),
      pengawasId: currentUser.id,
      pengawasName: currentUser.name,
      pengawasNip: currentUser.nip || '196803151994031005' // default fallback
    };
    
    onSaveSession(
      updated, 
      true, // triggers simulated email to kepala madrasah
      'Menyetujui & Memvalidasi', 
      `Menyetujui dokumen kurikulum dengan predikat layak (Skor: ${score}%)`
    );
  };

  const handleRejectWithRevision = () => {
    if (!overallNotes.trim()) {
      alert('Silakan masukkan Catatan Pengawas / Rekomendasi di bagian bawah sebelum mengembalikan dokumen untuk perbaikan.');
      return;
    }

    const updated: ValidationSession = {
      ...session,
      status: 'Perbaikan',
      gradings,
      notes: overallNotes,
      score,
      updatedAt: new Date().toISOString(),
      pengawasId: currentUser.id,
      pengawasName: currentUser.name,
      pengawasNip: currentUser.nip || '196803151994031005'
    };
    
    onSaveSession(
      updated, 
      true, // triggers simulated email to kepala madrasah
      'Mengembalikan untuk Perbaikan', 
      `Mengembalikan berkas kurikulum dengan catatan revisi: "${overallNotes.slice(0, 40)}..."`
    );
  };

  const handleDownloadPDF = () => {
    // Generate PDF using session details
    const targetSessionForPDF: ValidationSession = {
      ...session,
      gradings,
      notes: overallNotes,
      score,
      pengawasName: session.pengawasName || currentUser.role === 'pengawas' ? currentUser.name : 'Drs. H. Erman, M.Pd.',
      pengawasNip: session.pengawasNip || currentUser.role === 'pengawas' ? currentUser.nip : '196803151994031005'
    };
    exportSessionToPDF(targetSessionForPDF);
  };

  return (
    <div className="space-y-6">
      
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              darkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {session.profile.level} {session.profile.status}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                session.status === 'Divalidasi' 
                  ? 'bg-emerald-500/10 text-emerald-600' 
                  : session.status === 'Diajukan' 
                  ? 'bg-blue-500/10 text-blue-500' 
                  : session.status === 'Perbaikan' 
                  ? 'bg-amber-500/10 text-amber-500' 
                  : 'bg-zinc-400/10 text-zinc-500'
              }`}>
                {session.status}
              </span>
            </div>
            <h2 className="text-xl font-bold font-display tracking-tight mt-1">{session.profile.name}</h2>
            <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              NSM: {session.profile.nsm} &bull; NPSN: {session.profile.npsn}
            </p>
          </div>
        </div>

        {/* PDF Export at top right */}
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-zinc-950 dark:text-white font-medium text-xs py-2 px-3.5 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Unduh Hasil PDF
        </button>
      </div>

      {/* Progress Card */}
      <div className={`p-5 rounded-2xl border ${
        darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-emerald-50 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Progres Keterpenuhan Instrumen</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-display text-emerald-600 dark:text-emerald-400">{score}%</span>
              <span className="text-xs text-zinc-400">({adaCount} Ada, {tidakCount} Tidak, {emptyCount} Belum Diisi)</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(adaCount / totalItems) * 100}%` }}></div>
              <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${(tidakCount / totalItems) * 100}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1.5 font-medium">
              <span>Layak: {score}%</span>
              <span>Total Indikator: {totalItems}</span>
            </div>
          </div>
        </div>

        {!canEdit && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2.5">
            <Lock className="w-4 h-4 shrink-0" />
            <span>
              <strong>Lembar Pengisian Terkunci.</strong> Status berkas saat ini adalah <strong>{session.status}</strong>. Pengeditan dinonaktifkan untuk Kepala Madrasah kecuali draf dikembalikan untuk Perbaikan.
            </span>
          </div>
        )}
      </div>

      {/* Search & Bulk Collapse/Expand */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari indikator instrumen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs outline-none transition-all ${
              darkMode 
                ? 'bg-zinc-900 border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white' 
                : 'bg-white border-zinc-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 text-zinc-950'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={expandAll}
            className="px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
          >
            Buka Semua
          </button>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
          >
            Tutup Semua
          </button>

          {/* Inline Status Filters */}
          <div className={`flex rounded-lg p-0.5 border text-[10px] font-bold ${
            darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
          }`}>
            {(['ALL', 'ADA', 'TDK', 'EMPTY'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  filterStatus === f
                    ? 'bg-emerald-600 text-white'
                    : darkMode ? 'text-zinc-400' : 'text-zinc-600'
                }`}
              >
                {f === 'ALL' ? 'Semua' : f === 'ADA' ? 'Ada' : f === 'TDK' ? 'Tidak' : 'Belum'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion List representing the paper sheets */}
      <div className="space-y-4">
        {OFFICIAL_INSTRUMENT.map((category) => {
          // Filter items inside category
          const filteredItems = category.items.filter(item => {
            const grading = gradings[item.id] || { status: null, notes: '' };
            
            // Search text match
            const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  category.title.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (!matchesSearch) return false;

            // Status match
            if (filterStatus === 'ADA') return grading.status === 'ada';
            if (filterStatus === 'TDK') return grading.status === 'tidak';
            if (filterStatus === 'EMPTY') return grading.status === null;
            return true;
          });

          if (filteredItems.length === 0) return null;

          const isExpanded = !!expandedCategories[category.id];
          const completedCountInCat = category.items.filter(item => gradings[item.id]?.status !== null).length;

          return (
            <div 
              key={category.id} 
              className={`rounded-2xl border overflow-hidden transition-all ${
                darkMode ? 'bg-zinc-900/30 border-zinc-800/60' : 'bg-white border-zinc-100 shadow-xs'
              }`}
            >
              {/* Accordion Trigger */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full p-4 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  darkMode ? 'bg-zinc-900/60 hover:bg-zinc-900' : 'bg-emerald-50/10 hover:bg-emerald-50/20'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-display">
                    {category.title}
                  </h3>
                  <span className="text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">
                    {completedCountInCat} / {category.items.length} Selesai
                  </span>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>

              {/* Accordion Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-zinc-100 dark:border-zinc-800/60"
                  >
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/40">
                      {filteredItems.map((item, index) => {
                        const grading = gradings[item.id] || { status: null, notes: '' };
                        return (
                          <div 
                            key={item.id} 
                            className={`p-4 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-colors ${
                              grading.status === 'ada' 
                                ? 'bg-emerald-500/[0.01]' 
                                : grading.status === 'tidak' 
                                ? 'bg-rose-500/[0.01]' 
                                : ''
                            }`}
                          >
                            {/* Left part: code and description */}
                            <div className="flex gap-3 md:max-w-[55%]">
                              <span className="text-[11px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 w-7 h-7 flex items-center justify-center rounded-lg shrink-0 mt-0.5">
                                {item.code}
                              </span>
                              <div>
                                <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
                                  {item.text}
                                </p>
                                {item.description && (
                                  <p className="text-[10px] text-zinc-400 mt-1">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Middle & Right: Penilaian (Status Selection) and Notes */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:w-[42%] shrink-0">
                              
                              {/* Evaluation Buttons (Ada / Tidak) */}
                              <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800/60 p-0.5 rounded-lg text-[10px] font-semibold sm:w-28 shrink-0 h-9">
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(item.id, 'ada')}
                                  disabled={!canEdit}
                                  className={`flex-1 rounded-md flex items-center justify-center gap-1 transition-all ${
                                    grading.status === 'ada'
                                      ? 'bg-emerald-500 text-white shadow-sm'
                                      : 'text-zinc-500 hover:text-emerald-500 disabled:hover:text-zinc-500'
                                  } ${canEdit ? 'cursor-pointer' : 'opacity-80'}`}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Ada</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(item.id, 'tidak')}
                                  disabled={!canEdit}
                                  className={`flex-1 rounded-md flex items-center justify-center gap-1 transition-all ${
                                    grading.status === 'tidak'
                                      ? 'bg-rose-500 text-white shadow-sm'
                                      : 'text-zinc-500 hover:text-rose-500 disabled:hover:text-zinc-500'
                                  } ${canEdit ? 'cursor-pointer' : 'opacity-80'}`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Tdk</span>
                                </button>
                              </div>

                              {/* Comment Field (Catatan) */}
                              <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-zinc-400">
                                  <MessageSquare className="w-3 h-3" />
                                </div>
                                <input
                                  type="text"
                                  value={grading.notes}
                                  onChange={(e) => handleNotesChange(item.id, e.target.value)}
                                  disabled={!canEdit}
                                  placeholder={canEdit ? "Tulis catatan..." : "Tidak ada catatan"}
                                  className={`w-full pl-7.5 pr-2 py-1.5 rounded-lg border text-[11px] outline-none transition-all ${
                                    darkMode 
                                      ? 'bg-zinc-900 border-zinc-800 focus:border-emerald-500 text-white disabled:opacity-70' 
                                      : 'bg-white border-zinc-200 focus:border-emerald-600 text-zinc-950 disabled:opacity-70'
                                  }`}
                                />
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Overall feedback & Decision Block (Bottom Section) */}
      <div className={`p-5 rounded-2xl border ${
        darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-emerald-50 shadow-sm'
      }`}>
        <h4 className="text-sm font-bold font-display mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          Catatan & Rekomendasi Validasi Pengawas
        </h4>
        <p className={`text-xs mb-3 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Tulis kesimpulan umum kelaikan dokumen kurikulum madrasah. Kolom ini wajib diisi oleh pengawas sebelum mengembalikan dokumen untuk perbaikan.
        </p>

        <textarea
          value={overallNotes}
          onChange={(e) => setOverallNotes(e.target.value)}
          disabled={!canEdit}
          rows={3}
          placeholder={canEdit ? "Tuliskan catatan, rekomendasi, atau perbaikan umum untuk dokumen kurikulum ini..." : "Belum ada catatan umum dari pengawas."}
          className={`w-full p-3 rounded-xl border text-xs outline-none transition-all ${
            darkMode 
              ? 'bg-zinc-900 border-zinc-800 focus:border-emerald-500 text-white disabled:opacity-75' 
              : 'bg-white border-zinc-200 focus:border-emerald-600 text-zinc-950 disabled:opacity-75'
          }`}
        />

        {/* NIP Stamp Info inside feedback block */}
        {(session.pengawasName || isPengawas) && (
          <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-zinc-400">
            <span>Disahkan oleh Pengawas:</span>
            <span className="text-zinc-600 dark:text-zinc-200 font-bold">
              {session.pengawasName || currentUser.name} (NIP. {session.pengawasNip || currentUser.nip || '196803151994031005'})
            </span>
          </div>
        )}
      </div>

      {/* ACTION CONTROLS FLOOR */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-5">
        <button
          onClick={onBack}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border font-semibold text-xs transition-colors cursor-pointer ${
            darkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Kembali ke Dashboard
        </button>

        {canEdit && (
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2.5 justify-end">
            {/* Save Draft (both roles) */}
            <button
              onClick={handleSaveDraft}
              className={`flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                darkMode 
                  ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white' 
                  : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Draft
            </button>

            {/* Kepala Madrasah: Submit to Supervisor */}
            {isKepala && (
              <button
                onClick={handleSubmitToSupervisor}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md shadow-emerald-600/10 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Ajukan ke Pengawas
              </button>
            )}

            {/* Pengawas: Revision / Rejection */}
            {isPengawas && (
              <button
                onClick={handleRejectWithRevision}
                className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs py-2.5 px-5 rounded-xl shadow-md shadow-amber-500/10 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Kembalikan (Perbaikan)
              </button>
            )}

            {/* Pengawas: Approve & Validate */}
            {isPengawas && (
              <button
                onClick={handleApproveValidation}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md shadow-emerald-600/15 transition-colors cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Setujui & Sahkan (Validasi)
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
