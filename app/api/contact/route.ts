import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { contact } from '../../../lib/site-api.mjs';

async function handle(request: Request) {
  return contact(request, env.DB, await getChatGPTUser());
}

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
