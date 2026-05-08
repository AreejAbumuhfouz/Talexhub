// 'use strict';
// const APP = process.env.APP_NAME ;
// const URL = process.env.FRONTEND_URL ;
// const wrap = (body) => `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"/><style>*{box-sizing:border-box;margin:0;padding:0}.w{max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08)}.h{background:#1A3C6E;padding:28px 36px;text-align:center}.h h1{color:#FFD700;font-size:22px;font-weight:800}.b{padding:32px 36px;color:#333;font-family:Tahoma,Arial,sans-serif;font-size:14px;line-height:1.8}.otp{background:#EBF3FB;border:2px dashed #2E75B6;border-radius:10px;text-align:center;padding:20px;margin:20px 0}.code{font-size:40px;font-weight:900;color:#1A3C6E;letter-spacing:10px;font-family:monospace}.hint{font-size:12px;color:#888;margin-top:6px}.btn{display:inline-block;background:#1A3C6E;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin:16px 0}.warn{background:#FFF3CD;border-right:4px solid #F39C12;border-radius:6px;padding:10px 14px;margin-top:16px;font-size:12px;color:#856404}.f{background:#f9fafb;padding:20px 36px;text-align:center;font-size:11px;color:#aaa}</style></head><body><div class="w"><div class="h"><h1>${APP}</h1></div><div class="b">${body}</div><div class="f"><p>© ${new Date().getFullYear()} ${APP}</p></div></div></body></html>`;

// const otpEmailTemplate = ({ name, otp }) => wrap(`<p>مرحباً <strong>${name}</strong> </p><p>لتفعيل حسابك، استخدم رمز التحقق:</p><div class="otp"><div class="code">${otp}</div><div class="hint">صالح 10 دقائق فقط</div></div><div class="warn">⚠️ لا تشارك هذا الرمز مع أحد</div>`);
// const welcomeEmailTemplate = ({ name }) => wrap(`<p>مرحباً <strong>${name}</strong> </p><p>تم تفعيل حسابك في <strong>${APP}</strong> بنجاح!</p><p style="text-align:center"><a href="${URL}/dashboard" class="btn">ابدأ الآن ←</a></p>`);
// const welcomeGoogleTemplate = ({ name }) => wrap(`<p>مرحباً <strong>${name}</strong> </p><p>تم إنشاء حسابك في <strong>${APP}</strong> عبر Google!</p><p style="text-align:center"><a href="${URL}/dashboard" class="btn">اذهب إلى لوحة التحكم ←</a></p>`);
// const resetPasswordTemplate = ({ name, otp }) => wrap(`<p>مرحباً <strong>${name}</strong>،</p><p>رمز إعادة تعيين كلمة المرور:</p><div class="otp"><div class="code">${otp}</div><div class="hint">صالح 10 دقائق فقط</div></div><div class="warn">⚠️ إذا لم تطلب هذا، تجاهل الرسالة</div>`);

// module.exports = { otpEmailTemplate, welcomeEmailTemplate, welcomeGoogleTemplate, resetPasswordTemplate };


'use strict';

const APP      = process.env.APP_NAME    || 'Talexhub';
const BASE_URL = process.env.FRONTEND_URL || 'https://talexhub.com';

/* ─────────────────────────────────────────────────────────────
   LOGO
   Replace the src below with your CDN/hosted URL, e.g.:
   const LOGO_URL = 'https://talexhub.com/assets/LogoGold.png';
   Or keep as hosted path — email clients need a public URL,
   local file paths won't work in emails.
───────────────────────────────────────────────────────────── */
const LOGO_URL = `${BASE_URL}/assets/LogoGold.png`;

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS  (mirrors RegisterPage CSS variables)
───────────────────────────────────────────────────────────── */
const T = {
  bgPage:      '#F4F4F5',   // --bg-primary (light)
  bgCard:      '#FFFFFF',   // --bg-secondary
  bgField:     '#F9F9F9',
  border:      '#E4E4E7',   // --border
  accent:      '#1A1A1E',   // --text-primary / button bg
  accentGold:  '#D4A017',   // gold from logo
  textPrimary: '#1A1A1E',
  textSec:     '#71717A',
  danger:      '#EF4444',
  success:     '#22C55E',
  warning:     '#F97316',
  radius:      '10px',
  radiusLg:    '14px',
};

