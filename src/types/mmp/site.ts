export interface MMPSiteEntry {
  id: string;
  status: string;
  siteCode?: string;
  siteName?: string;
  inMoDa?: boolean;
  visitedBy?: string;
  mainActivity?: string;
  visitDate?: string;
  isFlagged?: boolean;
  flagReason?: string;
  flaggedBy?: string;
  flaggedAt?: string;
  hubOffice?: string;
  state?: string;
  locality?: string;
  cpName?: string;
  siteActivity?: string;
  visitType?: string;
  comments?: string;
  additionalData?: Record<string, string>;
}

export interface MMPSiteVisit {
  complexity?: string;
  estimatedDuration?: string;
  resources?: string[];
  risks?: string;
  escalation?: string;
}
