import { useEffect, useState } from "react";

const SESSION_KEY = "jinx-visit-counted";
const FALLBACK_POLL_MS = 15000; // only used if live updates can't connect
let firstRequest = null; // shared so React StrictMode's double effect doesn't count twice

function alreadyCounted() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

const readCount = (method) =>
  fetch("/api/visits", { method, cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => (d && typeof d.count === "number" ? d.count : null))
    .catch(() => null);

/** First load: +1 once per browser session (skips automated browsers), otherwise just read. */
function countThisVisit() {
  if (firstRequest) return firstRequest;
  const count = !alreadyCounted() && !navigator.webdriver;
  firstRequest = readCount(count ? "POST" : "GET").then((n) => {
    if (n !== null && count) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* private mode: may count again next load, that's fine */
      }
    }
    return n;
  });
  return firstRequest;
}

/** Live total site visits (pushed from the server the moment someone visits),
    or null while loading / if the counter isn't set up. */
export function useVisitCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let alive = true;
    let source = null;
    let poll = null;
    let failures = 0;
    // never let an older value move the number backwards
    const apply = (n) => alive && Number.isFinite(n) && setCount((c) => (c === null ? n : Math.max(c, n)));

    const stopLive = () => {
      source?.close();
      source = null;
      clearInterval(poll);
      poll = null;
    };
    const startPolling = () => {
      if (!poll) poll = setInterval(() => readCount("GET").then(apply), FALLBACK_POLL_MS);
    };
    const startLive = () => {
      if (source || poll) return;
      if (typeof EventSource === "undefined") return startPolling();
      source = new EventSource("/api/visits-stream");
      source.onmessage = (e) => {
        failures = 0;
        apply(Number(e.data));
      };
      source.onerror = () => {
        // the server ends each connection every ~50s and the browser reconnects on its own;
        // only give up on live mode if it keeps failing
        if (source?.readyState === EventSource.CLOSED || ++failures >= 5) {
          source?.close();
          source = null;
          startPolling();
        }
      };
    };
    // don't hold a connection open for background tabs
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        readCount("GET").then(apply);
        startLive();
      } else stopLive();
    };

    countThisVisit().then((n) => {
      apply(n);
      if (n === null || !alive) return; // counter not set up — stay hidden, don't connect
      if (document.visibilityState === "visible") startLive();
      document.addEventListener("visibilitychange", onVisibility);
    });

    return () => {
      alive = false;
      stopLive();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return count;
}
