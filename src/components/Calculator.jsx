import { useMemo, useRef, useState } from "react";
import {
  ANY_HERO_DISCOUNT,
  MAX_STARS,
  clamp,
  costBetween,
  fromIndex,
  indexToLabel,
  peso,
  rateAt,
  starsForBudget,
  toIndex,
} from "../lib/pricing.js";
import RankPicker from "./calculator/RankPicker.jsx";
import SpamOptions from "./calculator/SpamOptions.jsx";
import Summary from "./calculator/Summary.jsx";
import StickyTotal from "./calculator/StickyTotal.jsx";
import { downloadOrderPng } from "../lib/orderImage.js";
import { useTheme } from "../theme/ThemeContext.jsx";
import { themeImage } from "../themes.js";

const fmt = (n) => n.toLocaleString("en-PH");

const HEROES = [
  { key: "kagura", title: "Kagura only", desc: "Signature hero · standard rates" },
  { key: "any", title: "Any hero", desc: `Pilot picks the hero · −₱${ANY_HERO_DISCOUNT} per star` },
];

const MODES = [
  { key: "goal", title: "Rank goal", desc: "Push to a target rank" },
  { key: "spam", title: "Spam pilot", desc: "No star goal — play as much as you want" },
];

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch {
      /* ignore */
    }
    ta.remove();
  }
}

