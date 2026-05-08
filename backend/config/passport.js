'use strict';


const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, Wallet } = require('../models');
const { generateReferralCode } = require('../utils/generateToken');
const { sendMail }   = require('./mailer');
const { welcomeGoogleTemplate } = require('../templates/emails');

passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/v1/auth/google/callback`,
    scope:        ['profile', 'email'],
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email    = profile.emails?.[0]?.value?.toLowerCase();
      const googleId = profile.id;
      const fullName = profile.displayName || 'مستخدم جديد';
      const avatar   = profile.photos?.[0]?.value;

      if (!email) return done(null, false, { message: 'لم يتم الحصول على بريد إلكتروني من Google' });

      // ── Find existing user ──────────────────────────────
      let user = await User.findOne({ where: { email } });

      if (user) {
        // User exists — link Google ID if not linked yet
        const updates = {};
        if (!user.googleId)  updates.googleId  = googleId;
        if (!user.avatarUrl) updates.avatarUrl  = avatar;
        if (user.status === 'pending') {
          updates.status        = 'active';
          updates.emailVerified = true;
        }
        if (Object.keys(updates).length > 0) await user.update(updates);

      } else {
        // ── New user — create account ───────────────────
        user = await User.create({
          email,
          fullName,
          googleId,
          avatarUrl:     avatar,
          emailVerified: true,
          status:        'active',
          role:          'user',
          referralCode:  generateReferralCode(),
          passwordHash:  null,  // Google users have no password
        });

        // Create wallet for new user
        await Wallet.create({ userId: user.id });

        // Send welcome email (don't block on failure)
        sendMail({
          to:      email,
          subject: `مرحباً بك في TaleXHub، ${fullName}!`,
          html:    welcomeGoogleTemplate({ name: fullName }),
        }).catch(() => {});
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

module.exports = passport;