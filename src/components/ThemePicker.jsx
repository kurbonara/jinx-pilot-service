import { useEffect, useRef, useState } from "react";
import { THEMES, themeImage } from "../themes.js";
import { fallbackBackground, useTheme } from "../theme/ThemeContext.jsx";
import { PaletteIcon, CheckIcon, CloseIcon } from "./Icons.jsx";

export default function ThemePicker() {
  const { theme, setThemeId, hasArt } = useTheme();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button type="button" className="theme-btn" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className="theme-btn-swatch" style={{ background: `linear-gradient(135deg, ${theme.palette.accent2}, ${theme.palette.deep})` }} />
        <PaletteIcon />
        <span className="theme-btn-label">Theme</span>
      </button>

      <dialog
        ref={dialogRef}
        className="theme-dialog"
        aria-labelledby="theme-title"
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialogRef.current && setOpen(false)}
      >
        <div className="theme-sheet">
          <header className="theme-head">
            <div>
              <p className="kicker">Kagura skins</p>
              <h2 id="theme-title">Choose a theme</h2>
            </div>
            <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close themes">
              <CloseIcon />
            </button>
          </header>

          <div className="theme-grid" role="radiogroup" aria-label="Theme">
            {THEMES.map((t) => {
              const active = t.id === theme.id;
              const art = hasArt(t);
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={"theme-card" + (active ? " is-active" : "")}
                  style={{ "--card-accent": t.palette.accent, "--card-accent-2": t.palette.accent2 }}
                  onClick={() => setThemeId(t.id)}
                >
                  <span
                    className="theme-thumb"
                    style={{
                      backgroundImage: art ? `url("${themeImage(t)}")` : fallbackBackground(t),
                      backgroundPosition: t.pos || "60% center",
                    }}
                  >
                    {!art && <span className="theme-noart">Splash art not added yet</span>}
                    {active && (
                      <span className="theme-check">
                        <CheckIcon />
                      </span>
                    )}
                  </span>
                  <span className="theme-meta">
                    <strong>{t.name}</strong>
                    <span className={"theme-type" + (t.type === "Legend" ? " is-legend" : "")}>{t.type}</span>
                  </span>
                  <span className="theme-dots" aria-hidden="true">
                    {[t.palette.accent, t.palette.accent2, t.palette.deep, t.palette.cool].map((c, i) => (
                      <i key={i} style={{ background: c }} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </dialog>
    </>
  );
}
