'use strict';

// ══════════════════════════════════════════════════════════
// checkFeature middleware
// Usage: router.post('/cvs/upload', protect, checkFeature('cvUploads'), ctrl.upload)
//
// It reads the user's plan (from user.planKey, default 'free'),
// checks the limit, and either passes through or returns 403.
// ══════════════════════════════════════════════════════════

const { PLAN_FEATURES } = require('../config/pricing');
const { CV, JobApplication, TrainingSession } = require('../models');

// Map feature → how to count current usage
const COUNTERS = {
  cvUploads:       (userId) => CV.count({ where: { user_id: userId, deleted_at: null } }),
  aiAnalysis:      ()       => 0,   // no strict counter yet — allow freely
  jobApplications: (userId) => JobApplication.count({ where: { user_id: userId } }),
  training:        (userId) => TrainingSession.count({ where: { user_id: userId } }),
};

const checkFeature = (feature) => async (req, res, next) => {
  try {
    // planKey not yet in User model — default everyone to 'free'
    // When billing/subscription is added, update this to read from user or subscription table
    const planKey = req.user?.planKey || req.user?.subscriptionPlan || 'free';
    const plan    = PLAN_FEATURES[planKey] || PLAN_FEATURES.free;
    const limit   = plan[feature];

    // boolean feature (courses, autoApply, cvBuilder)
    if (typeof limit === 'boolean') {
      if (!limit) {
        return res.status(403).json({
          success: false,
          message: 'هذه الميزة غير متاحة في باقتك الحالية. يرجى الترقية',
          messageEn: 'This feature is not available on your current plan. Please upgrade.',
          feature,
          planKey,
          upgradeRequired: true,
        });
      }
      return next();
    }

    // -1 = unlimited
    if (limit === -1) return next();

    // count current usage
    const counter = COUNTERS[feature];
    if (!counter) return next(); // no counter defined — allow

    const current = await counter(req.user.id);

    if (current >= limit) {
      return res.status(403).json({
        success: false,
        message: `لقد وصلت للحد الأقصى (${limit}) لهذه الميزة في باقتك. يرجى الترقية`,
        messageEn: `You have reached the limit (${limit}) for this feature. Please upgrade.`,
        feature,
        planKey,
        limit,
        current,
        upgradeRequired: true,
      });
    }

    next();
  } catch (err) {
    // Don't block on error — just log and proceed
    console.error('checkFeature error:', err.message);
    next();
  }
};

module.exports = checkFeature;