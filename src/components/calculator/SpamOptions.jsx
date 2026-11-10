import { MAX_STARS, clamp } from "../../lib/pricing.js";
import Stepper from "./Stepper.jsx";

const STAR_QUICK = [10, 50, 100, 500, 1000];
const BUDGET_QUICK = [500, 1000, 2000, 5000];

export default function SpamOptions({ by, onBy, starsText, onStars, budgetText, onBudget }) {
  return (
    <>
      <p className="muted small">
        No fixed goal — the pilot plays and you pay per star gained, at each bracket's rate. Estimate by stars, or set a
        budget and see how far it goes.
      </p>
      <div className="seg" role="radiogroup" aria-label="Estimate by">
        {[
          ["stars", "By stars"],
          ["budget", "By budget"],
        ].map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={by === k}
            className={"seg-btn" + (by === k ? " is-active" : "")}
            onClick={() => onBy(k)}
          >
            {label}
          </button>
        ))}
      </div>

      {by === "stars" ? (
        <div className="spam-field">
          <label htmlFor="spam-stars">Estimated stars to gain</label>
          <Stepper
            id="spam-stars"
            value={starsText}
            min={1}
            max={MAX_STARS}
            label="star"
            onStep={(d) => onStars(String(clamp((parseInt(starsText, 10) || 0) + d, 1, MAX_STARS)))}
            onInput={onStars}
            onBlur={() => onStars(String(clamp(parseInt(starsText, 10) || 1, 1, MAX_STARS)))}
          />
          <div className="quick">
            {STAR_QUICK.map((n) => (
              <button key={n} type="button" onClick={() => onStars(String(n))}>
                {n.toLocaleString("en-PH")}★
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="spam-field">
          <label htmlFor="spam-budget">Your budget (₱)</label>
          <div className="money-input">
            <span>₱</span>
            <input
              id="spam-budget"
              type="number"
              inputMode="numeric"
              min={0}
              step={50}
              value={budgetText}
              onChange={(e) => onBudget(e.target.value)}
            />
          </div>
          <div className="quick">
            {BUDGET_QUICK.map((n) => (
              <button key={n} type="button" onClick={() => onBudget(String(n))}>
                ₱{n.toLocaleString("en-PH")}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
