/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationCategory, MadrasahProfile, ValidationSession, ItemStatus } from './types';

export const OFFICIAL_INSTRUMENT: ValidationCategory[] = [
  {
    id: 'SAMPUL',
    title: 'SAMPUL',
    items: [
      { id: 'S_1', code: '1', text: 'Logo Madrasah' },
      { id: 'S_2', code: '2', text: 'Judul: Kurikulum Madrasah ............' },
      { id: 'S_3', code: '3', text: 'Tahun Ajaran' },
      { id: 'S_4', code: '4', text: 'NSM/NPSN' },
      { id: 'S_5', code: '5', text: 'Alamat Madrasah' }
    ]
  },
  {
    id: 'PENETAPAN',
    title: 'HALAMAN PENETAPAN',
    items: [
      { id: 'HP_1', code: '1', text: 'Rumusan kalimat penetapan' },
      { id: 'HP_2', code: '2', text: 'Tanda tangan kepala Madrasah dan stempel Madrasah' }
    ]
  },
  {
    id: 'REKOMENDASI',
    title: 'HALAMAN REKOMENDASI PENGAWAS PENDAMPING',
    items: [
      { id: 'HR_1', code: '1', text: 'Rumusan kalimat rekomendasi' },
      { id: 'HR_2', code: '2', text: 'Tanda tangan pengawas pendamping' }
    ]
  },
  {
    id: 'PENGESAHAN',
    title: 'HALAMAN PENGESAHAN',
    items: [
      { id: 'HPS_1', code: '1', text: 'Rumusan kalimat pengesahan' },
      { id: 'HPS_2', code: '2', text: 'Tanda tangan yang mengesahkan dan stempel (Kepala Madrasah)' }
    ]
  },
  {
    id: 'PENGANTAR',
    title: 'KATA PENGANTAR',
    items: [
      { id: 'KP_1', code: '1', text: 'Berisi ucapan syukur, terimakasih, garis besar isi Kurikulum Madrasah, harapan, manfaat serta permohonan saran dan kritik untuk perbaikan' }
    ]
  },
  {
    id: 'DAFTAR_ISI',
    title: 'DAFTAR ISI',
    items: [
      { id: 'DI_1', code: '1', text: 'Kesesuaian dengan halaman (lihat kesesuaian antara halaman pada daftar isi dengan halaman pada dokumen kurikulum)' }
    ]
  },
  {
    id: 'DAFTAR_LAMPIRAN',
    title: 'DAFTAR LAMPIRAN',
    items: [
      { id: 'DL_1', code: '1', text: 'Kesesuaian dengan halaman (lihat kesesuaian antara halaman pada daftar isi dengan halaman pada dokumen kurikulum)' }
    ]
  },
  {
    id: 'BAB1_A',
    title: 'BAB I PENDAHULUAN - A. Latar Belakang',
    items: [
      { id: 'B1_A1', code: '1', text: 'Rasional pengembangan kurikulum' },
      { id: 'B1_A2', code: '2', text: 'Prinsip pengembangan kurikulum' },
      { id: 'B1_A3', code: '3', text: 'Tujuan pengembangan kurikulum' },
      { id: 'B1_A4', code: '4', text: 'Memuat landasan filosofis, sosiologis dan psikopedagogis' }
    ]
  },
  {
    id: 'BAB1_B',
    title: 'BAB I PENDAHULUAN - B. Analisis Karakteristik Madrasah',
    items: [
      { id: 'B1_B1', code: '1', text: 'Karakteristik Murid' },
      { id: 'B1_B2', code: '2', text: 'Karakteristik Sosial Budaya' },
      { id: 'B1_B3', code: '3', text: 'Karakteristik Pendidik dan Tenaga Kependidikan' },
      { id: 'B1_B4', code: '4', text: 'Karakteristik Sarana dan Prasarana' },
      { id: 'B1_B5', code: '5', text: 'Lingkungan Belajar Satuan Pendidikan' },
      { id: 'B1_B6', code: '6', text: 'Potensi Sumber Dana' },
      { id: 'B1_B7', code: '7', text: 'Kemitraan Satuan Pendidikan' },
      { id: 'B1_B8', code: '8', text: 'Analisis Program Keahlian (Khusus MAK)' }
    ]
  },
  {
    id: 'BAB2',
    title: 'BAB II VISI, MISI, DAN TUJUAN MADRASAH',
    items: [
      { id: 'B2_A1', code: 'A.1', text: 'Visi: Ringkas dan mudah dipahami berorientasi pembentukan Profil Pelajar Pancasila dan Rahmatan lil alamin' },
      { id: 'B2_A2', code: 'A.2', text: 'Visi: Menggambarkan cita-cita masa depan yang ingin dicapai oleh satuan pendidikan' },
      { id: 'B2_A3', code: 'A.3', text: 'Visi: Mendorong semangat, motivasi dan komitmen seluruh pemangku kepentingan satuan pendidikan untuk meningkatkan kualitas proses dan hasil pendidikan' },
      { id: 'B2_B1', code: 'B.1', text: 'Misi: Memberikan arah dalam mewujudkan visi madrasah' },
      { id: 'B2_B2', code: 'B.2', text: 'Misi: Rumusan misi dalam bentuk kalimat yang menunjukkan tindakan, bukan kalimat yang menunjukkan keadaan sebagaimana pada rumusan visi' },
      { id: 'B2_B3', code: 'B.3', text: 'Misi: Menggambarkan upaya bersama yang berorientasi kepada murid' },
      { id: 'B2_C1', code: 'C.1', text: 'Tujuan: Tujuan harus serasi dan mendeskripsikan misi dan nilai-nilai satuan pendidikan' },
      { id: 'B2_C2', code: 'C.2', text: 'Tujuan: Fokus pada hasil yang diinginkan pada murid' },
      { id: 'B2_C3', code: 'C.3', text: 'Tujuan: Harus spesifik, terukur, dapat dicapai, relevan, dan ada jangka waktu tertentu (SMART)' }
    ]
  },
  {
    id: 'BAB3_A',
    title: 'BAB III PENGORGANISASIAN PEMBELAJARAN DAN PERENCANAAN PEMBELAJARAN - A. Pengorganisasian',
    items: [
      { id: 'B3_A1a', code: '1.a', text: 'Struktur & Muatan Kurikulum: Intrakurikuler (memuat mata pelajaran nasional, muatan lokal, dan mata pelajaran program unggulan serta jumlah jam pelajarannya)' },
      { id: 'B3_A1b', code: '1.b', text: 'Program Kokurikuler: (1) Dilaksanakan sebagai program Inti, (2) Melibatkan guru lintas mapel sebagai tim fasilitator dan ada koordinator projek, (3) Direncanakan di awal tahun ajaran, (4) Memuat tema, uraian tema, dan dimensi untuk tema yang dipilih' },
      { id: 'B3_A1c', code: '1.c', text: 'Ekstrakurikuler: (1) Terdapat jenis ekstrakurikuler dan uraiannya, (2) Terdapat tabel yang memuat jenis ekstrakurikuler, nama program ekstrakurikuler, tujuan, sasaran, pelaksana, dan profil pelajar pancasila, (3) Terdapat uraian strategi pelaksanaan' },
      { id: 'B3_A1d', code: '1.d', text: 'Program Pendukung bila ada seperti psikotes, pembiasaan, kunjungan ke perusahaan, kunjungan ke perguruan tinggi, dan kunjungan ke sumber-sumber belajar' },
      { id: 'B3_A2', code: '2', text: 'Pendekatan Pembelajaran' },
      { id: 'B3_A3', code: '3', text: 'Layanan Bimbingan Konseling' },
      { id: 'B3_A4a', code: '4.a', text: 'Asesmen pembelajaran: Prinsip-prinsip asesmen' },
      { id: 'B3_A4b', code: '4.b', text: 'Asesmen pembelajaran: Jenis asesmen' },
      { id: 'B3_A4c', code: '4.c', text: 'Asesmen pembelajaran: Teknik dan Instrumen asesmen' },
      { id: 'B3_A4d', code: '4.d', text: 'Asesmen pembelajaran: Kriteria ketercapaian tujuan pembelajaran' },
      { id: 'B3_A4e', code: '4.e', text: 'Asesmen pembelajaran: Mekanisme dan pengolahan hasil asesmen' },
      { id: 'B3_A4f', code: '4.f', text: 'Asesmen pembelajaran: Kriteria kelulusan' }
    ]
  },
  {
    id: 'BAB3_B',
    title: 'BAB III PENGORGANISASIAN PEMBELAJARAN DAN PERENCANAAN PEMBELAJARAN - B. Perencanaan',
    items: [
      { id: 'B3_B1', code: '1', text: 'Perencanaan pembelajaran ruang lingkup satuan pendidikan: Terdapat penjelasan mengenai prinsip-prinsip pembelajaran yang digunakan, strategi merumuskan tujuan pembelajaran, dan langkah-langkah menyusun alur tujuan pembelajaran, serta format alur tujuan pembelajaran yang digunakan' },
      { id: 'B3_B2', code: '2', text: 'Perencanaan pembelajaran ruang lingkup kelas: Terdapat penjelasan mengenai pemilihan dokumen perencanaan di kelas (modul ajar atau RPP), metode, strategi, atau model pembelajaran yang digunakan di kelas' }
    ]
  },
  {
    id: 'BAB3_C',
    title: 'BAB III PENGORGANISASIAN PEMBELAJARAN DAN PERENCANAAN PEMBELAJARAN - C. Kalender',
    items: [
      { id: 'B3_C1', code: '1', text: 'Permulaan tahun ajaran' },
      { id: 'B3_C2', code: '2', text: 'Pekan efektif belajar' },
      { id: 'B3_C3', code: '3', text: 'Jadwal libur' },
      { id: 'B3_C4', code: '4', text: 'Peringatan hari besar/khusus' }
    ]
  },
  {
    id: 'BAB4',
    title: 'BAB IV PENUTUP',
    items: [
      { id: 'B4_1', code: '1', text: 'Terdapat kalimat penutup' },
      { id: 'B4_2', code: '2', text: 'Terdapat kalimat permintaan masukan, saran dan kritik yang membangun' }
    ]
  },
  {
    id: 'PUSTAKA',
    title: 'DAFTAR PUSTAKA',
    items: [
      { id: 'DP_1', code: '1', text: 'Memuat referensi/regulasi yang dirujuk dalam penyusunan dokumen kurikulum madrasah' }
    ]
  },
  {
    id: 'LAMPIRAN',
    title: 'LAMPIRAN',
    items: [
      { id: 'L_1', code: '1', text: 'SK Tim Pengembang Kurikulum dan Tim KBC Madrasah (Boleh digabung 1 SK)' },
      { id: 'L_2', code: '2', text: 'SK Penetapan kalender pendidikan madrasah' },
      { id: 'L_3', code: '3', text: 'Contoh Alur Tujuan Pembelajaran' },
      { id: 'L_4', code: '4', text: 'Contoh Modul ajar' },
      { id: 'L_5', code: '5', text: 'Contoh Perencanaan Kokurikuler' },
      { id: 'L_6', code: '6', text: 'Dokumen kegiatan pengembangan/penyusunan kurikulum madrasah (surat undangan, daftar hadir, notulen, berita acara, Dokumentasi)' }
    ]
  }
];

