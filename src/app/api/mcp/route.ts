import { NextRequest, NextResponse } from 'next/server';
import { validateMcpToken, getMcpCapabilities, listMcpTools, listMcpResources, executeMcpTool, readMcpResource } from '@/lib/mcp/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const auth = await validateMcpToken(authHeader);

  if (!auth.success) {
    return NextResponse.json(
      { jsonrpc: '2.0', error: { code: -32001, message: auth.error?.message }, id: null },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { method, params, id } = body;

    switch (method) {
      case 'initialize': {
        return NextResponse.json({
          jsonrpc: '2.0',
          result: {
            ...getMcpCapabilities(),
            protocolVersion: params.protocolVersion || '2024-11-05'
          },
          id
        });
      }

      case 'tools/list': {
        return NextResponse.json({
          jsonrpc: '2.0',
          result: { tools: listMcpTools() },
          id
        });
      }

      case 'tools/call': {
        const { name, arguments: args } = params;
        const result = await executeMcpTool(name, args || {}, auth.workspaceId!);
        return NextResponse.json({
          jsonrpc: '2.0',
          result,
          id
        });
      }

      case 'resources/list': {
        return NextResponse.json({
          jsonrpc: '2.0',
          result: { resources: listMcpResources() },
          id
        });
      }

      case 'resources/read': {
        const { uri } = params;
        const resource = await readMcpResource(uri);
        if (!resource) {
          return NextResponse.json({
            jsonrpc: '2.0',
            error: { code: -32002, message: 'Resource not found' },
            id
          });
        }
        return NextResponse.json({
          jsonrpc: '2.0',
          result: {
            contents: [{
              uri,
              mimeType: resource.mimeType,
              text: resource.content
            }]
          },
          id
        });
      }

      default:
        return NextResponse.json({
          jsonrpc: '2.0',
          error: { code: -32601, message: `Method not found: ${method}` },
          id
        });
    }
  } catch {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32603, message: 'Internal error' },
      id: null
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const auth = await validateMcpToken(authHeader);

  if (!auth.success) {
    return NextResponse.json(
      { error: auth.error?.message },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const method = url.searchParams.get('method');

  if (method === 'tools') {
    return NextResponse.json({ tools: listMcpTools() });
  }

  if (method === 'resources') {
    return NextResponse.json({ resources: listMcpResources() });
  }

  return NextResponse.json({
    server: 'starfrom-agentos-mcp',
    version: '2.3.0',
    protocol: 'MCP 2024-11-05',
    authenticated: true,
    workspace_id: auth.workspaceId
  });
}
