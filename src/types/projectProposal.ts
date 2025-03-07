
export type ProjectProposalStatus = 'pending' | 'approved' | 'rejected';

export interface ProjectProposal {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  duration?: string;
  organization?: string;
  status: ProjectProposalStatus;
  feedback?: string;
  employer_id: string;
  created_at: string;
  updated_at: string;
}
