import { useMemo } from "react";
import { useTheme } from "../theme/ThemeContext.jsx";

function Embers() {
  const embers = useMemo(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return [];
    const n = window.innerWidth < 600 ? 14 : 28;
    return Array.from({ length: n }, (_, i) => {
      const s = 2 + Math.random() * 3;
      return {
        id: i,
        style: {
          left: Math.random() * 100 + "%",
          width: s,
          height: s,
          animationDuration: 6 + Math.random() * 8 + "s",
          animationDelay: -Math.random() * 12 + "s",
          "--dx": Math.round(Math.random() * 120 - 60) + "px",
        },
      };
    });
  }, []);
  return (
    <div className="embers" aria-hidden="true">
      {embers.map((e) => (
        <i key={e.id} style={e.style} />
      ))}
    </div>
  );
}

export default function Hero() {
  const { theme } = useTheme();
  return (
    <section className={"hero" + (theme.align === "right" ? " hero--right" : "")}>
      <div className="hero-bg" aria-hidden="true" />
      <Embers />
      <div className="wrap hero-content">
        <div className="hero-copy">
        <p className="eyebrow">
          <span className="dot" /> Slots open · Kagura main
        </p>
        <h1>
          Climb under the
          <br />
          <span className="grad">{theme.word || "crimson"} umbrella.</span>
        </h1>
        <p className="lead">
          Fast, safe Mobile Legends piloting by JINX. Epic to Mythical Immortal, priced per star — no hidden fees. Know
          your total before you order.
        </p>
        <div className="hero-cta">
          <a href="#calculator" className="btn btn-primary">
            Compute my total
          </a>
          <a href="#rates" className="btn btn-ghost">
            See rates
          </a>
        </div>
        <ul className="hero-stats">
          <li>
            <strong>₱40</strong>
            <span>starting per star</span>
          </li>
          <li>
            <strong>Kagura</strong>
            <span>signature hero</span>
          </li>
          <li>
            <strong>Epic → Immo</strong>
            <span>all brackets</span>
          </li>
        </ul>
        </div>
      </div>
    </section>
  );
}