export default function Calculator({ onToast }) {
  const [mode, setMode] = useState("goal");
  const [current, setCurrent] = useState({ tier: "epic", div: 0, stars: 0, mStars: 0 });
  const [target, setTarget] = useState({ tier: "mythic", div: 0, stars: 0, mStars: 0 });
  const [spamBy, setSpamBy] = useState("stars");
  const [spamStars, setSpamStars] = useState("10");
  const [budget, setBudget] = useState("1000");
  const [hero, setHero] = useState("kagura");
  const off = hero === "any" ? ANY_HERO_DISCOUNT : 0;

  const { theme, artLoaded } = useTheme();
  const sectionRef = useRef(null);
  const summaryRef = useRef(null);

  // keep the target ahead of the current rank
  const changeCurrent = (next) => {
    setCurrent(next);
    const c = toIndex(next);
    if (toIndex(target) <= c) setTarget(fromIndex(c + 5, target));
  };

  const quote = useMemo(() => {
    const goal = mode === "goal";
    const a = toIndex(current);
    let end;
    let error = "";
    let res;

    if (goal) {
      end = toIndex(target);
      if (end <= a) {
        error = "Target rank must be higher than your current rank.";
        res = { lines: [], total: 0, stars: 0 };
      } else res = costBetween(a, end, off);
    } else if (spamBy === "stars") {
      end = a + clamp(parseInt(spamStars, 10) || 0, 0, MAX_STARS);
      res = costBetween(a, end, off);
    } else {
      const n = starsForBudget(a, Math.max(0, parseInt(budget, 10) || 0), off);
      end = a + n;
      res = costBetween(a, end, off);
      if (n === 0) error = `Budget is below one star (${peso(rateAt(a, off))} at your rank).`;
    }

    const heroLabel = off ? "Any hero" : "Kagura";
    const saved = res.stars * off;
    const from = indexToLabel(a);
    const to = res.stars ? (goal ? "" : "≈ ") + indexToLabel(end) : "—";
    const orderText = [
      "JINX PILOT SERVICE — ORDER",
      `Service: ${goal ? "Rank goal" : "Spam pilot (no star goal)"}`,
      `Hero: ${off ? `Any hero (−₱${off} per star)` : "Kagura (signature)"}`,
      `Current rank: ${from}`,
      goal ? `Target rank: ${indexToLabel(end)}` : `Estimate: ${fmt(res.stars)} stars (≈ ${indexToLabel(end)})`,
      ...res.lines.map((l) => `• ${l.name}: ${fmt(l.stars)}★ × ${peso(l.rate)} = ${peso(l.sub)}`),
      `TOTAL: ${peso(res.total)}${goal ? "" : " (estimate — billed per star gained)"}`,
      ...(saved ? [`Any-hero discount: you save ${peso(saved)}`] : []),
    ].join("\n");

    return {
      ...res,
      error,
      from,
      to,
      label: goal ? "Estimated total" : spamBy === "budget" ? "Spam pilot · budget" : "Spam pilot · estimate",
      toLabel: goal ? "Target" : "Could reach",
      sub: res.stars
        ? `${fmt(res.stars)} star${res.stars > 1 ? "s" : ""}${goal ? "" : " · billed per star gained"}${saved ? ` · you save ${peso(saved)}` : ""}`
        : "Pick your ranks to see the price",
      orderText,
      goal,
      service: `${goal ? "Rank goal" : "Spam pilot · no star goal"} · ${heroLabel}`,
      heroLabel,
      saved,
      toFull: indexToLabel(end),
    };
  }, [mode, current, target, spamBy, spamStars, budget, off]);

  const handleCopy = async () => {
    await copyText(quote.orderText);
    onToast("Order copied — paste it in your message to JINX");
  };

  const [saving, setSaving] = useState(false);
  const handleSavePng = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const now = new Date();
      const result = await downloadOrderPng({
        theme,
        themeImage: artLoaded(theme) ? themeImage(theme) : null,
        goal: quote.goal,
        service: quote.service,
        from: quote.from,
        toLabel: quote.goal ? "Target" : "Could reach",
        to: (quote.goal ? "" : "≈ ") + quote.toFull,
        lines: quote.lines,
        total: quote.total,
        stars: quote.stars,
        saved: quote.saved,
        date: now.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }),
        ref: "JX" + now.getTime().toString(36).slice(-6).toUpperCase(),
      });
      if (result === "downloaded") onToast("Order saved as PNG — send it to JINX");
    } catch {
      onToast("Couldn't create the image — try Copy order details instead");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section section-calc" id="calculator" ref={sectionRef}>
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Price calculator</p>
          <h2>Know your total in seconds</h2>
        </div>

        <div className="calc">
          <div className="calc-main">
            <div className="mode-toggle" role="tablist" aria-label="Service type">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  role="tab"
                  aria-selected={mode === m.key}
                  className={"mode-btn" + (mode === m.key ? " is-active" : "")}
                  onClick={() => setMode(m.key)}
                >
                  <strong>{m.title}</strong>
                  <span>{m.desc}</span>
                </button>
              ))}
            </div>

            <p className="field-label">Pilot's hero</p>
            <div className="mode-toggle hero-toggle" role="radiogroup" aria-label="Pilot's hero">
              {HEROES.map((h) => (
                <button
                  key={h.key}
                  type="button"
                  role="radio"
                  aria-checked={hero === h.key}
                  className={"mode-btn" + (hero === h.key ? " is-active" : "")}
                  onClick={() => setHero(h.key)}
                >
                  <strong>
                    {h.title}
                    {h.key === "any" && <em className="save-tag">−₱{ANY_HERO_DISCOUNT}/★</em>}
                  </strong>
                  <span>{h.desc}</span>
                </button>
              ))}
            </div>

            <fieldset className="panel">
              <legend className="panel-title">
                <span className="step">1</span> Current rank
              </legend>
              <RankPicker id="current" value={current} onChange={changeCurrent} off={off} />
            </fieldset>

            {mode === "goal" ? (
              <fieldset className="panel">
                <legend className="panel-title">
                  <span className="step">2</span> Target rank
                </legend>
                <RankPicker id="target" value={target} onChange={setTarget} off={off} />
              </fieldset>
            ) : (
              <fieldset className="panel">
                <legend className="panel-title">
                  <span className="step">2</span> Spam pilot
                </legend>
                <SpamOptions
                  by={spamBy}
                  onBy={setSpamBy}
                  starsText={spamStars}
                  onStars={setSpamStars}
                  budgetText={budget}
                  onBudget={setBudget}
                />
              </fieldset>
            )}
          </div>

          <Summary ref={summaryRef} quote={quote} onCopy={handleCopy} onSavePng={handleSavePng} saving={saving} />
        </div>
      </div>

      <StickyTotal
        sectionRef={sectionRef}
        summaryRef={summaryRef}
        total={quote.total}
        stars={quote.stars}
        onCopy={handleCopy}
      />
    </section>
  );
}