/* ─────────────────────────────────────────────────────────────
   i18n strings
───────────────────────────────────────────────────────────── */
const i18n = {
  ar: {
    dir: 'rtl', lang: 'ar',
    greeting:     (name) => `مرحباً <strong style="color:${T.textPrimary}">${name}</strong>`,
    otpTitle:     'تفعيل حسابك',
    otpBody:      'لتفعيل حسابك في <strong>TalexHub</strong>، استخدم رمز التحقق التالي:',
    otpValid:     'صالح لمدة 10 دقائق فقط',
    otpWarn:      '⚠ لا تشارك هذا الرمز مع أحد. فريقنا لن يطلبه منك أبداً.',
    welcomeTitle: 'مرحباً بك في TalexHub! 🎉',
    welcomeBody:  'تم تفعيل حسابك بنجاح. ابدأ رحلتك المهنية الآن.',
    welcomeBtn:   'اذهب إلى لوحة التحكم ←',
    googleTitle:  'تم إنشاء حسابك عبر Google',
    googleBody:   'أهلاً بك! تم ربط حسابك بـ Google بنجاح.',
    googleBtn:    'اذهب إلى لوحة التحكم ←',
    resetTitle:   'إعادة تعيين كلمة المرور',
    resetBody:    'تلقينا طلباً لإعادة تعيين كلمة مرور حسابك. استخدم الرمز التالي:',
    resetValid:   'صالح لمدة 10 دقائق فقط',
    resetWarn:    '⚠ إذا لم تطلب هذا، تجاهل الرسالة وحسابك بأمان.',
    footer:       'هذه رسالة تلقائية، لا تردّ عليها.',
    rights:       'جميع الحقوق محفوظة',
  },
  en: {
    dir: 'ltr', lang: 'en',
    greeting:     (name) => `Hello <strong style="color:${T.textPrimary}">${name}</strong>`,
    otpTitle:     'Activate Your Account',
    otpBody:      'To activate your <strong>TalexHub</strong> account, use the verification code below:',
    otpValid:     'Valid for 10 minutes only',
    otpWarn:      '⚠ Never share this code. Our team will never ask for it.',
    welcomeTitle: 'Welcome to TalexHub! 🎉',
    welcomeBody:  'Your account has been activated. Start your career journey now.',
    welcomeBtn:   'Go to Dashboard →',
    googleTitle:  'Account Created via Google',
    googleBody:   'Welcome! Your account has been linked with Google successfully.',
    googleBtn:    'Go to Dashboard →',
    resetTitle:   'Reset Your Password',
    resetBody:    'We received a request to reset your password. Use the code below:',
    resetValid:   'Valid for 10 minutes only',
    resetWarn:    '⚠ If you didn\'t request this, you can safely ignore this email.',
    footer:       'This is an automated message, please do not reply.',
    rights:       'All rights reserved',
  },
};

