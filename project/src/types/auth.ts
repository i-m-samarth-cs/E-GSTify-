export type UserRole = 'seller' | 'customer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  gstin?: string;
  company_name?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  role: UserRole;
  gstin?: string;
  company_name?: string;
}