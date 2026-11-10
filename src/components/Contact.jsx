import { CONTACTS } from "../config.js";
import { ContactIcons } from "./Icons.jsx";
import { useTheme } from "../theme/ThemeContext.jsx";
import { themeImage } from "../themes.js";

export default function Contact() {
  const { theme, hasArt } = useTheme();
  const [fx, fy] = theme.face || [0.5, 0.3];

  return (
    <section className="section section-contact" id="contact">
      <div className="wrap">
        <div className="contact">
          {hasArt(theme) && (
            // zoomed onto Kagura's face — see `face` in src/themes.js
            <div className="contact-art" aria-hidden="true" style={{ "--fx": fx, "--fy": fy }}>
              <img src={themeImage(theme)} alt="" loading="lazy" />
            </div>
          )}
          <div className="contact-body">
            <div>
              <p className="kicker">Book a slot</p>
              <h2>Ready to climb?</h2>
              <p className="muted">
                Copy or save your order from the calculator and message JINX on TikTok — that's where bookings happen. Slots are first come, first served.
              </p>
            </div>
            <div className="contact-links">
              {CONTACTS.map((c) => (
                <a key={c.url} className={"contact-link" + (c.primary ? " is-primary" : "")} href={c.url} target="_blank" rel="noopener">
                  {ContactIcons[c.type] || ContactIcons.default}
                  <span>
                    <strong>{c.label}</strong>
                    <small>{c.handle}</small>
                  </span>
                  {c.primary && <em className="contact-badge">Book here</em>}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
