import { createClient } from '@supabase/supabase-js';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AuthResult {
  success: boolean;
  workspaceId?: string;
  scopes?: string[];
  error?: { code: string; message: string; status: number };
}

export async function validateApiKey(authHeader: string | null, clientIp?: string): Promise<AuthResult> {
  if (!authHeader) {
    return {
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing Authorization header', status: 401 }
    };
  }

  const match = authHeader.match(/^Bearer\s+(sk-[a-f0-9]{64})$/);
  if (!match) {
    return {
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid API key format', status: 401 }
    };
  }

  const apiKey = match[1];
  const keyHash = createHash('sha256').update(apiKey).digest('hex');

  const { data: keyRecord, error } = await supabase
    .from('api_keys')
    .select('id, workspace_id, scopes, is_active, expires_at, allowed_ips, rate_limit_rpm')
    .eq('key_hash', keyHash)
    .single();

  if (error || !keyRecord) {
    return {
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid API key', status: 401 }
    };
  }

  if (!keyRecord.is_active) {
    return {
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'API key is revoked', status: 401 }
    };
  }

  if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
    return {
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'API key has expired', status: 401 }
    };
  }

  if (keyRecord.allowed_ips?.length > 0 && clientIp) {
    if (!keyRecord.allowed_ips.includes(clientIp)) {
      return {
        success: false,
        error: { code: 'FORBIDDEN', message: 'IP not allowed', status: 403 }
      };
    }
  }

  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', keyRecord.id);

  await logApiCall(keyRecord.id, keyRecord.workspace_id, '/auth', 'GET', 200);

  return {
    success: true,
    workspaceId: keyRecord.workspace_id,
    scopes: keyRecord.scopes || ['read', 'write']
  };
}

export async function logApiCall(
  apiKeyId: string | null,
  workspaceId: string | null,
  endpoint: string,
  method: string,
  statusCode: number,
  latencyMs?: number,
  tokensUsed?: number,
  errorMessage?: string
): Promise<void> {
  try {
    await supabase.from('api_call_logs').insert({
      api_key_id: apiKeyId,
      workspace_id: workspaceId,
      endpoint,
      method,
      status_code: statusCode,
      latency_ms: latencyMs,
      tokens_used: tokensUsed,
      error_message: errorMessage
    });
  } catch {
    // Silently fail - don't block response
  }
}

export function generateApiKey(): { key: string; prefix: string; hash: string } {
  const bytes = randomBytes(32);
  const key = 'sk-' + bytes.toString('hex');
  const prefix = key.slice(0, 12);
  const hash = createHash('sha256').update(key).digest('hex');
  return { key, prefix, hash };
}

export function generateWebhookSignature(secret: string, payload: string): string {
  return 'sha256=' + createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyWebhookSignature(secret: string, payload: string, signature: string): boolean {
  const expected = generateWebhookSignature(secret, payload);
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
