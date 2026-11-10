/* =========================================================
   Kagura skin themes
   ---------------------------------------------------------
   Each theme = splash art + color palette.
   Splash art goes in  public/themes/<id>.jpg
   If the file is missing, the theme still works with a
   gradient background built from its palette.

   Palette keys (hex):
     accent   main color (buttons, highlights)
     accent2  lighter highlight
     deep     deep shade for gradients
     hot      gradient end on the hero title
     cool     secondary glow color
     tint     light text tint
     bg       page background (keep it dark for readability)
     pos      focal point of the splash (CSS background-position)
     face     [x, y] of Kagura's face in the splash (0–1), used to frame the "Book a slot" card
     align    "right" puts the hero text on the right (for splashes where Kagura is on the left)
   ========================================================= */

export const DEFAULT_THEME = "feast-of-eternity";

export const THEMES = [
  {
    id: "feast-of-eternity",
    face: [0.55, 0.22], // where Kagura's face is in the splash (x, y as 0–1)
    word: "crimson", // hero headline: "Climb under the crimson umbrella."
    name: "Feast of Eternity",
    type: "Legend",
    note: "Deadly Sins · Gluttony",
    palette: { accent: "#ff5a2c", accent2: "#ff8a3d", deep: "#b3121f", hot: "#ff2a3a", cool: "#5b8cff", tint: "#ffc2a8", bg: "#0e0809" },
    pos: "62% center",
    posMobile: "70% center",
  },
  {
    id: "dragon-maiden",
    face: [0.52, 0.29], // where Kagura's face is in the splash (x, y as 0–1)
    word: "dragon's",
    name: "Dragon Maiden",
    type: "Epic",
    note: "Formerly Soryu Maiden",
    palette: { accent: "#2ec4b6", accent2: "#7fe3d8", deep: "#135e66", hot: "#ff8fa3", cool: "#5aa8ff", tint: "#cff5f0", bg: "#060d10" },
    pos: "60% center",
    posMobile: "52% center",
  },
  {
    id: "water-lily",
    face: [0.505, 0.26], // where Kagura's face is in the splash (x, y as 0–1)
    word: "lotus",
    name: "Water Lily",
    type: "StarLight Fest",
    palette: { accent: "#a77bff", accent2: "#cdb2ff", deep: "#4b3a9e", hot: "#ffd36b", cool: "#4fd1c5", tint: "#e6dcff", bg: "#090b16" },
    pos: "62% center",
    posMobile: "50% center",
  },
  {
    id: "rainy-walk",
    face: [0.61, 0.15], // where Kagura's face is in the splash (x, y as 0–1)
    word: "rain-kissed",
    name: "Rainy Walk",
    type: "StarLight",
    palette: { accent: "#ff3d9a", accent2: "#ff8cc6", deep: "#a1186a", hot: "#ffd60a", cool: "#4f8dff", tint: "#ffd1e8", bg: "#0b0a14" },
    pos: "70% center",
    posMobile: "68% center",
  },
  {
    id: "exorcist",
    face: [0.33, 0.29], // where Kagura's face is in the splash (x, y as 0–1)
    word: "phantom",
    name: "Exorcist Kagura",
    type: "Limited Event",
    note: "Exorcists series",
    palette: { accent: "#e0408a", accent2: "#ff8ab8", deep: "#7a1d4f", hot: "#ffc857", cool: "#5a7dff", tint: "#ffd3e6", bg: "#0b0a14" },
    pos: "35% center",
    posMobile: "36% center",
    align: "right", // Kagura stands on the left of this splash, so the hero text sits on the right
  },
  {
    id: "beyond-the-clouds",
    face: [0.595, 0.25], // where Kagura's face is in the splash (x, y as 0–1)
    word: "skyborne",
    name: "Beyond the Clouds",
    type: "Limited Event",
    palette: { accent: "#3fa9ff", accent2: "#8fd0ff", deep: "#2a4fb0", hot: "#ffc94d", cool: "#b48cff", tint: "#d9efff", bg: "#070c16" },
    pos: "65% center",
    posMobile: "66% center",
  },
  {
    id: "jade-blossom",
    face: [0.43, 0.31], // where Kagura's face is in the splash (x, y as 0–1)
    word: "jade",
    name: "Jade Blossom",
    type: "Limited Event",
    palette: { accent: "#22c993", accent2: "#7ef0c4", deep: "#0e6b58", hot: "#ff8fd0", cool: "#b26bff", tint: "#c9f7e8", bg: "#06100d" },
    pos: "40% center",
    posMobile: "44% center",
    align: "right",
  },
  {
    id: "cherry-witch",
    face: [0.3, 0.24], // where Kagura's face is in the splash (x, y as 0–1)
    word: "cherry",
    name: "Cherry Witch",
    type: "Special",
    palette: { accent: "#ff4d6d", accent2: "#ff9bb0", deep: "#9e1b32", hot: "#ffb347", cool: "#b46bff", tint: "#ffd3dc", bg: "#0e080c" },
    pos: "30% center",
    posMobile: "28% center",
    align: "right",
  },
  {
    id: "summer-festival",
    face: [0.71, 0.25], // where Kagura's face is in the splash (x, y as 0–1)
    word: "festival",
    name: "Summer Festival",
    type: "Summer",
    palette: { accent: "#ff8a2a", accent2: "#ffb766", deep: "#b04a10", hot: "#ffd166", cool: "#3d7bff", tint: "#ffe2c4", bg: "#0a0b12" },
    pos: "75% center",
    posMobile: "74% center",
  },
  {
    id: "flower-season",
    face: [0.52, 0.21], // where Kagura's face is in the splash (x, y as 0–1)
    word: "garden",
    name: "Flower Season",
    type: "Basic",
    palette: { accent: "#14b8a6", accent2: "#5eead4", deep: "#0f5f63", hot: "#ff4d6d", cool: "#ffd166", tint: "#ccfbf1", bg: "#061012" },
    pos: "60% center",
    posMobile: "50% center",
  },
  {
    id: "onmyouji-master",
    face: [0.665, 0.24], // where Kagura's face is in the splash (x, y as 0–1)
    word: "sakura",
    name: "Onmyouji Master",
    type: "Default",
    palette: { accent: "#7c6cff", accent2: "#a9a0ff", deep: "#3b2e9e", hot: "#ff7ab6", cool: "#4cc9f0", tint: "#e0dcff", bg: "#090a16" },
    pos: "70% center",
    posMobile: "64% center",
  },
  {
    id: "pink-summer-festival",
    face: [0.71, 0.25], // where Kagura's face is in the splash (x, y as 0–1)
    word: "rose",
    name: "Pink Summer Festival",
    type: "Painted",
    note: "Recolor of Summer Festival",
    image: "summer-festival", // painted skins reuse the base splash unless you add their own file
    palette: { accent: "#ff5fa2", accent2: "#ff9cc6", deep: "#a3245e", hot: "#ffc2e0", cool: "#7fd8ff", tint: "#ffd3e8", bg: "#0d080b" },
    pos: "75% center",
    posMobile: "74% center",
  },
  {
    id: "amethyst-wizard",
    face: [0.3, 0.24], // where Kagura's face is in the splash (x, y as 0–1)
    word: "amethyst",
    name: "Amethyst Wizard",
    type: "Painted",
    note: "Recolor of Cherry Witch",
    image: "cherry-witch",
    palette: { accent: "#9b5cff", accent2: "#c7a0ff", deep: "#4f2596", hot: "#e6c8ff", cool: "#ff86c4", tint: "#e6d6ff", bg: "#09080e" },
    pos: "30% center",
    posMobile: "28% center",
    align: "right",
  },
];

/* ---------- helpers ---------- */
const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const triplet = (hex) => hexToRgb(hex).join(", ");
const mix = (hex, toHex, t) => {
  const a = hexToRgb(hex);
  const b = hexToRgb(toHex);
  return a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(", ");
};

export const themeImage = (t) => `/themes/${t.image || t.id}.jpg`;
export const getTheme = (id) => THEMES.find((t) => t.id === id) || THEMES[0];

/** CSS custom properties for a theme (applied to <html>). */
export function themeVars(t) {
  const p = t.palette;
  return {
    "--accent": triplet(p.accent),
    "--accent-2": triplet(p.accent2),
    "--deep": triplet(p.deep),
    "--hot": triplet(p.hot),
    "--cool": triplet(p.cool),
    "--cool-deep": mix(p.cool, p.bg, 0.78),
    "--cool-tint": mix(p.cool, "#ffffff", 0.6),
    "--tint": triplet(p.tint),
    "--bg": triplet(p.bg),
    "--surface": mix(p.accent, p.bg, 0.9),
    "--surface-2": mix(p.accent, p.bg, 0.94),
    "--hero-pos": t.pos || "60% center",
    "--hero-pos-mobile": t.posMobile || t.pos || "65% center",
  };
}
