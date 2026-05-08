// import useThemeStore from '../../store/themeStore';

// /**
//  * ThemeToggle — sun/moon icon button
//  * Props:
//  *   scrolled  {boolean} — header scroll state (affects ghost vs solid style)
//  *   size      {number}  — button size in px (default 38)
//  */
// export default function ThemeToggle({ scrolled = true, size = 38 }) {
//   const { theme, toggleTheme } = useThemeStore();
//   const isDark = theme === 'dark';

//   return (
//     <button
//       onClick={toggleTheme}
//       aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
//       title={isDark ? 'Light mode' : 'Dark mode'}
//       style={{
//         width: size,
//         height: size,
//         borderRadius: 10,
//         border: scrolled
//           ? '1.5px solid var(--border)'
//           : '1.5px solid rgba(255,255,255,0.25)',
//         background: scrolled
//           ? 'var(--bg-secondary)'
//           : 'rgba(255,255,255,0.10)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         cursor: 'pointer',
//         transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
//         flexShrink: 0,
//         color: scrolled ? 'var(--text-primary)' : 'rgba(255,255,255,0.9)',
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.borderColor = 'var(--accent-400)';
//         e.currentTarget.style.background = 'var(--accent-50)';
//         e.currentTarget.style.color = 'var(--accent-600)';
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.borderColor = scrolled
//           ? 'var(--border)'
//           : 'rgba(255,255,255,0.25)';
//         e.currentTarget.style.background = scrolled
//           ? 'var(--bg-secondary)'
//           : 'rgba(255,255,255,0.10)';
//         e.currentTarget.style.color = scrolled
//           ? 'var(--text-primary)'
//           : 'rgba(255,255,255,0.9)';
//       }}
//     >
//       {isDark ? <SunIcon /> : <MoonIcon />}
//     </button>
//   );
// }

// function SunIcon() {
//   return (
//     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//       <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//       <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
//         stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//     </svg>
//   );
// }

// function MoonIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//       <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
//         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// }

import useThemeStore from '../../store/themeStore';

/**
 * ThemeToggle — sun / moon button, fully on design system
 * Props:
 *   scrolled  boolean  — header scroll state
 *   size      number   — button px size (default 38)
 */
export default function ThemeToggle({ scrolled = true, size = 38 }) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={{
        width: size, height: size, borderRadius: 10, flexShrink: 0,
        border: '1.5px solid var(--border)',
        background: 'var(--bg-secondary)',
        color: 'var(--text-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all var(--transition)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent-400)';
        e.currentTarget.style.background  = 'var(--bg-tertiary)';
        e.currentTarget.style.color       = 'var(--text-primary)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background  = 'var(--bg-secondary)';
        e.currentTarget.style.color       = 'var(--text-secondary)';
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}