import { createHash, randomBytes } from 'crypto';

export function generateMcpToken(): { token: string; prefix: string; hash: string } {
  const bytes = randomBytes(32);
  const token = 'mcp-' + bytes.toString('hex');
  const prefix = token.slice(0, 12);
  const hash = createHash('sha256').update(token).digest('hex');
  return { token, prefix, hash };
}
