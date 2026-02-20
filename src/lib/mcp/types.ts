import { z } from 'zod';

export const McpToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.object({
    type: z.literal('object'),
    properties: z.record(z.string(), z.any()),
    required: z.array(z.string()).optional()
  })
});

export const McpResourceSchema = z.object({
  uri: z.string(),
  name: z.string(),
  description: z.string().optional(),
  mimeType: z.string().optional()
});

export const McpCallToolRequestSchema = z.object({
  name: z.string(),
  arguments: z.record(z.string(), z.any()).optional()
});

export type McpTool = z.infer<typeof McpToolSchema>;
export type McpResource = z.infer<typeof McpResourceSchema>;
export type McpCallToolRequest = z.infer<typeof McpCallToolRequestSchema>;

export const AGENTOS_TOOLS: McpTool[] = [
  {
    name: 'agent_chat',
    description: '与指定的AI Agent进行对话，获取智能回复',
    inputSchema: {
      type: 'object',
      properties: {
        agent_id: {
          type: 'string',
          description: 'Agent的唯一标识符'
        },
        message: {
          type: 'string',
          description: '要发送给用户的消息内容'
        },
        session_id: {
          type: 'string',
          description: '会话ID（可选，用于保持对话上下文）'
        }
      },
      required: ['agent_id', 'message']
    }
  },
  {
    name: 'list_agents',
    description: '获取工作空间中所有可用的Agent列表',
    inputSchema: {
      type: 'object',
      properties: {
        workspace_id: {
          type: 'string',
          description: '工作空间ID'
        }
      },
      required: ['workspace_id']
    }
  },
  {
    name: 'trigger_workflow',
    description: '触发指定的工作流执行',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: {
          type: 'string',
          description: '工作流ID'
        },
        inputs: {
          type: 'object',
          description: '工作流输入参数（JSON对象）'
        }
      },
      required: ['workflow_id']
    }
  },
  {
    name: 'get_workflow_status',
    description: '获取工作流执行状态和结果',
    inputSchema: {
      type: 'object',
      properties: {
        run_id: {
          type: 'string',
          description: '工作流运行ID'
        }
      },
      required: ['run_id']
    }
  },
  {
    name: 'knowledge_search',
    description: '在知识库中搜索相关信息',
    inputSchema: {
      type: 'object',
      properties: {
        agent_id: {
          type: 'string',
          description: 'Agent ID（指定搜索范围）'
        },
        query: {
          type: 'string',
          description: '搜索查询'
        },
        top_k: {
          type: 'number',
          description: '返回结果数量（默认5）'
        }
      },
      required: ['agent_id', 'query']
    }
  },
  {
    name: 'get_session_history',
    description: '获取会话历史消息',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: '会话ID'
        },
        limit: {
          type: 'number',
          description: '返回消息数量（默认50）'
        }
      },
      required: ['session_id']
    }
  },
  {
    name: 'create_session',
    description: '创建一个新的对话会话',
    inputSchema: {
      type: 'object',
      properties: {
        agent_id: {
          type: 'string',
          description: 'Agent ID'
        },
        title: {
          type: 'string',
          description: '会话标题（可选）'
        }
      },
      required: ['agent_id']
    }
  },
  {
    name: 'list_sessions',
    description: '列出Agent的所有会话',
    inputSchema: {
      type: 'object',
      properties: {
        agent_id: {
          type: 'string',
          description: 'Agent ID'
        },
        limit: {
          type: 'number',
          description: '返回会话数量（默认20）'
        }
      },
      required: ['agent_id']
    }
  },
  {
    name: 'search_knowledge_base',
    description: '直接搜索知识库内容',
    inputSchema: {
      type: 'object',
      properties: {
        knowledge_base_id: {
          type: 'string',
          description: '知识库ID'
        },
        query: {
          type: 'string',
          description: '搜索查询'
        },
        limit: {
          type: 'number',
          description: '返回结果数量（默认10）'
        }
      },
      required: ['knowledge_base_id', 'query']
    }
  },
  {
    name: 'list_knowledge_bases',
    description: '列出工作空间中的所有知识库',
    inputSchema: {
      type: 'object',
      properties: {
        workspace_id: {
          type: 'string',
          description: '工作空间ID'
        }
      },
      required: ['workspace_id']
    }
  }
];

export const AGENTOS_RESOURCES: McpResource[] = [
  {
    uri: 'agentos://docs/api',
    name: 'API文档',
    description: 'AgentOS API完整文档',
    mimeType: 'text/markdown'
  },
  {
    uri: 'agentos://docs/mcp',
    name: 'MCP集成指南',
    description: '如何将AgentOS与Claude/Cursor集成',
    mimeType: 'text/markdown'
  }
];