export const ALL_ITEMS_COUNT = OFFICIAL_INSTRUMENT.reduce((acc, cat) => acc + cat.items.length, 0);

// Preset Mock Madrasahs
export const PRESET_MADRASAH_PROFILES: MadrasahProfile[] = [
  {
    id: 'm1',
    name: 'MAN 1 Tanah Datar (Sungayang)',
    nsm: '131112040001',
    npsn: '10499001',
    address: 'Jl. Raya Sungayang No. 12, Tanah Datar, Sumatera Barat',
    headmasterName: 'Drs. H. Syamsul Bahri, M.Pd.',
    headmasterNip: '197405122001121002',
    level: 'MA',
    status: 'Negeri',
    accreditation: 'A',
    academicYear: '2026/2027'
  },
  {
    id: 'm2',
    name: 'MTsS Thawalib Sungayang',
    nsm: '121212040003',
    npsn: '10499005',
    address: 'Sungayang, Kabupaten Tanah Datar, Sumatera Barat',
    headmasterName: 'Hasan Basri, S.Ag.',
    headmasterNip: '198103042008011005',
    level: 'MTs',
    status: 'Swasta',
    accreditation: 'A',
    academicYear: '2026/2027'
  },
  {
    id: 'm3',
    name: 'MIN 2 Tanah Datar',
    nsm: '111112040002',
    npsn: '10499008',
    address: 'Sungayang, Tanah Datar, Sumatera Barat',
    headmasterName: 'Siti Rahma, S.Pd.I.',
    headmasterNip: '197908222010012012',
    level: 'MI',
    status: 'Negeri',
    accreditation: 'B',
    academicYear: '2026/2027'
  },
  {
    id: 'm4',
    name: 'MA Kejuruan (MAK) Harapan Bangsa',
    nsm: '131312040015',
    npsn: '10499210',
    address: 'Jl. Pemuda No. 45, Batusangkar, Tanah Datar',
    headmasterName: 'Ir. Ahmad Zulkifli',
    headmasterNip: '197611302005011003',
    level: 'MAK',
    status: 'Swasta',
    accreditation: 'B',
    academicYear: '2026/2027'
  }
];

