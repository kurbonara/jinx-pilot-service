/* Shared Upstash Redis helpers for the visit counter.
   Files starting with "_" in /api are not exposed as endpoints on Vercel.

   Env vars are added by Vercel when the Upstash database is connected to the project.
   Any of the names Upstash uses work:
     KV_REST_API_URL + KV_REST_API_TOKEN            (Vercel default)
     UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
     <PREFIX>_REST_API_URL + <PREFIX>_REST_API_TOKEN (custom prefix)
     REDIS_URL / KV_URL (rediss://default:<token>@<host>:6379) as a last resort */

export const KEY = "jinx:visits";
export const CHANNEL = "jinx:visits:live";

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

export function redisConfig() {
  const names = Object.keys(env);
  const pick = (suffix) => names.find((n) => n.endsWith(suffix) && env[n]);

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

  const conn = env.REDIS_URL || env.KV_URL || env[pick("_REDIS_URL")] || env[pick("_KV_URL")];
  return conn ? fromRedisUrl(conn) : null;
}

/** Run one Redis command over Upstash REST, e.g. redis(cfg, "incr", KEY). */
export async function redis(cfg, ...args) {
  const res = await fetch(`${cfg.url}/${args.map(encodeURIComponent).join("/")}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}` },
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  return (await res.json()).result;
}

export const getCount = async (cfg) => Number(await redis(cfg, "get", KEY)) || 0;

/** Env var names (never values) related to the database, to help debug setup. */
export const relatedEnvNames = () => Object.keys(env).filter((n) => /KV|REDIS|UPSTASH/i.test(n));
