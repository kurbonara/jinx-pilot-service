import { peso } from "./pricing.js";

/* Draws a branded order receipt on a canvas and downloads it as PNG.
   Pure canvas — no extra dependencies. */

const W = 1080;
const PAD = 72;
const BASE = {
  bg: "#120a0c",
  card: "#1c1113",
  line: "rgba(233,180,160,0.16)",
  text: "#f1ebe7",
  muted: "#b3a29d",
  ember: "#ff5a2c",
  ember2: "#ff8a3d",
  crimson: "#b3121f",
  silver: "#dcd7d5",
};
const DISPLAY = '"Cinzel", Georgia, serif';
const SANS = '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

function loadImage(src) {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Shrink font until text fits maxWidth. */
function fitFont(ctx, text, weight, size, family, maxWidth) {
  let s = size;
  do {
    ctx.font = `${weight} ${s}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    s -= 2;
  } while (s > 14);
  return s;
}

function drawLogo(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 64, size / 64);
  ctx.fillStyle = C.ember;
  ctx.shadowColor = rgba(C.ember, 0.7);
  ctx.shadowBlur = 18;
  ctx.fill(new Path2D("M32 6C16 6 4 18 4 30h56C60 18 48 6 32 6z"));
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#e9e4e0";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.stroke(new Path2D("M32 30v24a5 5 0 0 1-10 0"));
  ctx.restore();
}

let C = BASE;
const rgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export async function renderOrderPng(order) {
  await document.fonts?.ready;
  const p = order.theme?.palette;
  C = p ? { ...BASE, bg: p.bg, ember: p.accent, ember2: p.accent2, crimson: p.deep, cool: p.cool } : { ...BASE, cool: "#5b8cff" };
  const hero = order.themeImage ? await loadImage(order.themeImage) : null;

  const HEADER = 340;
  const ROW = 96;
  const height = HEADER + 60 + 150 + 60 + order.lines.length * ROW + 40 + 210 + 150;
  const scale = 2; // crisp on phones
  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.textBaseline = "alphabetic";

  // background
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, height);
  let g;

  // hero header
  if (hero) {
    const ratio = Math.max(W / hero.width, HEADER / hero.height) * 1.15;
    const iw = hero.width * ratio;
    const ih = hero.height * ratio;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, HEADER);
    ctx.clip();
    // splashes with Kagura on the left get shifted right so she isn't under the header text
    const x = order.theme?.align === "right" ? W * 0.28 : W - iw * 0.82;
    ctx.drawImage(hero, x, -ih * 0.12, iw, ih);
    ctx.restore();
  }
  g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, rgba(C.bg, 0.95));
  g.addColorStop(0.55, rgba(C.bg, 0.55));
  g.addColorStop(1, rgba(C.bg, 0.1));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, HEADER);
  g = ctx.createLinearGradient(0, HEADER * 0.4, 0, HEADER);
  g.addColorStop(0, rgba(C.bg, 0));
  g.addColorStop(1, C.bg);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, HEADER);

  // ambient glows (drawn over the header so there's no seam)
  g = ctx.createRadialGradient(W, 0, 0, W, 0, 900);
  g.addColorStop(0, rgba(C.cool, 0.22));
  g.addColorStop(1, rgba(C.cool, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, height);
  g = ctx.createRadialGradient(0, height, 0, 0, height, 800);
  g.addColorStop(0, rgba(C.crimson, 0.35));
  g.addColorStop(1, rgba(C.crimson, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, height);

  drawLogo(ctx, PAD, 86, 64);
  ctx.fillStyle = C.text;
  ctx.font = `800 52px ${DISPLAY}`;
  ctx.fillText("JINX", PAD + 82, 134);
  ctx.fillStyle = C.muted;
  ctx.font = `600 18px ${SANS}`;
  ctx.letterSpacing = "5px";
  ctx.fillText("PILOT SERVICE", PAD + 84, 162);

  ctx.fillStyle = C.ember2;
  ctx.font = `700 20px ${SANS}`;
  ctx.fillText("ORDER SUMMARY", PAD, 248);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = C.muted;
  ctx.font = `500 22px ${SANS}`;
  ctx.fillText(`${order.date}  ·  Ref ${order.ref}`, PAD, 284);

  let y = HEADER + 20;

  // service pill
  ctx.font = `700 22px ${SANS}`;
  const pill = order.service;
  const pw = ctx.measureText(pill).width + 44;
  roundRect(ctx, PAD, y, pw, 48, 24);
  ctx.fillStyle = rgba(C.ember, 0.14);
  ctx.fill();
  ctx.strokeStyle = rgba(C.ember2, 0.45);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = order.theme?.palette.tint || "#ffc2a8";
  ctx.fillText(pill, PAD + 22, y + 32);
  y += 80;

  // route box
  const boxW = W - PAD * 2;
  roundRect(ctx, PAD, y, boxW, 130, 20);
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.fill();
  ctx.strokeStyle = C.line;
  ctx.stroke();
  const colW = (boxW - 120) / 2;
  const drawRoute = (x, label, value) => {
    ctx.fillStyle = C.muted;
    ctx.font = `700 17px ${SANS}`;
    ctx.letterSpacing = "3px";
    ctx.fillText(label, x, y + 48);
    ctx.letterSpacing = "0px";
    ctx.fillStyle = C.text;
    fitFont(ctx, value, 700, 30, SANS, colW);
    ctx.fillText(value, x, y + 92);
  };
  drawRoute(PAD + 32, "FROM", order.from);
  drawRoute(PAD + 32 + colW + 70, order.toLabel.toUpperCase(), order.to);
  ctx.strokeStyle = C.ember2;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  const ax = PAD + 32 + colW + 14;
  ctx.beginPath();
  ctx.moveTo(ax, y + 72);
  ctx.lineTo(ax + 34, y + 72);
  ctx.moveTo(ax + 22, y + 60);
  ctx.lineTo(ax + 34, y + 72);
  ctx.lineTo(ax + 22, y + 84);
  ctx.stroke();
  y += 130 + 50;

  // breakdown
  ctx.fillStyle = C.muted;
  ctx.font = `700 17px ${SANS}`;
  ctx.letterSpacing = "3px";
  ctx.fillText("BREAKDOWN", PAD, y);
  ctx.letterSpacing = "0px";
  y += 24;
  for (const l of order.lines) {
    ctx.fillStyle = C.text;
    ctx.font = `600 28px ${SANS}`;
    ctx.fillText(l.name, PAD, y + 42);
    ctx.fillStyle = C.muted;
    ctx.font = `500 21px ${SANS}`;
    ctx.fillText(`${l.stars.toLocaleString("en-PH")}★ × ${peso(l.rate)}`, PAD, y + 74);
    ctx.fillStyle = C.text;
    ctx.font = `700 28px ${SANS}`;
    ctx.textAlign = "right";
    ctx.fillText(peso(l.sub), W - PAD, y + 42);
    ctx.textAlign = "left";
    y += ROW;
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(PAD, y - 6);
    ctx.lineTo(W - PAD, y - 6);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  y += 34;

  // total card
  roundRect(ctx, PAD, y, boxW, 180, 24);
  g = ctx.createLinearGradient(PAD, y, W - PAD, y + 180);
  g.addColorStop(0, rgba(C.ember2, 0.22));
  g.addColorStop(1, rgba(C.crimson, 0.28));
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = rgba(C.ember2, 0.55);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = C.muted;
  ctx.font = `700 18px ${SANS}`;
  ctx.letterSpacing = "4px";
  ctx.fillText(order.goal ? "TOTAL" : "ESTIMATED TOTAL", PAD + 36, y + 56);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = C.silver;
  ctx.font = `600 24px ${SANS}`;
  ctx.fillText(`${order.stars.toLocaleString("en-PH")} star${order.stars === 1 ? "" : "s"}`, PAD + 36, y + 140);
  if (order.saved) {
    ctx.fillStyle = "#86efac";
    ctx.font = `600 20px ${SANS}`;
    ctx.fillText(`Any hero · you save ${peso(order.saved)}`, PAD + 36, y + 100);
  }
  ctx.fillStyle = "#fff";
  ctx.shadowColor = rgba(C.ember, 0.6);
  ctx.shadowBlur = 30;
  ctx.textAlign = "right";
  fitFont(ctx, peso(order.total), 800, 84, DISPLAY, boxW - 280);
  ctx.fillText(peso(order.total), W - PAD - 36, y + 128);
  ctx.textAlign = "left";
  ctx.shadowBlur = 0;
  y += 180 + 56;

  // footer
  ctx.fillStyle = C.muted;
  ctx.font = `500 21px ${SANS}`;
  ctx.textAlign = "center";
  ctx.fillText(
    order.goal ? "Final price confirmed by the pilot before starting." : "Spam pilot — billed per star gained at each bracket's rate.",
    W / 2,
    y
  );
  ctx.fillStyle = C.ember2;
  ctx.font = `600 21px ${SANS}`;
  ctx.fillText("Send this to JINX on TikTok · @jinxsudesu", W / 2, y + 38);
  ctx.textAlign = "left";

  return canvas;
}

export async function downloadOrderPng(order) {
  const canvas = await renderOrderPng(order);
  const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
  const name = `JINX-order-${order.ref}.png`;
  const file = new File([blob], name, { type: "image/png" });

  // Phones: native share sheet lets them save to Photos or send straight to Messenger
  if (navigator.canShare?.({ files: [file] }) && matchMedia("(pointer: coarse)").matches) {
    try {
      await navigator.share({ files: [file], title: "JINX Pilot order" });
      return "shared";
    } catch (e) {
      if (e?.name === "AbortError") return "cancelled";
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return "downloaded";
}
