'use client'

import dynamic from 'next/dynamic'

const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'StarFrom AgentOS API',
    version: '1.0.0',
    description: 'StarFrom AgentOS 开放API - 通过API与您的智能体交互、管理知识库、触发工作流',
    contact: {
      name: 'StarFrom Support',
      email: 'support@starfrom.ai'
    }
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1 端点'
    }
  ],
  security: [
    {
      bearerAuth: []
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'API Key',
        description: '在请求头中使用: Authorization: Bearer sk-xxxxxxxx'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      },
      ChatMessage: {
        type: 'object',
        properties: {
          message: { type: 'string', description: '用户消息内容' },
          session_id: { type: 'string', description: '会话ID（可选）' }
        },
        required: ['message']
      },
      ChatResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              message: { type: 'string', description: 'Agent回复内容' },
              session_id: { type: 'string' },
              agent_id: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' }
            }
          }
        }
      },
      WorkflowTrigger: {
        type: 'object',
        properties: {
          inputs: { type: 'object', description: '工作流输入参数' },
          callback_url: { type: 'string', description: '回调URL（可选）' }
        }
      },
      WebhookConfig: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Webhook名称' },
          url: { type: 'string', format: 'uri', description: '接收事件的URL' },
          events: { type: 'array', items: { type: 'string' }, description: '订阅的事件类型' },
          secret: { type: 'string', description: '签名密钥（可选）' }
        },
        required: ['name', 'url', 'events']
      }
    }
  },
  paths: {
    '/agents/{agent_id}/chat': {
      post: {
        summary: '与Agent对话',
        description: '发送消息给指定的Agent，获取AI回复',
        tags: ['Agent'],
        parameters: [
          {
            name: 'agent_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Agent ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChatMessage' }
            }
          }
        },
        responses: {
          '200': {
            description: '成功响应',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ChatResponse' }
              }
            }
          },
          '401': {
            description: '认证失败',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          '429': {
            description: '请求频率超限'
          }
        }
      }
    },
    '/agents/{agent_id}/knowledge': {
      get: {
        summary: '获取知识源列表',
        description: '获取指定Agent关联的所有知识源',
        tags: ['Agent'],
        parameters: [
          {
            name: 'agent_id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: '知识源列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                          type: { type: 'string' },
                          status: { type: 'string' },
                          document_count: { type: 'integer' },
                          created_at: { type: 'string', format: 'date-time' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: '添加知识源',
        description: '为Agent添加新的知识源（需要write权限）',
        tags: ['Agent'],
        parameters: [
          {
            name: 'agent_id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string', enum: ['document', 'website', 'api'] },
                  content: { type: 'string', description: '知识内容或URL' }
                },
                required: ['name', 'type', 'content']
              }
            }
          }
        },
        responses: {
          '201': {
            description: '创建成功'
          },
          '403': {
            description: '权限不足（需要write scope）'
          }
        }
      }
    },
    '/workflows/{workflow_id}/trigger': {
      post: {
        summary: '触发工作流',
        description: '异步触发工作流执行（需要write权限）',
        tags: ['Workflow'],
        parameters: [
          {
            name: 'workflow_id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WorkflowTrigger' }
            }
          }
        },
        responses: {
          '201': {
            description: '触发成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        run_id: { type: 'string' },
                        status: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/webhooks': {
      get: {
        summary: '列出Webhook',
        description: '获取所有配置的Webhook',
        tags: ['Webhook'],
        responses: {
          '200': {
            description: 'Webhook列表'
          }
        }
      },
      post: {
        summary: '创建Webhook',
        description: '配置新的Webhook接收事件通知（需要write权限）',
        tags: ['Webhook'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WebhookConfig' }
            }
          }
        },
        responses: {
          '201': {
            description: '创建成功'
          }
        }
      },
      delete: {
        summary: '删除Webhook',
        description: '删除指定的Webhook（需要write权限）',
        tags: ['Webhook'],
        parameters: [
          {
            name: 'id',
            in: 'query',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: '删除成功'
          }
        }
      }
    },
    '/sessions/{session_id}': {
      get: {
        summary: '获取会话信息',
        description: '获取指定会话的详细信息',
        tags: ['Session'],
        parameters: [
          {
            name: 'session_id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: '会话信息'
          },
          '404': {
            description: '会话不存在'
          }
        }
      },
      delete: {
        summary: '删除会话',
        description: '删除会话及其所有消息（需要write权限）',
        tags: ['Session'],
        parameters: [
          {
            name: 'session_id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: '删除成功'
          }
        }
      }
    },
    '/sessions/{session_id}/messages': {
      get: {
        summary: '获取会话消息',
        description: '分页获取会话的历史消息',
        tags: ['Session'],
        parameters: [
          {
            name: 'session_id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 50 }
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', default: 0 }
          }
        ],
        responses: {
          '200': {
            description: '消息列表'
          }
        }
      }
    }
  }
}

const ScalarReference = dynamic(
  () => import('@scalar/api-reference-react').then((mod) => mod.ApiReferenceReact),
  { ssr: false }
)

export default function ApiDocsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">API 文档</h2>
      <div style={{ height: 'calc(100vh - 120px)' }}>
        <ScalarReference
          configuration={{
            content: openApiSpec,
            theme: 'default',
            hideDownloadButton: false,
            showSidebar: true
          }}
        />
      </div>
    </div>
  )
}
