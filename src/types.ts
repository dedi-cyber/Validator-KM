/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'kepala_madrasah' | 'pengawas' | 'admin_kemenag';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  madrasahId?: string; // If 'kepala_madrasah'
  nip?: string;
}

export interface MadrasahProfile {
  id: string;
  name: string;
  nsm: string;
  npsn: string;
  address: string;
  headmasterName: string;
  headmasterNip: string;
  level: 'MI' | 'MTs' | 'MA' | 'MAK';
  status: 'Negeri' | 'Swasta';
  accreditation: 'A' | 'B' | 'C' | 'Belum Terakreditasi';
  academicYear: string;
}

export interface ValidationItem {
  id: string;
  code: string;
  text: string;
  subCategory?: string;
  description?: string;
}

export interface ValidationCategory {
  id: string;
  title: string;
  items: ValidationItem[];
}

export type ItemStatus = 'ada' | 'tidak' | null;

export interface ItemGrading {
  status: ItemStatus;
  notes: string;
}

export interface ValidationSession {
  id: string;
  madrasahId: string;
  profile: MadrasahProfile;
  academicYear: string;
  status: 'Draft' | 'Diajukan' | 'Divalidasi' | 'Perbaikan';
  score: number; // percentage of 'ada' status out of total items
  gradings: Record<string, ItemGrading>; // itemId -> grading
  updatedAt: string;
  submittedAt?: string;
  validatedAt?: string;
  pengawasId?: string;
  pengawasName?: string;
  pengawasNip?: string;
  notes?: string; // overall notes
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  username: string;
  role: UserRole;
  madrasahName: string;
  action: string;
  details: string;
}

export interface NotificationLog {
  id: string;
  timestamp: string;
  sender: string;
  recipientEmail: string;
  subject: string;
  body: string;
  status: 'Terkirim' | 'Gagal';
}
