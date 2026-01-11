
import { Agent, AgentStatus, Category } from './types';

export const DEFAULT_ICONS = [
  'smart_toy', 'terminal', 'code', 'palette', 'brush', 
  'bar_chart', 'trending_up', 'edit_note', 'description', 'calendar_month', 
  'task_alt', 'bolt', 'rocket_launch', 'lightbulb', 'database', 
  'cloud', 'security', 'search', 'forum', 'chat_bubble', 
  'mail', 'inventory_2', 'history_edu', 'school', 'science', 
  'travel_explore', 'language', 'videocam', 'headphones', 'star'
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-prod', name: 'Productivity', icon: 'calendar_month', color: 'blue' },
  { id: 'cat-code', name: 'Coding', icon: 'terminal', color: 'emerald' },
  { id: 'cat-crea', name: 'Creative', icon: 'palette', color: 'purple' },
  { id: 'cat-data', name: 'Data Analysis', icon: 'bar_chart', color: 'orange' },
  { id: 'cat-writ', name: 'Writing', icon: 'edit_note', color: 'pink' }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'v1sual-01',
    name: 'DreamWeaver Pro',
    category: 'Creative',
    shortDescription: 'The ultimate visual synthesizer. Capable of generating hyper-realistic architectural renders, surrealist art, and pixel-perfect UI concepts.',
    detailedInstructions: 'You are an advanced visual artist and conceptual designer. When generating images, focus on lighting, texture, and composition. If the user asks for a design, provide multiple stylistic interpretations. You excel at taking abstract concepts and turning them into vivid imagery.',
    status: AgentStatus.ACTIVE,
    lastUpdated: '10 mins ago',
    version: '4.0.0-img',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '8f92a0',
    name: 'CodeRefactor Pro',
    category: 'Coding',
    shortDescription: 'Automatically analyzes legacy Python codebases to identify performance bottlenecks and suggests modern refactoring patterns with 95% accuracy.',
    detailedInstructions: 'You are an expert Frontend and Systems Architect. Your primary goal is to help users refactor and modernize their code. Focus on readability, performance, and best practices like SOLID principles. When a user provides code, first analyze it, then provide a refactored version with clear explanations of changes.',
    status: AgentStatus.ACTIVE,
    lastUpdated: '2 hours ago',
    version: '2.4.0',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1-p4hnXfA7B_mn3133aMxwV02MM_m7DdHrUmExve-iDtUwYUfDND3pph8_vemMjIfNiWXYCGdwnvvlsc2isXa7S3TAvgNxPGfiAARs9LWiEY4E9QXmqJFEMQFFDp3hOiR9oVaIWM7rwQ3-Hi919B3wOThK5GBNfA_MUp-Dwky3hEL5SgweuGtl3q2c3RK4CsX8vRjqGB8E1lUtwDQizFLeqLHakKIjPkYnTQUgvqyiPSZOnDcOy06Ho3M4aRSNEf9E8n2bU-2Eas'
  },
  {
    id: '9d4k2j',
    name: 'DesignMuse',
    category: 'Creative',
    shortDescription: 'Generates high-fidelity prompt variations for Midjourney and DALL-E 3 based on vague client briefs. Includes color palette extraction.',
    detailedInstructions: 'You are a master creative director and prompt engineer. Your job is to take vague ideas and turn them into highly detailed visual prompts. Always output multiple variations (Cinematic, Minimalist, Surrealist) and suggest a hex color palette for each.',
    status: AgentStatus.IDLE,
    lastUpdated: '1 hour ago',
    version: '1.2.5'
  },
  {
    id: '7v3m1x',
    name: 'ScheduleSync',
    category: 'Productivity',
    shortDescription: 'Manages complex calendar conflicts via natural language processing. Can negotiate meeting times with external stakeholders.',
    detailedInstructions: 'You are a professional executive assistant. You excel at handling scheduling conflicts and finding optimal meeting times. Be polite, concise, and proactive in suggesting time slots based on the user preferences provided.',
    status: AgentStatus.ACTIVE,
    lastUpdated: '1 day ago',
    version: '3.1.0'
  }
];
