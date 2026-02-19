import { createClient } from '@supabase/supabase-js';
import { 
  McpTool, 
  McpResource,
  AGENTOS_TOOLS,
  AGENTOS_RESOURCES 
} from './types';

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface McpAuthResult {
  success: boolean;
  workspaceId?: string;
  error?: { code: string; message: string };
}

export async function validateMcpToken(authHeader: string | null): Promise<McpAuthResult> {
  if (!authHeader) {
    return {
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing Authorization header' }
    };
  }

  const match = authHeader.match(/^(?:Bearer\s+)?(mcp-[a-f0-9]{64})$/);
  if (!match) {
    return {
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid MCP token format' }
    };
  }

  const token = match[1];
  const tokenHash = await sha256(token);

  const { data: tokenRecord, error } = await supabase
    .from('mcp_tokens')
    .select('id, workspace_id, is_active, expires_at')
    .eq('token_hash', tokenHash)
    .single();

  if (error || !tokenRecord) {
    return {
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid MCP token' }
    };
  }

  if (!tokenRecord.is_active) {
    return {
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'MCP token is revoked' }
    };
  }

  if (tokenRecord.expires_at && new Date(tokenRecord.expires_at) < new Date()) {
    return {
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'MCP token has expired' }
    };
  }

  await supabase
    .from('mcp_tokens')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', tokenRecord.id);

  return {
    success: true,
    workspaceId: tokenRecord.workspace_id
  };
}

export function getMcpCapabilities() {
  return {
    protocolVersion: '2024-11-05',
    capabilities: {
      tools: {},
      resources: {},
      logging: {}
    },
    serverInfo: {
      name: 'starfrom-agentos',
      version: '2.3.0'
    }
  };
}

export function listMcpTools(): McpTool[] {
  return AGENTOS_TOOLS;
}

export function listMcpResources(): McpResource[] {
  return AGENTOS_RESOURCES;
}

export async function executeMcpTool(
  toolName: string, 
  args: Record<string, unknown>,
  workspaceId: string
): Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }> {
  try {
    switch (toolName) {
      case 'agent_chat': {
        const { agent_id, message } = args as { agent_id: string; message: string; session_id?: string };
        
        const { data: agent } = await supabase
          .from('agents')
          .select('id, name')
          .eq('id', agent_id)
          .eq('workspace_id', workspaceId)
          .single();

        if (!agent) {
          return {
            content: [{ type: 'text', text: 'Agent not found or not accessible' }],
            isError: true
          };
        }
        return {
          content: [{
            type: 'text',
            text: `[${agent.name}] 收到消息: "${message}"\n\n这是一个演示响应。实际集成需要连接Agent推理服务。`
          }]
        };
      }

      case 'list_agents': {
        const { data: agents } = await supabase
          .from('agents')
          .select('id, name, description, model, status')
          .eq('workspace_id', workspaceId)
          .eq('is_active', true);

        if (!agents || agents.length === 0) {
          return {
            content: [{ type: 'text', text: '当前工作空间中没有可用的Agent。' }]
          };
        }

        const agentList = agents.map(a => 
          `- ${a.name} (ID: ${a.id})\n  模型: ${a.model}\n  状态: ${a.status}`
        ).join('\n\n');

        return {
          content: [{ type: 'text', text: `可用Agent列表:\n\n${agentList}` }]
        };
      }

      case 'trigger_workflow': {
        const { workflow_id, inputs = {} } = args as { workflow_id: string; inputs?: Record<string, unknown> };

        const { data: workflow } = await supabase
          .from('workflows')
          .select('id, name, status')
          .eq('id', workflow_id)
          .eq('workspace_id', workspaceId)
          .single();

        if (!workflow) {
          return {
            content: [{ type: 'text', text: 'Workflow not found or not accessible' }],
            isError: true
          };
        }

        if (workflow.status !== 'active') {
          return {
            content: [{ type: 'text', text: `Workflow "${workflow.name}" is not active` }],
            isError: true
          };
        }

        const { data: run, error } = await supabase
          .from('workflow_runs')
          .insert({
            workflow_id,
            workspace_id: workspaceId,
            status: 'pending',
            trigger_type: 'mcp',
            input_data: inputs
          })
          .select('id')
          .single();

        if (error || !run) {
          return {
            content: [{ type: 'text', text: `Failed to trigger workflow: ${error?.message}` }],
            isError: true
          };
        }

        return {
          content: [{
            type: 'text',
            text: `Workflow "${workflow.name}" triggered successfully.\nRun ID: ${run.id}`
          }]
        };
      }

      case 'get_workflow_status': {
        const { run_id } = args as { run_id: string };

        const { data: run } = await supabase
          .from('workflow_runs')
          .select('id, status, output_data, error_message, started_at, completed_at')
          .eq('id', run_id)
          .eq('workspace_id', workspaceId)
          .single();

        if (!run) {
          return {
            content: [{ type: 'text', text: 'Workflow run not found' }],
            isError: true
          };
        }

        let statusText = `运行ID: ${run.id}\n状态: ${run.status}`;
        if (run.started_at) statusText += `\n开始时间: ${run.started_at}`;
        if (run.completed_at) statusText += `\n完成时间: ${run.completed_at}`;
        if (run.output_data) statusText += `\n输出: ${JSON.stringify(run.output_data, null, 2)}`;
        if (run.error_message) statusText += `\n错误: ${run.error_message}`;

        return {
          content: [{ type: 'text', text: statusText }]
        };
      }

      case 'knowledge_search': {
        const { agent_id, query, top_k = 5 } = args as { agent_id: string; query: string; top_k?: number };

        const { data: agent } = await supabase
          .from('agents')
          .select('id')
          .eq('id', agent_id)
          .eq('workspace_id', workspaceId)
          .single();

        if (!agent) {
          return {
            content: [{ type: 'text', text: 'Agent not found or not accessible' }],
            isError: true
          };
        }

        return {
          content: [{
            type: 'text',
            text: `搜索查询: "${query}"\nAgent: ${agent_id}\nTop-K: ${top_k}\n\n这是一个演示响应。实际搜索功能需要集成GraphRAG知识图谱。`
          }]
        };
      }

      case 'get_session_history': {
        const { session_id, limit = 50 } = args as { session_id: string; limit?: number };

        const { data: messages } = await supabase
          .from('chat_messages')
          .select('role, content, created_at')
          .eq('session_id', session_id)
          .order('created_at', { ascending: true })
          .limit(limit);

        if (!messages || messages.length === 0) {
          return {
            content: [{ type: 'text', text: 'No messages found in this session.' }]
          };
        }

        const history = messages.map(m => 
          `[${m.role}] ${m.content}`
        ).join('\n\n');

        return {
          content: [{ type: 'text', text: `会话历史:\n\n${history}` }]
        };
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${toolName}` }],
          isError: true
        };
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error executing tool: ${String(error)}` }],
      isError: true
    };
  }
}

