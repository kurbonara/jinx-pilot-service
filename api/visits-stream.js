/* Live visit count — Server-Sent Events.
   GET /api/visits-stream  ->  text/event-stream, one "data: <count>" event per change.

   How it works: subscribes to the Upstash channel that /api/visits publishes to on every
   new visit, and forwards each new total to the browser immediately.
   Each connection ends after ~50s (serverless time limit); the browser's EventSource
   reconnects automatically. If the subscription can't be opened, it falls back to
   checking Redis every 2 seconds for the rest of the connection. */

import { CHANNEL, getCount, redisConfig } from "./_redis.js";

const LIFETIME_MS = 50000;
const FALLBACK_POLL_MS = 2000;
const HEARTBEAT_MS = 15000;

export async function GET(request) {
  const cfg = redisConfig();
  if (!cfg) return new Response("Visit counter storage is not connected", { status: 503 });

  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const upstream = new AbortController();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      let last = null;
      const timers = [];

      const send = (text) => {
        if (!closed) controller.enqueue(enc.encode(text));
      };
      const push = (n) => {
        if (Number.isFinite(n) && n !== last) {
          last = n;
          send(`data: ${n}\n\n`);
        }
      };
      const refresh = () => getCount(cfg).then(push, () => {});
      const end = () => {
        if (closed) return;
        closed = true;
        timers.forEach((t) => clearTimeout(t) || clearInterval(t));
        upstream.abort();
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      request.signal?.addEventListener("abort", end);
      timers.push(setTimeout(end, LIFETIME_MS));
      timers.push(setInterval(() => send(": ping\n\n"), HEARTBEAT_MS)); // keeps proxies from closing it

      send("retry: 1000\n\n"); // reconnect quickly when this connection ends
      await refresh(); // current total right away

      try {
        const res = await fetch(`${cfg.url}/subscribe/${encodeURIComponent(CHANNEL)}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${cfg.token}`, Accept: "text/event-stream" },
          signal: upstream.signal,
        });
        if (!res.ok || !res.body) throw new Error(`subscribe ${res.status}`);
        send(": mode live\n\n"); // SSE comment (ignored by browsers) — handy when checking with curl

        const reader = res.body.getReader();
        let buf = "";
        while (!closed) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let nl;
          while ((nl = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, nl).trim();
            buf = buf.slice(nl + 1);
            // Upstash sends:  data: message,<channel>,<payload>
            if (!line.startsWith("data:")) continue;
            const [kind, , ...rest] = line.slice(5).trim().split(",");
            if (kind !== "message") continue;
            const n = Number(rest.join(","));
            if (Number.isFinite(n)) push(n);
            else refresh(); // unexpected payload format: just re-read the total
          }
        }
      } catch {
        /* subscription unavailable or ended — fall through to polling */
      }

      if (!closed) {
        send(": mode polling\n\n");
        timers.push(setInterval(refresh, FALLBACK_POLL_MS));
      }
    },
    cancel() {
      upstream.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    },
  });
}
