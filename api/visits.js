/* Site visit counter — Vercel Function backed by Upstash Redis (free tier).
   GET  /api/visits  -> { count }            read only
   POST /api/visits  -> { count }            +1 visit (the site calls this once per browser session)

   Setup: Vercel dashboard → Storage → Upstash for Redis → connect to this project → redeploy.
   Connecting adds the database's env vars to the project. Any of the names Upstash uses work:
     KV_REST_API_URL + KV_REST_API_TOKEN            (Vercel default)
     UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
     <PREFIX>_REST_API_URL + <PREFIX>_REST_API_TOKEN (if a custom prefix was chosen)
     REDIS_URL / KV_URL (rediss://default:<token>@<host>:6379) as a last resort */

const KEY = "jinx:visits";
const env = process.env;

function fromRedisUrl(value) {
  try {
    const u = new URL(value);
    if (!u.password || !u.hostname) return null;
    return { url: `https://${u.hostname}`, token: decodeURIComponent(u.password) };
  } catch {
    return null;
  }
}

function redisConfig() {
  const names = Object.keys(env);
  const pick = (suffix) => names.find((n) => n.endsWith(suffix) && env[n]);

  // 1) REST URL + token pairs (default names first, then any prefix)
  const pairs = [
    ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
    ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  ];
  const urlName = pick("_REST_API_URL");
  if (urlName) pairs.push([urlName, urlName.replace(/_URL$/, "_TOKEN")]);
  const upName = pick("_REDIS_REST_URL");
  if (upName) pairs.push([upName, upName.replace(/_URL$/, "_TOKEN")]);

  for (const [u, t] of pairs) {
    if (env[u] && env[t]) return { url: env[u].replace(/\/$/, ""), token: env[t] };
  }

  // 2) redis connection string
  const conn = env.REDIS_URL || env.KV_URL || env[pick("_REDIS_URL")] || env[pick("_KV_URL")];
  return conn ? fromRedisUrl(conn) : null;
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
  if (!cfg) {
    // names only (never values) to help debug the setup
    const seen = Object.keys(env).filter((n) => /KV|REDIS|UPSTASH/i.test(n));
    return json({ error: "Visit counter storage is not connected", envVarsFound: seen }, 503);
  }
  try {
    return json({ count: await redis(cfg, `${command}/${KEY}`) });
  } catch (e) {
    return json({ error: "Counter unavailable", detail: String(e.message || e) }, 502);
  }
}

export const GET = () => handle("get");
export const POST = () => handle("incr");
