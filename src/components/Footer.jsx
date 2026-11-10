import { useVisitCount } from "../hooks/useVisitCount.js";
import { EyeIcon } from "./Icons.jsx";

export default function Footer() {
  const visits = useVisitCount();

  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-left">
          <p>© {new Date().getFullYear()} JINX Pilot Service</p>
          {visits !== null && (
            <span className="visit-pill" title="Total site visits · updates live">
              <span className="live-dot" aria-hidden="true" />
              <EyeIcon />
              {/* key re-mounts the number so the bump animation replays on every change */}
              <strong key={visits} className="visit-num">
                {visits.toLocaleString("en-PH")}
              </strong> site visit{visits === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <p className="tiny muted">
          Independent service. Not affiliated with or endorsed by Moonton or Mobile Legends: Bang Bang.
        </p>
      </div>
    </footer>
  );
}
