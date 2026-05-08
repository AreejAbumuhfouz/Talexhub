// 'use strict';

// const { sequelize } = require('../models');
// const { success, error } = require('../utils/apiResponse');
// const { sendMail } = require('../config/mailer');
// const logger = require('../utils/logger');

// // ── In-memory table guard (replace with a real Waitlist model later) ─────────
// // To use a real table, create a Waitlist model with: email, lang, createdAt
// // and swap the raw queries below with Waitlist.create() / Waitlist.findOne()

// // ════════════════════════════════════════════════════════════
// // POST /api/v1/waitlist
// // Body: { email, lang? }
// // ════════════════════════════════════════════════════════════
// exports.joinWaitlist = async (req, res) => {
//   const { email, lang = 'en' } = req.body;

//   if (!email || typeof email !== 'string')
//     return error(res, 'البريد الإلكتروني مطلوب', 400);

//   const cleaned = email.trim().toLowerCase();
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!re.test(cleaned))
//     return error(res, 'صيغة البريد الإلكتروني غير صحيحة', 400);

//   try {
//     // Create waitlist table if it doesn't exist yet
//     await sequelize.query(`
//       CREATE TABLE IF NOT EXISTS waitlist (
//         id         SERIAL PRIMARY KEY,
//         email      VARCHAR(255) UNIQUE NOT NULL,
//         lang       VARCHAR(10)  DEFAULT 'en',
//         ip         VARCHAR(45),
//         created_at TIMESTAMPTZ  DEFAULT NOW()
//       );
//     `);

//     // Check for duplicate
//     const [existing] = await sequelize.query(
//       'SELECT id FROM waitlist WHERE email = :email',
//       { replacements: { email: cleaned }, type: sequelize.QueryTypes.SELECT }
//     );

//     if (existing) {
//       // Don't reveal duplicate — return success silently
//       return success(res, {}, lang === 'ar'
//         ? 'تم تسجيلك مسبقاً — ترقب إطلاقنا!'
//         : "You're already on the list — stay tuned!");
//     }

//     // Save
//     const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || null;
//     await sequelize.query(
//       'INSERT INTO waitlist (email, lang, ip) VALUES (:email, :lang, :ip)',
//       { replacements: { email: cleaned, lang, ip } }
//     );

//     // Send confirmation email (non-blocking)
//     sendMail({
//       to: cleaned,
//       subject: lang === 'ar' ? 'أنت على القائمة! 🎉 — TaleXHub' : "You're on the list! 🎉 — TaleXHub",
//       html: waitlistEmailTemplate(cleaned, lang),
//     }).catch(err => logger.error('Waitlist email failed:', err.message));

//     logger.info(`Waitlist: new signup — ${cleaned} [${lang}]`);

//     return success(res, { email: cleaned }, lang === 'ar'
//       ? 'تم تسجيلك بنجاح — سنتواصل معك قريباً!'
//       : "You're on the list — we'll reach out soon!");

//   } catch (err) {
//     logger.error('Waitlist error:', err.message);
//     return error(res, 'حدث خطأ، يرجى المحاولة مجدداً', 500);
//   }
// };

// // ════════════════════════════════════════════════════════════
// // GET /api/v1/waitlist  — admin: list all signups
// // Protected: admin only
// // ════════════════════════════════════════════════════════════
// exports.getWaitlist = async (req, res) => {
//   try {
//     const rows = await sequelize.query(
//       'SELECT id, email, lang, ip, created_at FROM waitlist ORDER BY created_at DESC',
//       { type: sequelize.QueryTypes.SELECT }
//     );

//     return success(res, {
//       total: rows.length,
//       waitlist: rows,
//     });
//   } catch (err) {
//     logger.error('Get waitlist error:', err.message);
//     return error(res, 'فشل جلب البيانات', 500);
//   }
// };

// // ════════════════════════════════════════════════════════════
// // DELETE /api/v1/waitlist/:email  — admin: remove entry
// // ════════════════════════════════════════════════════════════
// exports.removeFromWaitlist = async (req, res) => {
//   const { email } = req.params;
//   await sequelize.query(
//     'DELETE FROM waitlist WHERE email = :email',
//     { replacements: { email: email.toLowerCase() } }
//   );
//   return success(res, {}, 'تم الحذف');
// };

// // ════════════════════════════════════════════════════════════
// // Email template
// // ════════════════════════════════════════════════════════════
// function waitlistEmailTemplate(email, lang) {
//   const isAr = lang === 'ar';
//   return `
// <!DOCTYPE html>
// <html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
// </head>
// <body style="margin:0;padding:0;background:#f5f5f5;font-family:${isAr ? 'Tajawal, Arial' : 'DM Sans, Arial'},sans-serif;">
//   <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
//     <tr>
//       <td align="center">
//         <table width="560" cellpadding="0" cellspacing="0"
//           style="background:#000;border-radius:16px;overflow:hidden;max-width:100%;">

