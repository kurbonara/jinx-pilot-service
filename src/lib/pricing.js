/* ---- Rates (₱ per star) ----
   Global star index:
     0–49    Epic V → Legend I (10 divisions × 5 stars)
     50–99   Mythic 0–24 + Mythical Honor 25–49
     100–149 Mythical Glory 50–99
     150+    Mythical Immortal 100+                       */
export const MYTHIC_BASE = 50;
// Sanity guards only (not real limits) — clients can order 1k+ stars.
export const MAX_MYTHIC = 99999;
export const MAX_STARS = 99999;
export const DIVS = ["V", "IV", "III", "II", "I"];

/** ₱ off every per-star rate when the client lets the pilot use any hero (not Kagura only). */
export const ANY_HERO_DISCOUNT = 10;

export const BRACKETS = [
  { from: 0, to: 50, rate: 50, name: "Epic → Mythic", note: "Epic & Legend divisions" },
  { from: 50, to: 100, rate: 55, name: "Mythic → Mythical Glory", note: "Mythic & Mythical Honor · 0–49★" },
  { from: 100, to: 150, rate: 60, name: "Mythical Glory → Immortal", note: "Mythical Glory · 50–99★" },
  { from: 150, to: Infinity, rate: 65, name: "Immortal & up", note: "Mythical Immortal · 100★+" },
];

export const peso = (n) => "₱" + Math.round(n).toLocaleString("en-PH");
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const rateAt = (g, off = 0) => BRACKETS.find((b) => g >= b.from && g < b.to).rate - off;

export function mythicTier(stars) {
  if (stars >= 100) return { key: "immortal", name: "Mythical Immortal" };
  if (stars >= 50) return { key: "glory", name: "Mythical Glory" };
  if (stars >= 25) return { key: "honor", name: "Mythical Honor" };
  return { key: "mythic", name: "Mythic" };
}

/** rank = { tier: "epic" | "legend" | "mythic" | null, div: 0-4 | null, stars: 0-4 | null, mStars: number | null }
    (null = not picked yet; the calculator starts empty) */
export const EMPTY_RANK = { tier: null, div: null, stars: null, mStars: null };

export function isRankComplete(r) {
  if (!r || !r.tier) return false;
  return r.tier === "mythic" ? r.mStars !== null : r.div !== null && r.stars !== null;
}

export function toIndex(r) {
  if (r.tier === "epic") return r.div * 5 + r.stars;
  if (r.tier === "legend") return 25 + r.div * 5 + r.stars;
  return MYTHIC_BASE + r.mStars;
}

export function fromIndex(g, base = {}) {
  if (g >= MYTHIC_BASE) return { ...base, tier: "mythic", mStars: Math.min(g - MYTHIC_BASE, MAX_MYTHIC) };
  const legend = g >= 25;
  const x = legend ? g - 25 : g;
  return { ...base, tier: legend ? "legend" : "epic", div: Math.floor(x / 5), stars: x % 5 };
}

export function indexToLabel(g) {
  if (g < 25) return `Epic ${DIVS[Math.floor(g / 5)]} · ${g % 5}★`;
  if (g < 50) {
    const x = g - 25;
    return `Legend ${DIVS[Math.floor(x / 5)]} · ${x % 5}★`;
  }
  const m = g - MYTHIC_BASE;
  return `${mythicTier(m).name} · ${m.toLocaleString("en-PH")}★`;
}

/** cost between two indexes, grouped by bracket. `off` = ₱ discount per star */
export function costBetween(a, b, off = 0) {
  const lines = [];
  let total = 0;
  for (const br of BRACKETS) {
    const lo = Math.max(a, br.from);
    const hi = Math.min(b, br.to);
    if (hi > lo) {
      const n = hi - lo;
      const rate = br.rate - off;
      lines.push({ name: br.name, stars: n, rate, sub: n * rate });
      total += n * rate;
    }
  }
  return { lines, total, stars: Math.max(0, b - a) };
}

/** how many stars a budget buys starting from index a */
export function starsForBudget(a, budget, off = 0) {
  let g = a;
  let left = budget;
  for (const br of BRACKETS) {
    if (g >= br.to) continue;
    const room = br.to - g; // stars left in this bracket (Infinity for the last one)
    const rate = br.rate - off;
    const afford = Math.floor(left / rate);
    const n = Math.min(room, afford);
    g += n;
    left -= n * rate;
    if (n < room) break;
  }
  return Math.min(g - a, MAX_STARS);
}
