import { env } from 'cloudflare:workers';
import { analytics } from '../../../lib/site-api.mjs';

export async function POST(request: Request) {
  return analytics(request, env.DB);
}
