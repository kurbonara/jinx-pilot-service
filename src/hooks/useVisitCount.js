import { useEffect, useState } from "react";

const SESSION_KEY = "jinx-visit-counted";
let request = null; // shared so React StrictMode's double effect doesn't count twice

function alreadyCounted() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function fetchCount() {
  if (request) return request;
  // one visit per browser session; skip automated browsers
  const count = !alreadyCounted() && !navigator.webdriver;
  request = fetch("/api/visits", { method: count ? "POST" : "GET" })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || typeof data.count !== "number") return null;
      if (count) {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* private mode: may count again next load, that's fine */
        }
      }
      return data.count;
    })
    .catch(() => null);
  return request;
}

/** Total site visits, or null while loading / if the counter isn't set up. */
export function useVisitCount() {
  const [count, setCount] = useState(null);
  useEffect(() => {
    let alive = true;
    fetchCount().then((n) => alive && setCount(n));
    return () => {
      alive = false;
    };
  }, []);
  return count;
}
