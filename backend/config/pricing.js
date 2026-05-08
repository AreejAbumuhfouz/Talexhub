'use strict';

// ══════════════════════════════════════════════
// OPN — Country-based pricing tiers
// ══════════════════════════════════════════════

const TIERS = {
  gulf: {
    id: 'gulf', label: 'Gulf & Premium',
    currency: 'USD', symbol: '$',
    countries: ['AE','SA','KW','QA','BH','OM'],
    plans: {
      free:  { price: 0,     monthly: 0,     yearly: 0 },
      pro:   { price: 9.99,  monthly: 9.99,  yearly: 99  },
      elite: { price: 19.99, monthly: 19.99, yearly: 199 },
    },
  },
  mena: {
    id: 'mena', label: 'MENA',
    currency: 'USD', symbol: '$',
    countries: ['JO','EG','IQ','LB','SY','PS','MA','TN','DZ','LY'],
    plans: {
      free:  { price: 0,    monthly: 0,    yearly: 0  },
      pro:   { price: 5.99, monthly: 5.99, yearly: 59 },
      elite: { price: 9.99, monthly: 9.99, yearly: 99 },
    },
  },
  affordable: {
    id: 'affordable', label: 'Affordable',
    currency: 'USD', symbol: '$',
    countries: ['YE','SD','SO','MR','DJ','KM'],
    plans: {
      free:  { price: 0,    monthly: 0,    yearly: 0  },
      pro:   { price: 2.99, monthly: 2.99, yearly: 29 },
      elite: { price: 4.99, monthly: 4.99, yearly: 49 },
    },
  },
  global: {
    id: 'global', label: 'Global',
    currency: 'USD', symbol: '$',
    countries: [], // default
    plans: {
      free:  { price: 0,     monthly: 0,     yearly: 0   },
      pro:   { price: 7.99,  monthly: 7.99,  yearly: 79  },
      elite: { price: 14.99, monthly: 14.99, yearly: 149 },
    },
  },
};

const COUNTRY_MAP = {};
Object.values(TIERS).forEach(tier => {
  tier.countries.forEach(cc => { COUNTRY_MAP[cc] = tier.id; });
});

const getTierForCountry = (cc) => {
  const id = COUNTRY_MAP[(cc || '').toUpperCase()] || 'global';
  return TIERS[id];
};

// Features per plan
const PLAN_FEATURES = {
  free:  { cvUploads:1, aiAnalysis:1,  jobApplications:5,   training:1,  courses:false, autoApply:false, cvBuilder:false, walletBonus:0    },
  pro:   { cvUploads:5, aiAnalysis:10, jobApplications:100,  training:10, courses:true,  autoApply:true,  cvBuilder:true,  walletBonus:500  },
  elite: { cvUploads:-1,aiAnalysis:-1, jobApplications:-1,   training:-1, courses:true,  autoApply:true,  cvBuilder:true,  walletBonus:1500, prioritySupport:true },
};

module.exports = { TIERS, getTierForCountry, PLAN_FEATURES };