export async function readMcpResource(uri: string): Promise<{ content: string; mimeType: string } | null> {
  switch (uri) {
    case 'agentos://docs/api':
      return {
        content: `# AgentOS API Documentation

## Overview
AgentOS provides a comprehensive API for integrating AI agents into your applications.

## Authentication
All API requests require an API key passed in the Authorization header:
\`\`\`
Authorization: Bearer sk-your-api-key
\`\`\`

## Rate Limiting
- Default: 60 requests per minute per API key
- Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

## Endpoints

### Agent Chat
\`POST /api/v1/agents/{agent_id}/chat\`

Send a message to an agent and receive a response.

### List Agents
\`GET /api/v1/agents\`

List all agents in your workspace.

### Trigger Workflow
\`POST /api/v1/workflows/{workflow_id}/trigger\`

Trigger a workflow execution asynchronously.

## MCP Integration
AgentOS supports the Model Context Protocol (MCP) for seamless integration with Claude Desktop and Cursor.
`,
        mimeType: 'text/markdown'
      };

    case 'agentos://docs/mcp':
      return {
        content: `# MCP Integration Guide

## What is MCP?
Model Context Protocol (MCP) is an open protocol for connecting AI assistants to external tools and data sources.

## Setting up MCP with AgentOS

### 1. Get your MCP Token
Go to Developer Portal → MCP Tokens and generate a new token.

### 2. Configure Claude Desktop

Add to your Claude Desktop config (~/Library/Application Support/Claude/claude_desktop_config.json on macOS):

\`\`\`json
{
  "mcpServers": {
    "starfrom-agentos": {
      "command": "npx",
      "args": ["-y", "@starfrom/agentos-mcp@latest"],
      "env": {
        "AGENTOS_MCP_TOKEN": "your-mcp-token-here",
        "AGENTOS_WORKSPACE_ID": "your-workspace-id"
      }
    }
  }
}
\`\`\`

### 3. Configure Cursor

In Cursor Settings → MCP, add a new server:
- Name: StarFrom AgentOS
- Type: Command
- Command: \`npx -y @starfrom/agentos-mcp@latest\`
- Environment: Add AGENTOS_MCP_TOKEN and AGENTOS_WORKSPACE_ID

### 4. Available Tools

Once connected, you can use these tools:

- \`agent_chat\` - Chat with your agents
- \`list_agents\` - List available agents
- \`trigger_workflow\` - Trigger workflows
- \`get_workflow_status\` - Check workflow status
- \`knowledge_search\` - Search knowledge base
- \`get_session_history\` - Get chat history

## Security

MCP tokens are hashed and only shown once at creation. Keep them secure!
`,
        mimeType: 'text/markdown'
      };

    default:
      return null;
  }
}
