/* Site visit counter — Vercel Function backed by Upstash Redis (free tier).
   GET  /api/visits  -> { count }   read only
   POST /api/visits  -> { count }   +1 visit (the site calls this once per browser session),
                                    then broadcasts the new total to every open page
                                    (see api/visits-stream.js).
   Setup: Vercel → Storage → Upstash for Redis → connect to this project → redeploy. */

import { CHANNEL, KEY, getCount, redis, redisConfig, relatedEnvNames } from "./_redis.js";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

async function handle(increment) {
  const cfg = redisConfig();
  if (!cfg) return json({ error: "Visit counter storage is not connected", envVarsFound: relatedEnvNames() }, 503);
  try {
    if (!increment) return json({ count: await getCount(cfg) });
    const count = Number(await redis(cfg, "incr", KEY)) || 0;
    // live update for everyone watching; a failed broadcast must not fail the visit
    await redis(cfg, "publish", CHANNEL, String(count)).catch(() => {});
    return json({ count });
  } catch (e) {
    return json({ error: "Counter unavailable", detail: String(e.message || e) }, 502);
  }
}

export const GET = () => handle(false);
export const POST = () => handle(true);
