export function UmbrellaLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 6C16 6 4 18 4 30h56C60 18 48 6 32 6z" fill="currentColor" />
      <path d="M32 30v24a5 5 0 0 1-10 0" stroke="#e9e4e0" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.8 };

export const ContactIcons = {
  tiktok: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" {...S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 3c.4 2.6 2.2 4.4 5 4.6" {...S} strokeLinecap="round" />
    </svg>
  ),
  messenger: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3C7 3 3 6.7 3 11.3c0 2.6 1.3 4.9 3.3 6.4V21l3-1.7c.9.3 1.8.4 2.7.4 5 0 9-3.7 9-8.3S17 3 12 3z" {...S} strokeLinejoin="round" />
      <path d="m7.5 13.5 3-3 2.5 2 3.5-3" {...S} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" {...S} />
      <path d="M15 8h-1.5A1.5 1.5 0 0 0 12 9.5V21M9.5 13h5" {...S} strokeLinecap="round" />
    </svg>
  ),
  discord: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7.5c3.3-1.3 6.7-1.3 10 0l1.8 8.5c-1.6 1.3-3.3 2-5 2.3l-.8-1.6m-2 0-.8 1.6c-1.7-.3-3.4-1-5-2.3z" {...S} strokeLinejoin="round" />
      <circle cx="9.5" cy="12.5" r="1.2" fill="currentColor" />
      <circle cx="14.5" cy="12.5" r="1.2" fill="currentColor" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16v11H8l-4 4z" {...S} strokeLinejoin="round" />
    </svg>
  ),
};

export const WhyIcons = {
  shield: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z" {...S} strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" {...S} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" {...S} />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" {...S} />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" {...S} />
      <path d="M12 7.5V12l3 2" {...S} strokeLinecap="round" />
    </svg>
  ),
};

export function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PaletteIcon() {
  return (
    <svg className="theme-btn-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="7.5" cy="11" r="1.3" fill="currentColor" />
      <circle cx="10.5" cy="7" r="1.3" fill="currentColor" />
      <circle cx="15.5" cy="7.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
