
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export enum AgentStatus {
  ACTIVE = 'Active',
  TRAINING = 'Training',
  IDLE = 'Idle',
  MAINTENANCE = 'Maintenance'
}

export interface Agent {
  id: string;
  name: string;
  category: string; // Changed from enum to string to support dynamic categories
  shortDescription: string;
  detailedInstructions: string;
  status: AgentStatus;
  lastUpdated: string;
  imageUrl?: string;
  repoUrl?: string;
  version: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text?: string;
  imageUrl?: string;
}
