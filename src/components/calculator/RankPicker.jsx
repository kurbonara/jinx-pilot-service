import { useEffect, useState } from "react";
import { DIVS, MAX_MYTHIC, clamp, mythicTier } from "../../lib/pricing.js";
import { StarIcon } from "../Icons.jsx";
import Stepper from "./Stepper.jsx";

const tiers = (off) => [
  { key: "epic", label: "Epic", sub: `₱${50 - off}/★` },
  { key: "legend", label: "Legend", sub: `₱${50 - off}/★` },
  { key: "mythic", label: "Mythic+", sub: `₱${55 - off}–${65 - off}/★` },
];
const MYTHIC_QUICK = [
  [0, "Mythic"],
  [25, "Honor 25★"],
  [50, "Glory 50★"],
  [100, "Immortal 100★"],
  [500, "500★"],
  [1000, "1,000★"],
];

export default function RankPicker({ id, value, onChange, off = 0 }) {
  const set = (patch) => onChange({ ...value, ...patch });
  const tier = mythicTier(value.mStars);

  // local text so the field can be cleared while typing
  const [text, setText] = useState(String(value.mStars));
  useEffect(() => setText(String(value.mStars)), [value.mStars]);

  return (
    <div className="rank-picker">
      <span className="field-label">Tier</span>
      <div className="chips chips-tier">
        {tiers(off).map((t) => (
          <button
            key={t.key}
            type="button"
            className={"chip" + (value.tier === t.key ? " is-active" : "")}
            aria-pressed={value.tier === t.key}
            onClick={() => set({ tier: t.key })}
          >
            {t.label}
            <span className="chip-sub">{t.sub}</span>
          </button>
        ))}
      </div>

      {value.tier !== "mythic" ? (
        <div>
          <span className="field-label">Division</span>
          <div className="chips">
            {DIVS.map((d, i) => (
              <button
                key={d}
                type="button"
                className={"chip" + (value.div === i ? " is-active" : "")}
                aria-pressed={value.div === i}
                onClick={() => set({ div: i })}
              >
                {d}
              </button>
            ))}
          </div>
          <span className="field-label">Stars</span>
          <div className="stars-row">
            <button
              type="button"
              className={"star-btn star-zero" + (value.stars === 0 ? " is-on" : "")}
              onClick={() => set({ stars: 0 })}
            >
              0★
            </button>
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                type="button"
                className={"star-btn" + (s <= value.stars ? " is-on" : "")}
                aria-label={`${s} star${s > 1 ? "s" : ""}`}
                aria-pressed={value.stars === s}
                onClick={() => set({ stars: s })}
              >
                <StarIcon />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className="field-label" htmlFor={`${id}-mstars`}>
            Mythic stars
          </label>
          <div className="mythic-row">
            <Stepper
              id={`${id}-mstars`}
              value={text}
              min={0}
              max={MAX_MYTHIC}
              onStep={(d) => set({ mStars: clamp(value.mStars + d, 0, MAX_MYTHIC) })}
              onInput={(v) => {
                setText(v);
                const n = parseInt(v, 10);
                set({ mStars: clamp(isNaN(n) ? 0 : n, 0, MAX_MYTHIC) });
              }}
              onBlur={() => setText(String(value.mStars))}
              label="star"
            />
            <span className="mythic-badge" data-tier={tier.key}>
              {tier.name}
            </span>
          </div>
          <div className="quick">
            {MYTHIC_QUICK.map(([n, label]) => (
              <button key={n} type="button" onClick={() => set({ mStars: n })}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
