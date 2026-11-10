import { useEffect, useState } from "react";
import { peso } from "../../lib/pricing.js";

/** Mobile-only bar: visible while the calculator is on screen but the summary card isn't. */
export default function StickyTotal({ sectionRef, summaryRef, total, stars, ready, onCopy }) {
  const [secIn, setSecIn] = useState(false);
  const [sumIn, setSumIn] = useState(false);
  const show = secIn && !sumIn;

  useEffect(() => {
    const a = new IntersectionObserver(([e]) => setSecIn(e.isIntersecting), { threshold: 0.05 });
    const b = new IntersectionObserver(([e]) => setSumIn(e.isIntersecting), { threshold: 0.25 });
    if (sectionRef.current) a.observe(sectionRef.current);
    if (summaryRef.current) b.observe(summaryRef.current);
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, [sectionRef, summaryRef]);

  useEffect(() => {
    document.body.classList.toggle("calc-in-view", show);
  }, [show]);

  return (
    <div className={"sticky-total" + (show ? " is-visible" : "")} aria-hidden={!show}>
      <div>
        <small>Total</small>
        <strong>{ready ? peso(total) : "₱ —"}</strong>
      </div>
      {ready && <span>{stars.toLocaleString("en-PH")}★</span>}
      <button type="button" className="btn btn-sm btn-primary" onClick={onCopy} disabled={!ready} tabIndex={show ? 0 : -1}>
        Copy order
      </button>
    </div>
  );
}
