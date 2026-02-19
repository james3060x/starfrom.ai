# StarFrom AgentOS SDK

Official JavaScript/TypeScript SDK for StarFrom AgentOS API.

## Installation

```bash
npm install @starfrom/agentos-sdk
```

## Quick Start

```typescript
import { createClient } from '@starfrom/agentos-sdk';

const client = createClient({
  apiKey: 'sk-your-api-key'
});

// Chat with an agent
const response = await client.chat('agent-id', 'Hello!');
console.log(response.data.message);

// List all agents
const agents = await client.listAgents();
console.log(agents.data);

// Trigger a workflow
const run = await client.triggerWorkflow('workflow-id', { input: 'value' });
console.log(run.data.run_id);
```

## Features

- Full TypeScript support
- Promise-based API
- Automatic error handling
- Rate limit headers

## API Reference

### Chat

- `chat(agentId, message, sessionId?)` - Send a message to an agent

### Agents

- `listAgents()` - List all agents
- `getAgent(agentId)` - Get agent details
- `listKnowledgeSources(agentId)` - List agent knowledge sources
- `addKnowledgeSource(agentId, name, type, content)` - Add knowledge source

### Workflows

- `triggerWorkflow(workflowId, inputs?, callbackUrl?)` - Trigger workflow execution

### Webhooks

- `listWebhooks()` - List all webhooks
- `createWebhook(name, url, events, secret?)` - Create webhook
- `deleteWebhook(webhookId)` - Delete webhook

### Sessions

- `getSession(sessionId)` - Get session details
- `getSessionMessages(sessionId, params?)` - Get session messages
- `deleteSession(sessionId)` - Delete session

## License

MIT
