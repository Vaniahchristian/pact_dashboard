
export type AppRole = 
  | 'admin'
  | 'ict'
  | 'fom'
  | 'financialAdmin'
  | 'supervisor'
  | 'coordinator'
  | 'dataCollector'
  | 'reviewer';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}
