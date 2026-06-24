/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Building2, CheckCircle2, AlertCircle, FileText, Download, Mail, 
  TrendingUp, Layers, Calendar, ArrowRight, Activity, Clock
} from 'lucide-react';
import { ValidationSession, ActivityLog, NotificationLog, User } from '../types';
import { calculateSessionScore } from '../instrumentData';

interface DashboardOverviewProps {
  sessions: ValidationSession[];
  activityLogs: ActivityLog[];
  notificationLogs: NotificationLog[];
  currentUser: User;
  onSelectSession: (session: ValidationSession) => void;
  darkMode: boolean;
}

export default function DashboardOverview({
  sessions,
  activityLogs,
  notificationLogs,
  currentUser,
  onSelectSession,
  darkMode
}: DashboardOverviewProps) {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'ALL' | 'MI' | 'MTs' | 'MA' | 'MAK'>('ALL');

  // Filtered sessions
  const filteredSessions = sessions.filter(s => 
    selectedLevelFilter === 'ALL' ? true : s.profile.level === selectedLevelFilter
  );

  // Stats calculation
  const totalMadrasah = sessions.length;
  const countValidated = sessions.filter(s => s.status === 'Divalidasi').length;
  const countSubmitted = sessions.filter(s => s.status === 'Diajukan').length;
  const countNeedsRevision = sessions.filter(s => s.status === 'Perbaikan').length;
  const countDraft = sessions.filter(s => s.status === 'Draft').length;

  const totalScoreSum = sessions.reduce((sum, s) => {
    const { score } = calculateSessionScore(s.gradings);
    return sum + score;
  }, 0);
  const avgScore = totalMadrasah > 0 ? Math.round(totalScoreSum / totalMadrasah) : 0;

  // Chart 1 Data: Progress by Madrasah Name
  const progressData = sessions.map(s => {
    const { score } = calculateSessionScore(s.gradings);
    return {
      name: s.profile.name.replace(/(MAN 1|MTsS|MIN 2|MA Kejuruan \(MAK\))\s/, ''), // Shorten names for clean X-axis
      fullName: s.profile.name,
      Score: score,
      Level: s.profile.level,
      Status: s.status
    };
  });

  // Chart 2 Data: Status Distribution
  const statusDistributionData = [
    { name: 'Divalidasi', value: countValidated, color: '#10B981' }, // emerald-500
    { name: 'Diajukan', value: countSubmitted, color: '#3B82F6' },   // blue-500
    { name: 'Perbaikan', value: countNeedsRevision, color: '#F59E0B' }, // amber-500
    { name: 'Draft', value: countDraft, color: '#9CA3AF' }          // gray-400
  ].filter(item => item.value > 0);

  // Chart 3: Level wise compliance rates
  const levels: ('MI' | 'MTs' | 'MA' | 'MAK')[] = ['MI', 'MTs', 'MA', 'MAK'];
  const levelComplianceData = levels.map(lvl => {
    const lvlSessions = sessions.filter(s => s.profile.level === lvl);
    const sum = lvlSessions.reduce((sAcc, s) => sAcc + calculateSessionScore(s.gradings).score, 0);
    return {
      level: lvl,
      avg: lvlSessions.length > 0 ? Math.round(sum / lvlSessions.length) : 0,
      count: lvlSessions.length
    };
  });

  // Function to trigger Excel export (formatted UTF-8 BOM CSV)
  const handleExportExcel = () => {
    // Construct header row
    const headers = [
      'ID Madrasah',
      'Nama Madrasah',
      'NSM',
      'NPSN',
      'Alamat',
      'Kepala Madrasah',
      'Jenjang',
      'Status Akreditasi',
      'Tahun Ajaran',
      'Status Validasi',
      'Skor Kelayakan (%)',
      'Terakhir Diperbarui'
    ];

    const rows = sessions.map(s => {
      const { score } = calculateSessionScore(s.gradings);
      return [
        s.profile.id,
        `"${s.profile.name.replace(/"/g, '""')}"`,
        s.profile.nsm,
        s.profile.npsn,
        `"${s.profile.address.replace(/"/g, '""')}"`,
        `"${s.profile.headmasterName.replace(/"/g, '""')}"`,
        s.profile.level,
        s.profile.accreditation,
        s.academicYear,
        s.status,
        score,
        new Date(s.updatedAt).toLocaleDateString('id-ID', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Validasi_Kurikulum_Madrasah_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Quick controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight">Dashboard Laporan Terpadu</h2>
          <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Pemantauan kelayakan draf kurikulum madrasah secara real-time di tingkat daerah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick filter by jenjang */}
          <div className={`flex rounded-lg p-0.5 border text-xs font-medium ${
            darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
          }`}>
            {(['ALL', 'MI', 'MTs', 'MA', 'MAK'] as const).map(f => (
              <button
                key={f}
                onClick={() => setSelectedLevelFilter(f)}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  selectedLevelFilter === f
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : darkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium text-xs py-2 px-3.5 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Ekspor Excel
          </button>
        </div>
      </div>

      {/* Highlights Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className={`p-4 rounded-2xl border transition-all ${
          darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-emerald-100 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Total Madrasah</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold tracking-tight font-display">{totalMadrasah}</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-500" /> MI, MTs, MA, MAK terdata
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`p-4 rounded-2xl border transition-all ${
          darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-emerald-100 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Lolos Validasi</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold tracking-tight font-display text-emerald-600 dark:text-emerald-400">{countValidated}</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              {totalMadrasah > 0 ? Math.round((countValidated/totalMadrasah)*100) : 0}% kelayakan dipenuhi
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`p-4 rounded-2xl border transition-all ${
          darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-emerald-100 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Menunggu Validasi</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold tracking-tight font-display text-blue-500">{countSubmitted}</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {countNeedsRevision} Perbaikan &bull; {countDraft} Draft
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`p-4 rounded-2xl border transition-all ${
          darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-emerald-100 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Rata-rata Skor Kelayakan</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold tracking-tight font-display text-amber-500">{avgScore}%</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Dari 51 total indikator instrumen
            </p>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Bar Chart of Scores (2/3 width) */}
        <div className={`lg:col-span-2 p-5 rounded-2xl border ${
          darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-emerald-50 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold font-display">Grafik Perkembangan Evaluasi Real-Time</h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Skor keterpenuhan komponen kurikulum untuk setiap madrasah (%)</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-bold">
              ● Live Sync
            </span>
          </div>

          <div className="h-64 sm:h-80 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={progressData}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#27272a' : '#f4f4f5'} />
                <XAxis dataKey="name" stroke={darkMode ? '#71717a' : '#a1a1aa'} />
                <YAxis domain={[0, 100]} stroke={darkMode ? '#71717a' : '#a1a1aa'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#18181b' : '#ffffff',
                    borderColor: darkMode ? '#3f3f46' : '#e4e4e7',
                    color: darkMode ? '#f4f4f5' : '#18181b',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="Score" radius={[4, 4, 0, 0]}>
                  {progressData.map((entry, index) => {
                    // Custom coloring based on score thresholds
                    let color = '#F59E0B'; // Medium
                    if (entry.Score >= 80) color = '#10B981'; // high (emerald)
                    if (entry.Score < 50) color = '#EF4444'; // low (rose)
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-3 flex items-center justify-center gap-4 text-[10px] font-semibold text-zinc-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Layah (≥ 80%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pendampingan (50% - 79%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Perlu Atensi (&lt; 50%)</span>
          </div>
        </div>

        {/* Chart 2: Status Donut Chart (1/3 width) */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-emerald-50 shadow-sm'
        }`}>
          <div>
            <h4 className="text-sm font-bold font-display">Status Dokumen</h4>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Penyebaran draf berdasarkan status sirkulasi</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center relative my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center label */}
            <div className="absolute text-center">
              <span className="text-2xl font-bold font-display tracking-tight text-emerald-600 dark:text-emerald-400">{totalMadrasah}</span>
              <p className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">Madrasah</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {statusDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-1 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.name}</span>
                </div>
                <span className="font-semibold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[10px]">
                  {item.value} berkas
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Level-wise stats & Activity and Notification Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance by Level (Jenjang MI, MTs, MA, MAK) */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-emerald-50 shadow-sm'
        }`}>
          <h4 className="text-sm font-bold font-display mb-3">Kepatuhan Berdasarkan Jenjang</h4>
          <div className="space-y-4">
            {levelComplianceData.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    Madrasah {item.level === 'MA' ? 'Aliyah (MA)' : item.level === 'MTs' ? 'Tsanawiyah (MTs)' : item.level === 'MI' ? 'Ibtidaiyah (MI)' : 'Kejuruan (MAK)'}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">{item.avg}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-1000"
                    style={{ width: `${item.avg}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>{item.count} Madrasah terdaftar</span>
                  <span>Target: 100% Ada</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Activity Logs */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-emerald-50 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold font-display">Log Aktivitas Real-time</h4>
          </div>
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {activityLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex gap-2.5 text-xs pb-3 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 last:pb-0">
                <div className="mt-0.5">
                  <div className={`w-2 h-2 rounded-full ${
                    log.action.includes('Validasi') || log.action.includes('Setuju') 
                      ? 'bg-emerald-500' 
                      : log.action.includes('Ajukan') 
                      ? 'bg-blue-500' 
                      : log.action.includes('Perbaikan') 
                      ? 'bg-amber-500' 
                      : 'bg-zinc-400'
                  }`}></div>
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {log.username} <span className="font-normal text-zinc-500">({log.role === 'kepala_madrasah' ? 'Kepala' : 'Pengawas'})</span>
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-tight">
                    {log.action} draf {log.madrasahName} &bull; <span className="italic">{log.details}</span>
                  </p>
                  <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispatch Logs (Notifikasi Otomatis) */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-emerald-50 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-emerald-600 animate-pulse" />
            <h4 className="text-sm font-bold font-display">Audit Notifikasi Email</h4>
          </div>
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {notificationLogs.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-xs">
                Belum ada notifikasi email terkirim.
              </div>
            ) : (
              notificationLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-100 dark:border-zinc-800 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Kepada: {log.recipientEmail.split('@')[0]}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                      {log.status}
                    </span>
                  </div>
                  <h5 className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                    {log.subject}
                  </h5>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {log.body}
                  </p>
                  <span className="text-[8px] text-zinc-400 text-right font-mono">
                    {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Madrasah Row Selector Quick List for Ministry / Pengawas */}
      {currentUser.role !== 'kepala_madrasah' && (
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-emerald-50 shadow-sm'
        }`}>
          <h4 className="text-sm font-bold font-display mb-3">Daftar Dokumen Madrasah Binaan</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSessions.map((session) => {
              const { score } = calculateSessionScore(session.gradings);
              return (
                <div 
                  key={session.id}
                  onClick={() => onSelectSession(session)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.01] hover:border-emerald-500 flex flex-col justify-between h-36 ${
                    darkMode ? 'bg-zinc-800/30 border-zinc-800' : 'bg-zinc-50/50 border-zinc-100'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800">
                        {session.profile.level}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
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
                    <h5 className="font-bold text-xs mt-2 line-clamp-1 text-zinc-900 dark:text-white">
                      {session.profile.name}
                    </h5>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      NSM: {session.profile.nsm}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-2.5 mt-2">
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Skor: <strong className="text-zinc-700 dark:text-zinc-200">{score}%</strong>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 hover:underline">
                      Periksa <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
