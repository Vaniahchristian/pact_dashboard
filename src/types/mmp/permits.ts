
export interface MMPDocument {
  type: string;
  fileName: string;
  uploadedAt: string;
  fileUrl: string;
}

export interface MMPStatePermitDocument {
  id: string;
  fileName: string;
  uploadedAt: string;
  fileUrl?: string;
  validated: boolean;
  description?: string;
  comments?: string;
  issueDate?: string;
  expiryDate?: string;
  status?: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  permitType: 'federal' | 'state';
  state?: string; // Only required for state permits
}

export interface MMPStatePermit {
  stateName: string;
  verified: boolean;
  documents: MMPStatePermitDocument[];
}

export interface MMPPermitsData {
  federal: boolean;
  state: boolean;
  lastVerified?: string;
  verifiedBy?: string;
  documents?: MMPDocument[];
  statePermits?: MMPStatePermit[];
}
