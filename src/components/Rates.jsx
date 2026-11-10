import { ANY_HERO_DISCOUNT, BRACKETS } from "../lib/pricing.js";

function TierName({ name }) {
  const [a, b] = name.split(" → ");
  return b ? (
    <>
      {a} <i>→</i> {b}
    </>
  ) : (
    a
  );
}

export default function Rates() {
  return (
    <section className="section" id="rates">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Pilot service rates</p>
          <h2>Pay only for the stars you climb</h2>
          <p className="muted">
            Each star is charged at the rate of the bracket it's earned in. Rates are for Kagura — let the pilot use{" "}
            <strong className="hl">any hero</strong> and every rate drops by ₱{ANY_HERO_DISCOUNT}.
          </p>
        </div>
        <div className="rates">
          {BRACKETS.map((b, i) => {
            const top = i === BRACKETS.length - 1;
            return (
              <article key={b.name} className={"rate-card" + (top ? " rate-card-top" : "")}>
                {top && <span className="badge">Top tier</span>}
                <span className="rate-tier">
                  <TierName name={b.name} />
                </span>
                <p className="rate-price">
                  ₱{b.rate}
                  <small>/ star</small>
                </p>
                <p className="rate-note">{b.note}</p>
                <p className="rate-alt">
                  Any hero <strong>₱{b.rate - ANY_HERO_DISCOUNT}</strong>
                  <small>/ star</small>
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
