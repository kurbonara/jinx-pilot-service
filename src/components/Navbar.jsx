import { UmbrellaLogo } from "./Icons.jsx";
import ThemePicker from "./ThemePicker.jsx";

const LINKS = [
  ["#rates", "Rates"],
  ["#calculator", "Calculator"],
  ["#how", "How it works"],
  ["#faq", "FAQ"],
];

export default function Navbar() {
  return (
    <header className="nav" id="top">
      <div className="wrap nav-inner">
        <a href="#top" className="brand" aria-label="JINX Pilot Service home">
          <UmbrellaLogo className="brand-mark" />
          <span>
            JINX<small>Pilot Service</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="Main">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <ThemePicker />
          <a href="#calculator" className="btn btn-sm btn-primary">
            Get a quote
          </a>
        </div>
      </div>
    </header>
  );
}
