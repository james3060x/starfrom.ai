import {
  AgentOSConfig,
  RequestOptions,
  ChatResponse,
  Agent,
  WorkflowRun,
  Webhook,
  PaginationParams
} from './types';

export class AgentOSClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: AgentOSConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://agentos.starfrom.ai/api/v1';
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async chat(agentId: string, message: string, sessionId?: string): Promise<ChatResponse> {
    return this.request<ChatResponse>(`/agents/${agentId}/chat`, {
      method: 'POST',
      body: { message, session_id: sessionId }
    });
  }

  async listAgents(): Promise<{ success: boolean; data: Agent[] }> {
    return this.request<{ success: boolean; data: Agent[] }>('/agents');
  }

  async getAgent(agentId: string): Promise<{ success: boolean; data: Agent }> {
    return this.request<{ success: boolean; data: Agent }>(`/agents/${agentId}`);
  }

  async listKnowledgeSources(agentId: string): Promise<{ success: boolean; data: unknown[] }> {
    return this.request<{ success: boolean; data: unknown[] }>(`/agents/${agentId}/knowledge`);
  }

  async addKnowledgeSource(agentId: string, name: string, type: string, content: string): Promise<{ success: boolean; data: unknown }> {
    return this.request<{ success: boolean; data: unknown }>(`/agents/${agentId}/knowledge`, {
      method: 'POST',
      body: { name, type, content }
    });
  }

  async triggerWorkflow(workflowId: string, inputs?: Record<string, unknown>, callbackUrl?: string): Promise<{ success: boolean; data: WorkflowRun }> {
    return this.request<{ success: boolean; data: WorkflowRun }>(`/workflows/${workflowId}/trigger`, {
      method: 'POST',
      body: { inputs, callback_url: callbackUrl }
    });
  }

  async listWebhooks(): Promise<{ success: boolean; data: Webhook[] }> {
    return this.request<{ success: boolean; data: Webhook[] }>('/webhooks');
  }

  async createWebhook(name: string, url: string, events: string[], secret?: string): Promise<{ success: boolean; data: Webhook }> {
    return this.request<{ success: boolean; data: Webhook }>('/webhooks', {
      method: 'POST',
      body: { name, url, events, secret }
    });
  }

  async deleteWebhook(webhookId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/webhooks?id=${webhookId}`, {
      method: 'DELETE'
    });
  }

  async getSession(sessionId: string): Promise<{ success: boolean; data: unknown }> {
    return this.request<{ success: boolean; data: unknown }>(`/sessions/${sessionId}`);
  }

  async getSessionMessages(sessionId: string, params?: PaginationParams): Promise<{ success: boolean; data: unknown[]; pagination: { total: number; limit: number; offset: number } }> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    
    return this.request<{ success: boolean; data: unknown[]; pagination: { total: number; limit: number; offset: number } }>(
      `/sessions/${sessionId}/messages?${query.toString()}`
    );
  }

  async deleteSession(sessionId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/sessions/${sessionId}`, {
      method: 'DELETE'
    });
  }
}

export function createClient(config: AgentOSConfig): AgentOSClient {
  return new AgentOSClient(config);
}
