import { z } from 'zod';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string()
});

export const ChatResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    message: z.string(),
    session_id: z.string(),
    agent_id: z.string(),
    timestamp: z.string()
  })
});

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  model: z.string(),
  status: z.string()
});

export const WorkflowRunSchema = z.object({
  run_id: z.string(),
  status: z.string(),
  created_at: z.string()
});

export const WebhookSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  events: z.array(z.string()),
  is_active: z.boolean(),
  created_at: z.string()
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type Agent = z.infer<typeof AgentSchema>;
export type WorkflowRun = z.infer<typeof WorkflowRunSchema>;
export type Webhook = z.infer<typeof WebhookSchema>;

export interface AgentOSConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}