// Helper to construct empty session gradings
export function generateEmptyGradings(): Record<string, { status: ItemStatus; notes: string }> {
  const gradings: Record<string, { status: ItemStatus; notes: string }> = {};
  OFFICIAL_INSTRUMENT.forEach((cat) => {
    cat.items.forEach((item) => {
      gradings[item.id] = {
        status: null,
        notes: ''
      };
    });
  });
  return gradings;
}

// Helper to calculate total filled, ada-count, and score percentage
export function calculateSessionScore(gradings: Record<string, { status: ItemStatus; notes: string }>) {
  let totalItems = ALL_ITEMS_COUNT;
  let adaCount = 0;
  let tidakCount = 0;
  let emptyCount = 0;

  Object.values(gradings).forEach((g) => {
    if (g.status === 'ada') {
      adaCount++;
    } else if (g.status === 'tidak') {
      tidakCount++;
    } else {
      emptyCount++;
    }
  });

  const score = Math.round((adaCount / totalItems) * 100);
  return {
    score,
    adaCount,
    tidakCount,
    emptyCount,
    totalItems
  };
}

export const INITIAL_SESSIONS: ValidationSession[] = [
  {
    id: 'sess-1',
    madrasahId: 'm1',
    profile: PRESET_MADRASAH_PROFILES[0],
    academicYear: '2026/2027',
    status: 'Divalidasi',
    score: 94,
    updatedAt: '2026-06-23T14:30:00.000Z',
    validatedAt: '2026-06-23T15:00:00.000Z',
    pengawasId: 'p-1',
    pengawasName: 'Drs. H. Erman, M.Pd.',
    pengawasNip: '196803151994031005',
    notes: 'Secara keseluruhan dokumen sangat lengkap. Semua lampiran lengkap dan SK sudah ditandatangani. Siap dilaksanakan untuk tahun ajaran 2026/2027.',
    gradings: (() => {
      const g = generateEmptyGradings();
      // Set mostly 'ada'
      let count = 0;
      Object.keys(g).forEach((key) => {
        if (count < 48) {
          g[key].status = 'ada';
        } else {
          g[key].status = 'tidak';
          g[key].notes = 'Perlu penyesuaian format atau deskripsi minor';
        }
        count++;
      });
      return g;
    })()
  },
  {
    id: 'sess-2',
    madrasahId: 'm2',
    profile: PRESET_MADRASAH_PROFILES[1],
    academicYear: '2026/2027',
    status: 'Diajukan',
    score: 60,
    updatedAt: '2026-06-24T02:15:00.000Z',
    submittedAt: '2026-06-24T02:15:00.000Z',
    gradings: (() => {
      const g = generateEmptyGradings();
      // Madrasah head filled 30 items as 'ada', rest is still null or filled draft
      let count = 0;
      Object.keys(g).forEach((key) => {
        if (count < 30) {
          g[key].status = 'ada';
        } else if (count < 40) {
          g[key].status = 'tidak';
          g[key].notes = 'Belum dicetak';
        } else {
          g[key].status = null;
        }
        count++;
      });
      return g;
    })()
  },
  {
    id: 'sess-3',
    madrasahId: 'm3',
    profile: PRESET_MADRASAH_PROFILES[2],
    academicYear: '2026/2027',
    status: 'Perbaikan',
    score: 45,
    updatedAt: '2026-06-22T09:00:00.000Z',
    pengawasId: 'p-1',
    pengawasName: 'Drs. H. Erman, M.Pd.',
    pengawasNip: '196803151994031005',
    notes: 'Lampiran SK TPK belum disertakan dan Analisis Karakteristik Madrasah belum menggambarkan karakteristik murid secara spesifik. Silakan direvisi.',
    gradings: (() => {
      const g = generateEmptyGradings();
      // Madrasah filled some, supervisor rejected some
      let count = 0;
      Object.keys(g).forEach((key) => {
        if (count < 23) {
          g[key].status = 'ada';
        } else if (count < 35) {
          g[key].status = 'tidak';
          g[key].notes = 'Dokumen pendukung atau uraian belum ada/belum sah';
        } else {
          g[key].status = null;
        }
        count++;
      });
      return g;
    })()
  },
  {
    id: 'sess-4',
    madrasahId: 'm4',
    profile: PRESET_MADRASAH_PROFILES[3],
    academicYear: '2026/2027',
    status: 'Draft',
    score: 20,
    updatedAt: '2026-06-24T05:00:00.000Z',
    gradings: (() => {
      const g = generateEmptyGradings();
      // A brand new draft being worked on
      let count = 0;
      Object.keys(g).forEach((key) => {
        if (count < 10) {
          g[key].status = 'ada';
        } else {
          g[key].status = null;
        }
        count++;
      });
      return g;
    })()
  }
];
