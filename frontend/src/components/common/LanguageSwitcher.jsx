// import useLangStore from '../../i18n';

// /**
//  * LanguageSwitcher — drop-in button component
//  *
//  * Usage:
//  *   <LanguageSwitcher />               // default style
//  *   <LanguageSwitcher variant="ghost" /> // for dark backgrounds
//  *   <LanguageSwitcher variant="pill" />  // pill style for navbar
//  */
// export default function LanguageSwitcher({ variant = 'default' }) {
//   const { lang, toggleLang } = useLangStore();
//   const isAr = lang === 'ar';

//   const styles = {
//     default: {
//       display: 'inline-flex', alignItems: 'center', gap: 6,
//       padding: '7px 14px', borderRadius: 10,
//       border: '1.5px solid #E2E8F0',
//       background: 'white', cursor: 'pointer',
//       fontSize: 13, fontWeight: 700, color: '#1A3C6E',
//       transition: 'all 0.2s', fontFamily: 'Tajawal, sans-serif',
//     },
//     ghost: {
//       display: 'inline-flex', alignItems: 'center', gap: 6,
//       padding: '7px 14px', borderRadius: 10,
//       border: '1.5px solid rgba(255,255,255,0.25)',
//       background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
//       cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'white',
//       transition: 'all 0.2s', fontFamily: 'Tajawal, sans-serif',
//     },
//     pill: {
//       display: 'inline-flex', alignItems: 'center', gap: 6,
//       padding: '6px 12px', borderRadius: 99,
//       border: '1.5px solid #E2E8F0',
//       background: '#F0F4F8', cursor: 'pointer',
//       fontSize: 12, fontWeight: 700, color: '#1A3C6E',
//       transition: 'all 0.2s', fontFamily: 'Tajawal, sans-serif',
//     },
//   };

//   return (
//     <button
//       onClick={toggleLang}
//       style={styles[variant] || styles.default}
//       title={isAr ? 'Switch to English' : 'التبديل للعربية'}
//       onMouseEnter={e => {
//         if (variant === 'ghost') {
//           e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
//         } else {
//           e.currentTarget.style.background = '#EBF3FB';
//           e.currentTarget.style.borderColor = '#1A3C6E';
//         }
//       }}
//       onMouseLeave={e => {
//         e.currentTarget.style.background = styles[variant]?.background || 'white';
//         e.currentTarget.style.borderColor = styles[variant]?.borderColor || '#E2E8F0';
//       }}
//     >
//       {/* Flag emoji */}
//       {/* <span style={{ fontSize: 16 }}>{isAr ? '🇬🇧' : '🇸🇦'}</span> */}
//       {/* Label */}
//       <span>{isAr ? 'EN' : 'AR'}</span>
//     </button>
//   );
// }


import useLangStore from '../../i18n';

/**
 * LanguageSwitcher — fully on design system CSS variables
 * Props:
 *   variant  'default' | 'ghost' | 'pill'
 */
export default function LanguageSwitcher({ variant = 'default' }) {
  const { lang, toggleLang } = useLangStore();
  const isAr = lang === 'ar';

  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '7px 13px', borderRadius: 10,
    cursor: 'pointer', fontSize: 12, fontWeight: 700,
    fontFamily: 'var(--font-en)',
    transition: 'all var(--transition)',
    letterSpacing: '0.04em',
    border: 'none', outline: 'none',
  };

  const variants = {
    default: {
      ...base,
      border: '1.5px solid var(--border)',
      background: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
    },
    ghost: {
      ...base,
      border: '1.5px solid rgba(255,255,255,0.22)',
      background: 'rgba(255,255,255,0.08)',
      color: 'var(--text-primary)',
    },
    pill: {
      ...base,
      padding: '6px 12px', borderRadius: 99,
      border: '1.5px solid var(--border)',
      background: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
    },
  };

  const style = variants[variant] || variants.default;

  return (
    <button
      onClick={toggleLang}
      style={style}
      title={isAr ? 'Switch to English' : 'التبديل للعربية'}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent-400)';
        e.currentTarget.style.background  = 'var(--bg-tertiary)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = style.border?.replace('1.5px solid ', '') || 'var(--border)';
        e.currentTarget.style.background  = style.background;
      }}
    >
      {isAr ? 'EN' : 'AR'}
    </button>
  );
}