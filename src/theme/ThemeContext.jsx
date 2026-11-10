import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_THEME, THEMES, getTheme, themeImage, themeVars } from "../themes.js";

const STORAGE_KEY = "jinx-theme";
const ThemeContext = createContext(null);

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return THEMES.some((t) => t.id === v) ? v : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

/** Fallback hero background when a theme's splash file isn't there yet. */
export function fallbackBackground(t) {
  const p = t.palette;
  return `radial-gradient(900px 520px at 72% 30%, ${p.accent}55, transparent 60%),
    radial-gradient(700px 500px at 15% 80%, ${p.deep}66, transparent 65%),
    radial-gradient(600px 400px at 90% 90%, ${p.cool}33, transparent 60%),
    linear-gradient(160deg, ${p.bg}, ${p.deep}44 60%, ${p.bg})`;
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeIdState] = useState(readStored);
  // id -> true (image loaded) | false (missing)
  const [available, setAvailable] = useState({});

  // probe every splash once so the picker knows which have art
  useEffect(() => {
    const seen = new Set();
    THEMES.forEach((t) => {
      const src = themeImage(t);
      if (seen.has(src)) return;
      seen.add(src);
      const img = new Image();
      img.onload = () => setAvailable((a) => ({ ...a, [src]: true }));
      img.onerror = () => setAvailable((a) => ({ ...a, [src]: false }));
      img.src = src;
    });
  }, []);

  const theme = getTheme(themeId);
  const imgSrc = themeImage(theme);
  const hasImage = available[imgSrc] !== false; // optimistic until probed

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeVars(theme)).forEach(([k, v]) => root.style.setProperty(k, v));
    root.style.setProperty("--hero-img", hasImage ? `url("${imgSrc}")` : fallbackBackground(theme));
    root.dataset.theme = theme.id;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.palette.bg);
  }, [theme, imgSrc, hasImage]);

  const setThemeId = useCallback((id) => {
    setThemeIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* private mode etc. — theme still applies for this visit */
    }
  }, []);

  const value = useMemo(
    () => ({ theme, setThemeId, hasArt: (t) => available[themeImage(t)] !== false, artLoaded: (t) => available[themeImage(t)] === true }),
    [theme, setThemeId, available]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