//           <!-- Header -->
//           <tr>
//             <td style="padding:40px 40px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
//               <table cellpadding="0" cellspacing="0">
//                 <tr>
//                   <td>
//                     <div style="width:34px;height:34px;background:#fff;border-radius:9px;
//                       display:inline-flex;align-items:center;justify-content:center;
//                       font-family:'DM Serif Display',serif;font-size:18px;color:#000;
//                       text-align:center;line-height:34px;vertical-align:middle;">T</div>
//                   </td>
//                   <td style="padding-${isAr ? 'right' : 'left'}:10px;vertical-align:middle;">
//                     <span style="font-family:'DM Serif Display',serif;font-size:20px;
//                       color:#fff;letter-spacing:-0.02em;">TaleXHub</span>
//                   </td>
//                 </tr>
//               </table>
//             </td>
//           </tr>

//           <!-- Body -->
//           <tr>
//             <td style="padding:40px 40px 32px;">
//               <p style="font-size:28px;font-weight:700;color:#fff;margin:0 0 16px;
//                 line-height:1.2;">
//                 ${isAr ? '🎉 أنت على القائمة!' : "🎉 You're on the list!"}
//               </p>
//               <p style="font-size:15px;color:rgba(255,255,255,0.55);line-height:1.8;margin:0 0 28px;">
//                 ${isAr
//                   ? `مرحباً، شكراً لتسجيلك في TaleXHub. ستكون من أوائل من يحصل على وصول مبكر لأذكى منصة مهنية في العالم العربي.`
//                   : `Hi there, thanks for signing up for TaleXHub. You'll be among the first to get early access to the smartest career platform for Arab professionals.`}
//               </p>
//               <p style="font-size:14px;color:rgba(255,255,255,0.3);margin:0;">
//                 ${email}
//               </p>
//             </td>
//           </tr>

//           <!-- Features -->
//           <tr>
//             <td style="padding:0 40px 32px;">
//               <table width="100%" cellpadding="0" cellspacing="0"
//                 style="background:rgba(255,255,255,0.04);border-radius:12px;padding:20px;">
//                 <tr>
//                   <td>
//                     <p style="font-size:12px;font-weight:600;color:rgba(255,255,255,0.4);
//                       letter-spacing:0.1em;text-transform:uppercase;margin:0 0 14px;">
//                       ${isAr ? 'ما ينتظرك' : "What's coming"}
//                     </p>
//                     ${['AI Resume Analysis | تحليل السيرة',
//                        'Interview Training | تدريب المقابلات',
//                        'Smart Job Matching | مطابقة ذكية',
//                        'Auto Apply | التقديم التلقائي']
//                       .map(f => `<p style="font-size:13px;color:rgba(255,255,255,0.45);margin:0 0 8px;">
//                         — ${isAr ? f.split(' | ')[1] : f.split(' | ')[0]}
//                       </p>`).join('')}
//                   </td>
//                 </tr>
//               </table>
//             </td>
//           </tr>

//           <!-- Footer -->
//           <tr>
//             <td style="padding:20px 40px 36px;border-top:1px solid rgba(255,255,255,0.07);">
//               <p style="font-size:12px;color:rgba(255,255,255,0.2);margin:0;">
//                 © 2025 TaleXHub.
//                 ${isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
//               </p>
//             </td>
//           </tr>

//         </table>
//       </td>
//     </tr>
//   </table>
// </body>
// </html>`;
// }

'use strict';

const { sequelize } = require('../models');
const { success, error } = require('../utils/apiResponse');
const { sendMail } = require('../config/mailer');
const logger = require('../utils/logger');

// ════════════════════════════════════════════════════════════
// POST /api/v1/waitlist
// Body: { email, lang? }
// ════════════════════════════════════════════════════════════
exports.joinWaitlist = async (req, res) => {
  const { email, lang = 'en' } = req.body;

  if (!email || typeof email !== 'string')
    return error(res, 'البريد الإلكتروني مطلوب', 400);

  const cleaned = email.trim().toLowerCase();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(cleaned))
    return error(res, 'صيغة البريد الإلكتروني غير صحيحة', 400);

  try {
    // Create waitlist table if it doesn't exist yet
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id         SERIAL PRIMARY KEY,
        email      VARCHAR(255) UNIQUE NOT NULL,
        lang       VARCHAR(10)  DEFAULT 'en',
        ip         VARCHAR(45),
        created_at TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    // Check for duplicate
    const [existing] = await sequelize.query(
      'SELECT id FROM waitlist WHERE email = :email',
      { replacements: { email: cleaned }, type: sequelize.QueryTypes.SELECT }
    );

    if (existing) {
      // Return a distinct flag so the frontend can show a specific message
      return res.status(409).json({
        status: 'already_registered',
        alreadyRegistered: true,
        message: lang === 'ar'
          ? 'هذا البريد مسجّل مسبقاً — ترقّب إطلاقنا!'
          : "This email is already on the list — stay tuned!",
      });
    }

    // Save
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || null;
    await sequelize.query(
      'INSERT INTO waitlist (email, lang, ip) VALUES (:email, :lang, :ip)',
      { replacements: { email: cleaned, lang, ip } }
    );

    // Send confirmation email (non-blocking)
    sendMail({
      to: cleaned,
      subject: lang === 'ar' ? 'أنت على القائمة! 🎉 — TaleXHub' : "You're on the list! 🎉 — TaleXHub",
      html: waitlistEmailTemplate(cleaned, lang),
    }).catch(err => logger.error('Waitlist email failed:', err.message));

    logger.info(`Waitlist: new signup — ${cleaned} [${lang}]`);

    return success(res, { email: cleaned }, lang === 'ar'
      ? 'تم تسجيلك بنجاح — سنتواصل معك قريباً!'
      : "You're on the list — we'll reach out soon!");

  } catch (err) {
    logger.error('Waitlist error:', err.message);
    return error(res, 'حدث خطأ، يرجى المحاولة مجدداً', 500);
  }
};

