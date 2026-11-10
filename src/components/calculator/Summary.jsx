import { forwardRef, useEffect, useRef } from "react";
import { peso } from "../../lib/pricing.js";
import { ArrowIcon, DownloadIcon, ContactIcons } from "../Icons.jsx";
import { BOOKING } from "../../config.js";

const Summary = forwardRef(function Summary({ quote, onCopy, onSavePng, saving }, ref) {
  const { label, from, toLabel, to, sub, total, lines, error, stars } = quote;
  const totalRef = useRef(null);
  const prev = useRef(total);

  // little bump animation when the total changes
  useEffect(() => {
    const el = totalRef.current;
    if (el && prev.current !== total) {
      el.classList.remove("bump");
      void el.offsetWidth;
      el.classList.add("bump");
    }
    prev.current = total;
  }, [total]);


  return (
    <aside className="summary" aria-live="polite" ref={ref}>
      <p className="summary-label">{label}</p>
      <p className="summary-total" ref={totalRef}>
        {peso(total)}
      </p>
      <p className="summary-sub">{sub}</p>
      <div className="route">
        <div>
          <small>From</small>
          <strong>{from}</strong>
        </div>
        <ArrowIcon />
        <div>
          <small>{toLabel}</small>
          <strong>{to}</strong>
        </div>
      </div>
      <ul className="breakdown">
        {lines.length ? (
          lines.map((l) => (
            <li key={l.name}>
              <span>
                {l.name}
                <br />
                <small>
                  {l.stars.toLocaleString("en-PH")}★ × {peso(l.rate)}
                </small>
              </span>
              <span>{peso(l.sub)}</span>
            </li>
          ))
        ) : (
          <li className="empty">No stars selected yet</li>
        )}
      </ul>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button type="button" className="btn btn-primary btn-block" onClick={onCopy} disabled={stars === 0}>
        Copy order details
      </button>
      <button type="button" className="btn btn-ghost btn-block" onClick={onSavePng} disabled={stars === 0 || saving}>
        <DownloadIcon />
        {saving ? "Creating image…" : "Save order as PNG"}
      </button>
      <a
        className="btn btn-ghost btn-block"
        href={BOOKING.url}
        target="_blank"
        rel="noopener"
        aria-label={`Message JINX on ${BOOKING.label} to book`}
      >
        <span className="btn-icon">{ContactIcons.tiktok}</span>
        Message JINX to book
      </a>
      <p className="tiny muted">Bookings via TikTok · final price confirmed by the pilot before starting.</p>
    </aside>
  );
});

export default Summary;
