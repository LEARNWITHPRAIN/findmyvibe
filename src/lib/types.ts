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
  created_at: string;
  updated_at?: string;
  hobbies?: Hobby[];
  email?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender?: Partial<Profile>;
  receiver?: Partial<Profile>;
}

export interface Conversation {
  user: Profile;
  lastMessage?: Message;
  unreadCount?: number;
}