// ════════════════════════════════════════════════════════════
// GET /api/v1/waitlist  — admin: list all signups
// ════════════════════════════════════════════════════════════
exports.getWaitlist = async (req, res) => {
  try {
    const rows = await sequelize.query(
      'SELECT id, email, lang, ip, created_at FROM waitlist ORDER BY created_at DESC',
      { type: sequelize.QueryTypes.SELECT }
    );
    return success(res, { total: rows.length, waitlist: rows });
  } catch (err) {
    logger.error('Get waitlist error:', err.message);
    return error(res, 'فشل جلب البيانات', 500);
  }
};

// ════════════════════════════════════════════════════════════
// DELETE /api/v1/waitlist/:email  — admin: remove entry
// ════════════════════════════════════════════════════════════
exports.removeFromWaitlist = async (req, res) => {
  const { email } = req.params;
  await sequelize.query(
    'DELETE FROM waitlist WHERE email = :email',
    { replacements: { email: email.toLowerCase() } }
  );
  return success(res, {}, 'تم الحذف');
};

// ════════════════════════════════════════════════════════════
// Email template
// ════════════════════════════════════════════════════════════
function waitlistEmailTemplate(email, lang) {
  const isAr = lang === 'ar';
  return `
<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:${isAr ? 'Tajawal, Arial' : 'DM Sans, Arial'},sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
          style="background:#000;border-radius:16px;overflow:hidden;max-width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="width:34px;height:34px;background:#fff;border-radius:9px;
                      display:inline-flex;align-items:center;justify-content:center;
                      font-family:'DM Serif Display',serif;font-size:18px;color:#000;
                      text-align:center;line-height:34px;vertical-align:middle;">T</div>
                  </td>
                  <td style="padding-${isAr ? 'right' : 'left'}:10px;vertical-align:middle;">
                    <span style="font-family:'DM Serif Display',serif;font-size:20px;
                      color:#fff;letter-spacing:-0.02em;">TaleXHub</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="font-size:28px;font-weight:700;color:#fff;margin:0 0 16px;line-height:1.2;">
                ${isAr ? '🎉 أنت على القائمة!' : "🎉 You're on the list!"}
              </p>
              <p style="font-size:15px;color:rgba(255,255,255,0.55);line-height:1.8;margin:0 0 28px;">
                ${isAr
                  ? 'مرحباً، شكراً لتسجيلك في TaleXHub. ستكون من أوائل من يحصل على وصول مبكر لأذكى منصة مهنية في العالم العربي.'
                  : 'Hi there, thanks for signing up for TaleXHub. You\'ll be among the first to get early access to the smartest career platform for Arab professionals.'}
              </p>
              <p style="font-size:14px;color:rgba(255,255,255,0.3);margin:0;">
                ${email}
              </p>
            </td>
          </tr>

          <!-- Features -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(255,255,255,0.04);border-radius:12px;padding:20px;">
                <tr>
                  <td>
                    <p style="font-size:12px;font-weight:600;color:rgba(255,255,255,0.4);
                      letter-spacing:0.1em;text-transform:uppercase;margin:0 0 14px;">
                      ${isAr ? 'ما ينتظرك' : "What's coming"}
                    </p>
                    ${['AI Resume Analysis | تحليل السيرة',
                       'Interview Training | تدريب المقابلات',
                       'Smart Job Matching | مطابقة ذكية',
                       'Auto Apply | التقديم التلقائي']
                      .map(f => `<p style="font-size:13px;color:rgba(255,255,255,0.45);margin:0 0 8px;">
                        — ${isAr ? f.split(' | ')[1] : f.split(' | ')[0]}
                      </p>`).join('')}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 36px;border-top:1px solid rgba(255,255,255,0.07);">
              <p style="font-size:12px;color:rgba(255,255,255,0.2);margin:0;">
                © 2025 TaleXHub. ${isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}