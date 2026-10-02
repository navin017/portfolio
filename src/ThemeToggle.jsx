import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

const KEY = "theme";
const MODES = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
];

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");
const resolve = (mode) => (mode === "system" ? (darkQuery().matches ? "dark" : "light") : mode);

function readMode() {
  try {
    const m = localStorage.getItem(KEY);
    return MODES.some((x) => x.id === m) ? m : "system";
  } catch {
    return "system";
  }
}

function saveMode(mode) {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // storage unavailable (private mode etc.) — theme still applies for this visit
  }
}

// Switch the resolved theme with a circular wipe anchored on the toggle icon:
// going dark, the new theme grows out of the icon; going light, the dark
// theme shrinks back into it. The wipe itself is a CSS keyframe animation
// (styles.css) so it is applied from the very first frame of the transition.
let current = 0;
function applyTheme(next, origin, update = () => {}) {
  const root = document.documentElement;
  const commit = () => {
    update();
    root.dataset.theme = next;
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (root.dataset.theme === next || !document.startViewTransition || reduceMotion || !origin) {
    commit();
    return;
  }

  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.style.setProperty("--tt-x", `${x}px`);
  root.style.setProperty("--tt-y", `${y}px`);
  root.style.setProperty("--tt-r", `${Math.ceil(radius)}px`);
  root.classList.remove("theme-grow", "theme-shrink");
  root.classList.add("theme-switching", next === "dark" ? "theme-grow" : "theme-shrink");

  const id = ++current;
  const transition = document.startViewTransition(commit);
  transition.ready.catch(() => {}); // skipped (e.g. tab hidden): theme still applies
  transition.finished
    .catch(() => {})
    .finally(() => {
      if (id === current) root.classList.remove("theme-switching", "theme-grow", "theme-shrink");
    });
}

const Icon = ({ mode }) => {
  const common = {
    width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
  };
  if (mode === "light")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  if (mode === "dark")
    return (
      <svg {...common}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
};

export default function ThemeToggle() {
  const [mode, setMode] = useState(readMode);
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const wrapRef = useRef(null);

  const iconCenter = () => {
    const r = btnRef.current?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
  };

  // Follow OS changes live while in System mode.
  useEffect(() => {
    if (mode !== "system") return;
    const mq = darkQuery();
    const onChange = () => applyTheme(resolve("system"), iconCenter());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !wrapRef.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && (setOpen(false), btnRef.current?.focus());
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (next) => {
    saveMode(next);
    // Close the menu before the "before" snapshot is taken, so it doesn't linger
    // outside the circle; swap the icon inside the transition with the theme.
    flushSync(() => setOpen(false));
    applyTheme(resolve(next), iconCenter(), () => flushSync(() => setMode(next)));
  };

  return (
    <div className="theme" ref={wrapRef}>
      <button
        ref={btnRef}
        className="theme-btn"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${mode}. Change theme`}
        title="Change theme"
      >
        <Icon mode={mode} />
      </button>
      {open && (
        <div className="theme-menu" role="menu">
          {MODES.map((m) => (
            <button
              key={m.id}
              role="menuitemradio"
              aria-checked={mode === m.id}
              className={mode === m.id ? "active" : ""}
              onClick={() => choose(m.id)}
            >
              <Icon mode={m.id} />
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
