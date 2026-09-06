export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface Hobby {
  id: number;
  name: string;
  category?: string;
  icon?: string;
  color?: 'purple' | 'coral' | 'teal';
}

export interface Profile {
  id: string;
  full_name: string;
  department: string;
  year: string; // '1' | '2' | '3' | '4'
  gender: string; // 'Male' | 'Female' | 'Other' | 'Prefer not to say'
  college: string; // 'CSJMU'
  email_verified: boolean;
  verification_status: VerificationStatus;
  id_card_url?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  is_admin: boolean;
  is_demo?: boolean;
  is_banned?: boolean;
  ban_reason?: string | null;
  banned_at?: string | null;
  created_at: string;
  updated_at?: string;
  hobbies?: Hobby[];
  email?: string;
}

export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface UserReport {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  details?: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at?: string;
  reporter?: Partial<Profile>;
  reported?: Partial<Profile>;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  sender?: Partial<Profile>;
  receiver?: Partial<Profile>;
}

export interface Conversation {
  user: Profile;
  lastMessage?: Message;
  unreadCount?: number;
}