/* ─────────────────────────────────────────────────────────────
   BASE WRAPPER  — full email shell
───────────────────────────────────────────────────────────── */
const wrap = (body, t) => `<!DOCTYPE html>
<html lang="${t.lang}" dir="${t.dir}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${APP}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: ${T.bgPage};
      font-family: ${t.dir === 'rtl'
        ? "'Tahoma','Arial',sans-serif"
        : "'Helvetica Neue','Arial',sans-serif"};
      font-size: 14px;
      color: ${T.textPrimary};
      padding: 32px 16px;
    }
    .card {
      max-width: 480px;
      margin: 0 auto;
      background: ${T.bgCard};
      border-radius: ${T.radiusLg};
      border: 1.5px solid ${T.border};
      overflow: hidden;
    }
    /* ── Header ── */
    .header {
      background: ${T.accent};
      padding: 28px 36px;
      text-align: center;
    }
    .header img {
      height: 40px;
      width: auto;
      object-fit: contain;
    }
    /* ── Body ── */
    .body {
      padding: 32px 36px;
      line-height: 1.75;
      color: ${T.textPrimary};
    }
    .body p { margin-bottom: 12px; }
    /* ── OTP box ── */
    .otp-box {
      background: ${T.bgField};
      border: 1.5px solid ${T.border};
      border-radius: ${T.radius};
      text-align: center;
      padding: 24px 20px;
      margin: 20px 0;
    }
    .otp-code {
      font-size: 42px;
      font-weight: 900;
      color: ${T.textPrimary};
      letter-spacing: 14px;
      font-family: 'Courier New', monospace;
      display: block;
    }
    .otp-valid {
      font-size: 12px;
      color: ${T.textSec};
      margin-top: 8px;
    }
    /* ── Warning box ── */
    .warn {
      background: #FFF8EC;
      border: 1.5px solid #F6D860;
      border-radius: ${T.radius};
      padding: 12px 16px;
      font-size: 12.5px;
      color: #92610A;
      margin-top: 16px;
      line-height: 1.6;
    }
    /* ── CTA button ── */
    .btn-wrap { text-align: center; margin: 24px 0 8px; }
    .btn {
      display: inline-block;
      background: ${T.accent};
      color: #ffffff !important;
      padding: 13px 32px;
      border-radius: ${T.radius};
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    /* ── Divider ── */
    .divider {
      height: 1px;
      background: ${T.border};
      margin: 24px 0;
    }
    /* ── Footer ── */
    .footer {
      background: ${T.bgField};
      border-top: 1.5px solid ${T.border};
      padding: 18px 36px;
      text-align: center;
      font-size: 11.5px;
      color: ${T.textSec};
      line-height: 1.7;
    }
    .footer a { color: ${T.textSec}; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">

    <!-- Header -->
    <div class="header">
      <img src="${LOGO_URL}" alt="${APP}" />
    </div>

    <!-- Body -->
    <div class="body">
      ${body}
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>${t.footer}</p>
      <p style="margin-top:6px">© ${new Date().getFullYear()} <strong>${APP}</strong> — ${t.rights}</p>
    </div>

  </div>
</body>
</html>`;

/* ─────────────────────────────────────────────────────────────
   TEMPLATES
   Each accepts { name, otp?, lang? }
   lang defaults to 'ar' — pass lang:'en' for English
───────────────────────────────────────────────────────────── */

/**
 * OTP / Email verification
 * @param {{ name: string, otp: string, lang?: 'ar'|'en' }} opts
 */
const otpEmailTemplate = ({ name, otp, lang = 'ar' }) => {
  const t = i18n[lang] || i18n.ar;
  return wrap(`
    <p>${t.greeting(name)},</p>
    <p>${t.otpBody}</p>

    <div class="otp-box">
      <span class="otp-code">${otp}</span>
      <p class="otp-valid">${t.otpValid}</p>
    </div>

    <div class="warn">${t.otpWarn}</div>
  `, t);
};

/**
 * Welcome email — sent after OTP verified
 * @param {{ name: string, lang?: 'ar'|'en' }} opts
 */
const welcomeEmailTemplate = ({ name, lang = 'ar' }) => {
  const t = i18n[lang] || i18n.ar;
  return wrap(`
    <p>${t.greeting(name)},</p>
    <p>${t.welcomeBody}</p>

    <div class="divider"></div>

    <div class="btn-wrap">
      <a href="${BASE_URL}/dashboard" class="btn">${t.welcomeBtn}</a>
    </div>
  `, t);
};

/**
 * Google OAuth welcome
 * @param {{ name: string, lang?: 'ar'|'en' }} opts
 */
const welcomeGoogleTemplate = ({ name, lang = 'ar' }) => {
  const t = i18n[lang] || i18n.ar;
  return wrap(`
    <p>${t.greeting(name)},</p>
    <p>${t.googleBody}</p>

    <div class="divider"></div>

    <div class="btn-wrap">
      <a href="${BASE_URL}/dashboard" class="btn">${t.googleBtn}</a>
    </div>
  `, t);
};

/**
 * Reset password OTP
 * @param {{ name: string, otp: string, lang?: 'ar'|'en' }} opts
 */
const resetPasswordTemplate = ({ name, otp, lang = 'ar' }) => {
  const t = i18n[lang] || i18n.ar;
  return wrap(`
    <p>${t.greeting(name)},</p>
    <p>${t.resetBody}</p>

    <div class="otp-box">
      <span class="otp-code">${otp}</span>
      <p class="otp-valid">${t.resetValid}</p>
    </div>

    <div class="warn">${t.resetWarn}</div>
  `, t);
};

module.exports = {
  otpEmailTemplate,
  welcomeEmailTemplate,
  welcomeGoogleTemplate,
  resetPasswordTemplate,
};