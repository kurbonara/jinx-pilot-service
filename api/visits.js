/* Site visit counter — Vercel Function backed by Upstash Redis (free tier).
   GET  /api/visits  -> { count }            read only
   POST /api/visits  -> { count }            +1 visit (the site calls this once per browser session)

   Setup: Vercel dashboard → Storage → Upstash for Redis → connect to this project.
   That adds the env vars below automatically (either naming works). */

const KEY = "jinx:visits";

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redis(cfg, command) {
  const res = await fetch(`${cfg.url}/${command}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}` },
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  const { result } = await res.json();
  return Number(result) || 0;
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

async function handle(command) {
  const cfg = redisConfig();
  if (!cfg) return json({ error: "Visit counter storage is not connected" }, 503);
  try {
    return json({ count: await redis(cfg, `${command}/${KEY}`) });
  } catch {
    return json({ error: "Counter unavailable" }, 502);
  }
}

export const GET = () => handle("get");
export const POST = () => handle("incr");
