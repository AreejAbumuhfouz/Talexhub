'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
require('dotenv').config();

// ── ENUMS ────────────────────────────────────────────────────
const ENUMS = {
  userRole:            ['user', 'company', 'admin', 'support', 'moderator'],
  accountStatus:       ['pending', 'active', 'suspended', 'deleted'],
  companyStatus:       ['pending_review', 'active', 'suspended', 'rejected'],
  jobStatus:           ['draft', 'pending_approval', 'active', 'closed', 'archived'],
  jobType:             ['full_time', 'part_time', 'freelance', 'internship', 'remote'],
  applicationStatus:   ['sent', 'viewed', 'shortlisted', 'interview', 'accepted', 'rejected'],
  cvStatus:            ['uploaded', 'generated', 'analysed'],
  courseStatus:        ['draft', 'published', 'archived'],
  contentType:         ['video', 'pdf', 'article', 'quiz'],
  roomType:            ['text', 'voice', 'mixed'],
  roomAccess:          ['public', 'private', 'paid'],
  transactionType:     ['purchase', 'refund', 'referral_reward', 'withdrawal', 'admin_adjustment', 'chat_time'],
  notificationChannel: ['in_app', 'email', 'push'],
  subscriptionStatus:  ['active', 'expired', 'cancelled'],
  postCategory:        ['career_tips', 'job_search', 'company_review', 'general', 'success_story'],
};

// ── 1. User ──────────────────────────────────────────────────
const User = sequelize.define('User', {
  id:                { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email:             { type: DataTypes.STRING(255), allowNull: false, unique: true },
  emailVerified:     { type: DataTypes.BOOLEAN, defaultValue: false },
  passwordHash:      { type: DataTypes.TEXT },
  role:              { type: DataTypes.ENUM(...ENUMS.userRole), defaultValue: 'user' },
  status:            { type: DataTypes.ENUM(...ENUMS.accountStatus), defaultValue: 'pending' },

  fullName:          { type: DataTypes.STRING(255) },
  phone:             { type: DataTypes.STRING(50) },
  phoneVerified:     { type: DataTypes.BOOLEAN, defaultValue: false },
  avatarUrl:         { type: DataTypes.TEXT },
  headline:          { type: DataTypes.STRING(255) },
  bio:               { type: DataTypes.TEXT },
  locationCountry:   { type: DataTypes.STRING(100) },
  locationCity:      { type: DataTypes.STRING(100) },
  dateOfBirth:       { type: DataTypes.DATEONLY },
  gender:            { type: DataTypes.STRING(20) },
  nationality:       { type: DataTypes.STRING(100) },
  linkedinUrl:       { type: DataTypes.STRING(500) },
  portfolioUrl:      { type: DataTypes.STRING(500) },
  preferredLanguage: { type: DataTypes.STRING(10), defaultValue: 'ar' },

  desiredJobTitle:   { type: DataTypes.STRING(255) },
  desiredIndustries: { type: DataTypes.ARRAY(DataTypes.TEXT) },
  desiredLocations:  { type: DataTypes.ARRAY(DataTypes.TEXT) },
  desiredSalaryMin:  { type: DataTypes.DECIMAL(12, 2) },
  desiredSalaryMax:  { type: DataTypes.DECIMAL(12, 2) },
  desiredJobTypes:   { type: DataTypes.ARRAY(DataTypes.TEXT) },
  openToWork:        { type: DataTypes.BOOLEAN, defaultValue: true },
  discoverable:      { type: DataTypes.BOOLEAN, defaultValue: true },

  twoFaEnabled:      { type: DataTypes.BOOLEAN, defaultValue: false },
  twoFaSecret:       { type: DataTypes.TEXT },
  lastLoginAt:       { type: DataTypes.DATE },
  lastLoginIp:       { type: DataTypes.INET },
  failedLoginCount:  { type: DataTypes.SMALLINT, defaultValue: 0 },
  lockedUntil:       { type: DataTypes.DATE },
  // googleId: { type: DataTypes.STRING(100), unique: true, allowNull: true },

  // ✅ ONE referralCode field only (camelCase — Sequelize maps to referral_code via underscored:true)
  referralCode:      { type: DataTypes.STRING(20), unique: true },
  googleId: { type: DataTypes.STRING(100), unique: true, allowNull: true },
  referredBy:        { type: DataTypes.UUID },
  deletedAt:         { type: DataTypes.DATE },
}, {
  tableName: 'users',
  paranoid:  true,
  indexes: [
    { fields: ['email'] },
    { fields: ['role', 'status'] },
    { fields: ['referral_code'] },
  ],
});

// ── 2. OtpToken ──────────────────────────────────────────────
const OtpToken = sequelize.define('OtpToken', {
  id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:    { type: DataTypes.UUID, allowNull: false },
  token:     { type: DataTypes.STRING(10), allowNull: false },
  purpose:   { type: DataTypes.STRING(50), allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  used:      { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'otp_tokens',
  updatedAt: false,
});

// ── 3. RefreshToken ──────────────────────────────────────────
const RefreshToken = sequelize.define('RefreshToken', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:     { type: DataTypes.UUID, allowNull: false },
  tokenHash:  { type: DataTypes.TEXT, allowNull: false, unique: true },
  deviceInfo: { type: DataTypes.TEXT },
  ipAddress:  { type: DataTypes.INET },
  expiresAt:  { type: DataTypes.DATE, allowNull: false },
  revoked:    { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'refresh_tokens',
  updatedAt: false,
});

// ── 4. Company ───────────────────────────────────────────────
const Company = sequelize.define('Company', {
  id:                     { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  ownerId:                { type: DataTypes.UUID, allowNull: false },
  status:                 { type: DataTypes.ENUM(...ENUMS.companyStatus), defaultValue: 'pending_review' },
  name:                   { type: DataTypes.STRING(255), allowNull: false },
  slug:                   { type: DataTypes.STRING(255), unique: true },
  logoUrl:                { type: DataTypes.TEXT },
  coverUrl:               { type: DataTypes.TEXT },
  website:                { type: DataTypes.STRING(500) },
  emailDomain:            { type: DataTypes.STRING(255), allowNull: false },
  applicationEmailFormat: { type: DataTypes.STRING(100), defaultValue: 'jobs' },
  industry:               { type: DataTypes.STRING(100) },
  companySize:            { type: DataTypes.STRING(50) },
  foundedYear:            { type: DataTypes.SMALLINT },
  description:            { type: DataTypes.TEXT },
  locationCountry:        { type: DataTypes.STRING(100) },
  locationCity:           { type: DataTypes.STRING(100) },
  address:                { type: DataTypes.TEXT },
  tradeLicenseUrl:        { type: DataTypes.TEXT },
  reviewedBy:             { type: DataTypes.UUID },
  reviewedAt:             { type: DataTypes.DATE },
  rejectionReason:        { type: DataTypes.TEXT },
  totalJobsPosted:        { type: DataTypes.INTEGER, defaultValue: 0 },
  totalHires:             { type: DataTypes.INTEGER, defaultValue: 0 },
  deletedAt:              { type: DataTypes.DATE },
}, {
  tableName: 'companies',
  paranoid:  true,
});

// ── 5. CompanyMember ─────────────────────────────────────────
const CompanyMember = sequelize.define('CompanyMember', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  companyId:  { type: DataTypes.UUID, allowNull: false },
  userId:     { type: DataTypes.UUID, allowNull: false },
  role:       { type: DataTypes.STRING(50), defaultValue: 'hr' },
  invitedAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  acceptedAt: { type: DataTypes.DATE },
}, {
  tableName:  'company_members',
  timestamps: false,
});

// ── 6. SubscriptionPlan ──────────────────────────────────────
const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:           { type: DataTypes.STRING(100), allowNull: false },
  nameAr:         { type: DataTypes.STRING(100) },
  description:    { type: DataTypes.TEXT },
  price:          { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  currency:       { type: DataTypes.STRING(10), defaultValue: 'USD' },
  billingPeriod:  { type: DataTypes.STRING(20), defaultValue: 'monthly' },
  maxJobs:        { type: DataTypes.INTEGER, defaultValue: 5 },
  maxTeamMembers: { type: DataTypes.INTEGER, defaultValue: 1 },
  features:       { type: DataTypes.JSONB, defaultValue: [] },
  isActive:       { type: DataTypes.BOOLEAN, defaultValue: true },
  sortOrder:      { type: DataTypes.SMALLINT, defaultValue: 0 },
}, {
  tableName: 'subscription_plans',
  updatedAt: false,
});

// ── 7. CompanySubscription ───────────────────────────────────
const CompanySubscription = sequelize.define('CompanySubscription', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  companyId:  { type: DataTypes.UUID, allowNull: false },
  planId:     { type: DataTypes.UUID, allowNull: false },
  status:     { type: DataTypes.ENUM(...ENUMS.subscriptionStatus), defaultValue: 'active' },
  startedAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  expiresAt:  { type: DataTypes.DATE, allowNull: false },
  autoRenew:  { type: DataTypes.BOOLEAN, defaultValue: true },
  paymentRef: { type: DataTypes.STRING(255) },
}, {
  tableName: 'company_subscriptions',
  updatedAt: false,
});

// ── 8. CV ────────────────────────────────────────────────────
const CV = sequelize.define('CV', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:        { type: DataTypes.UUID, allowNull: false },
  title:         { type: DataTypes.STRING(255) },
  status:        { type: DataTypes.ENUM(...ENUMS.cvStatus), defaultValue: 'uploaded' },
  isPrimary:     { type: DataTypes.BOOLEAN, defaultValue: false },
  fileUrl:       { type: DataTypes.TEXT },
  fileName:      { type: DataTypes.STRING(255) },
  fileSize:      { type: DataTypes.INTEGER },
  fileType:      { type: DataTypes.STRING(50) },
  storageKey:    { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
  parsedContent: { type: DataTypes.JSONB },
  atsScore:      { type: DataTypes.SMALLINT },
  qualityScore:  { type: DataTypes.SMALLINT },
  aiFeedback:    { type: DataTypes.JSONB },
  keywords:      { type: DataTypes.ARRAY(DataTypes.TEXT) },
  builderData:   { type: DataTypes.JSONB },
  language:      { type: DataTypes.STRING(10), defaultValue: 'ar' },
}, {
  tableName: 'cvs',
  indexes: [{ fields: ['user_id'] }, { fields: ['user_id', 'is_primary'] }],
});

// ── 9. JobCategory ───────────────────────────────────────────
const JobCategory = sequelize.define('JobCategory', {
  id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:      { type: DataTypes.STRING(100), allowNull: false },
  nameAr:    { type: DataTypes.STRING(100) },
  slug:      { type: DataTypes.STRING(100), unique: true },
  parentId:  { type: DataTypes.UUID },
  icon:      { type: DataTypes.STRING(50) },
  sortOrder: { type: DataTypes.SMALLINT, defaultValue: 0 },
}, {
  tableName:  'job_categories',
  timestamps: false,
});

// ── 10. Job ──────────────────────────────────────────────────
const Job = sequelize.define('Job', {
  id:               { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  companyId:        { type: DataTypes.UUID, allowNull: false },
  postedBy:         { type: DataTypes.UUID },
  categoryId:       { type: DataTypes.UUID },
  status:           { type: DataTypes.ENUM(...ENUMS.jobStatus), defaultValue: 'draft' },
  title:            { type: DataTypes.STRING(255), allowNull: false },
  titleAr:          { type: DataTypes.STRING(255) },
  description:      { type: DataTypes.TEXT, allowNull: false },
  descriptionAr:    { type: DataTypes.TEXT },
  requirements:     { type: DataTypes.TEXT },
  benefits:         { type: DataTypes.TEXT },
  skillsRequired:   { type: DataTypes.ARRAY(DataTypes.TEXT) },
  jobType:          { type: DataTypes.ENUM(...ENUMS.jobType), defaultValue: 'full_time' },
  locationCountry:  { type: DataTypes.STRING(100) },
  locationCity:     { type: DataTypes.STRING(100) },
  isRemote:         { type: DataTypes.BOOLEAN, defaultValue: false },
  salaryMin:        { type: DataTypes.DECIMAL(12, 2) },
  salaryMax:        { type: DataTypes.DECIMAL(12, 2) },
  salaryCurrency:   { type: DataTypes.STRING(10), defaultValue: 'USD' },
  salaryVisible:    { type: DataTypes.BOOLEAN, defaultValue: true },
  easyApply:        { type: DataTypes.BOOLEAN, defaultValue: true },
  applicationEmail: { type: DataTypes.STRING(255) },
  applicationUrl:   { type: DataTypes.STRING(500) },
  deadline:         { type: DataTypes.DATEONLY },
  keywords:         { type: DataTypes.ARRAY(DataTypes.TEXT) },
  viewsCount:       { type: DataTypes.INTEGER, defaultValue: 0 },
  applicationsCount:{ type: DataTypes.INTEGER, defaultValue: 0 },
  approvedBy:       { type: DataTypes.UUID },
  approvedAt:       { type: DataTypes.DATE },
  rejectionReason:  { type: DataTypes.TEXT },
  slug:             { type: DataTypes.STRING(500), unique: true },
  closedAt:         { type: DataTypes.DATE },
  deletedAt:        { type: DataTypes.DATE },
}, {
  tableName: 'jobs',
  paranoid:  true,
  indexes: [
    { fields: ['company_id'] },
    { fields: ['status'] },
    { fields: ['category_id'] },
    { fields: ['created_at'] },
  ],
});

// ── 11. JobApplication ───────────────────────────────────────
const JobApplication = sequelize.define('JobApplication', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  jobId:         { type: DataTypes.UUID, allowNull: false },
  userId:        { type: DataTypes.UUID, allowNull: false },
  cvId:          { type: DataTypes.UUID },
  status:        { type: DataTypes.ENUM(...ENUMS.applicationStatus), defaultValue: 'sent' },
  matchScore:    { type: DataTypes.DECIMAL(5, 2) },
  aiSummary:     { type: DataTypes.TEXT },
  isAutoApplied: { type: DataTypes.BOOLEAN, defaultValue: false },
  applyMethod:   { type: DataTypes.STRING(50) },
  emailSentAt:   { type: DataTypes.DATE },
  emailOpenedAt: { type: DataTypes.DATE },
  coverLetter:   { type: DataTypes.TEXT },
  companyNote:   { type: DataTypes.TEXT },
  interviewAt:   { type: DataTypes.DATE },
  offerSalary:   { type: DataTypes.DECIMAL(12, 2) },
}, {
  tableName: 'job_applications',
  indexes: [
    { fields: ['job_id'] },
    { fields: ['user_id'] },
    { fields: ['status'] },
    { unique: true, fields: ['job_id', 'user_id'] },
  ],
});

// ── 12. TrainingSession ──────────────────────────────────────
const TrainingSession = sequelize.define('TrainingSession', {
  id:           { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:       { type: DataTypes.UUID, allowNull: false },
  jobId:        { type: DataTypes.UUID },
  title:        { type: DataTypes.STRING(255) },
  questions:    { type: DataTypes.JSONB },
  answers:      { type: DataTypes.JSONB },
  overallScore: { type: DataTypes.DECIMAL(5, 2) },
  aiFeedback:   { type: DataTypes.TEXT },
  durationSecs: { type: DataTypes.INTEGER },
  audioUrl:     { type: DataTypes.TEXT },
  transcript:   { type: DataTypes.TEXT },
  status:       { type: DataTypes.STRING(20), defaultValue: 'in_progress' },
  startedAt:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  completedAt:  { type: DataTypes.DATE },
}, {
  tableName: 'training_sessions',
  updatedAt: false,
});

// ── 13. CourseCategory ───────────────────────────────────────
const CourseCategory = sequelize.define('CourseCategory', {
  id:       { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:     { type: DataTypes.STRING(100), allowNull: false },
  nameAr:   { type: DataTypes.STRING(100) },
  slug:     { type: DataTypes.STRING(100), unique: true },
  parentId: { type: DataTypes.UUID },
  icon:     { type: DataTypes.STRING(50) },
}, {
  tableName:  'course_categories',
  timestamps: false,
});

// ── 14. Course ───────────────────────────────────────────────
const Course = sequelize.define('Course', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  createdBy:     { type: DataTypes.UUID },
  categoryId:    { type: DataTypes.UUID },
  status:        { type: DataTypes.ENUM(...ENUMS.courseStatus), defaultValue: 'draft' },
  title:         { type: DataTypes.STRING(255), allowNull: false },
  titleAr:       { type: DataTypes.STRING(255) },
  description:   { type: DataTypes.TEXT },
  descriptionAr: { type: DataTypes.TEXT },
  thumbnailUrl:  { type: DataTypes.TEXT },
  language:      { type: DataTypes.STRING(10), defaultValue: 'ar' },
  level:         { type: DataTypes.STRING(20), defaultValue: 'beginner' },
  tags:          { type: DataTypes.ARRAY(DataTypes.TEXT) },
  skillsCovered: { type: DataTypes.ARRAY(DataTypes.TEXT) },
  price:         { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  currency:      { type: DataTypes.STRING(10), defaultValue: 'USD' },
  isFree:        { type: DataTypes.BOOLEAN, defaultValue: false },
  discountPct:   { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  enrolledCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  ratingAvg:     { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  ratingCount:   { type: DataTypes.INTEGER, defaultValue: 0 },
  slug:          { type: DataTypes.STRING(500), unique: true },
}, {
  tableName: 'courses',
});

// ── 15. CourseLesson ─────────────────────────────────────────
const CourseLesson = sequelize.define('CourseLesson', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  courseId:      { type: DataTypes.UUID, allowNull: false },
  title:         { type: DataTypes.STRING(255), allowNull: false },
  contentType:   { type: DataTypes.ENUM(...ENUMS.contentType), allowNull: false },
  fileUrl:       { type: DataTypes.TEXT },
  storageKey:    { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
  durationSecs:  { type: DataTypes.INTEGER },
  sortOrder:     { type: DataTypes.SMALLINT, defaultValue: 0 },
  isFreePreview: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'course_lessons',
  updatedAt: false,
});

// ── 16. UserCourse ───────────────────────────────────────────
const UserCourse = sequelize.define('UserCourse', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:      { type: DataTypes.UUID, allowNull: false },
  courseId:    { type: DataTypes.UUID, allowNull: false },
  progressPct: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  completed:   { type: DataTypes.BOOLEAN, defaultValue: false },
  completedAt: { type: DataTypes.DATE },
  paymentRef:  { type: DataTypes.STRING(255) },
  enrolledAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'user_courses',
  updatedAt: false,
  indexes: [{ unique: true, fields: ['user_id', 'course_id'] }],
});

// ── 17. LessonProgress ───────────────────────────────────────
const LessonProgress = sequelize.define('LessonProgress', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:      { type: DataTypes.UUID, allowNull: false },
  lessonId:    { type: DataTypes.UUID, allowNull: false },
  completed:   { type: DataTypes.BOOLEAN, defaultValue: false },
  watchedSecs: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'lesson_progress',
  createdAt: false,
  updatedAt: 'updated_at',
  indexes: [{ unique: true, fields: ['user_id', 'lesson_id'] }],
});

// ── 18. LearningPath ─────────────────────────────────────────
const LearningPath = sequelize.define('LearningPath', {
  id:                 { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:             { type: DataTypes.UUID, allowNull: false },
  goal:               { type: DataTypes.TEXT },
  currentSkills:      { type: DataTypes.ARRAY(DataTypes.TEXT) },
  missingSkills:      { type: DataTypes.ARRAY(DataTypes.TEXT) },
  recommendedCourses: { type: DataTypes.ARRAY(DataTypes.UUID) },
  aiNotes:            { type: DataTypes.TEXT },
  generatedAt:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'learning_paths',
  createdAt: 'generated_at',
  updatedAt: 'updated_at',
});

// ── 19. CommunityPost ────────────────────────────────────────
const CommunityPost = sequelize.define('CommunityPost', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:        { type: DataTypes.UUID, allowNull: false },
  category:      { type: DataTypes.ENUM(...ENUMS.postCategory), defaultValue: 'general' },
  content:       { type: DataTypes.TEXT, allowNull: false },
  mediaUrls:     { type: DataTypes.ARRAY(DataTypes.TEXT) },
  tags:          { type: DataTypes.ARRAY(DataTypes.TEXT) },
  isPinned:      { type: DataTypes.BOOLEAN, defaultValue: false },
  isHidden:      { type: DataTypes.BOOLEAN, defaultValue: false },
  likesCount:    { type: DataTypes.INTEGER, defaultValue: 0 },
  commentsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  viewsCount:    { type: DataTypes.INTEGER, defaultValue: 0 },
  deletedAt:     { type: DataTypes.DATE },
}, {
  tableName: 'community_posts',
  paranoid:  true,
  indexes: [{ fields: ['user_id'] }, { fields: ['category'] }, { fields: ['created_at'] }],
});

// ── 20. PostComment ──────────────────────────────────────────
const PostComment = sequelize.define('PostComment', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  postId:     { type: DataTypes.UUID, allowNull: false },
  userId:     { type: DataTypes.UUID, allowNull: false },
  parentId:   { type: DataTypes.UUID },
  content:    { type: DataTypes.TEXT, allowNull: false },
  likesCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  isHidden:   { type: DataTypes.BOOLEAN, defaultValue: false },
  deletedAt:  { type: DataTypes.DATE },
}, {
  tableName: 'post_comments',
  paranoid:  true,
});

// ── 21. PostLike ─────────────────────────────────────────────
const PostLike = sequelize.define('PostLike', {
  id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:    { type: DataTypes.UUID, allowNull: false },
  postId:    { type: DataTypes.UUID },
  commentId: { type: DataTypes.UUID },
}, {
  tableName: 'post_likes',
  updatedAt: false,
  indexes: [
    { unique: true, fields: ['user_id', 'post_id'] },
    { unique: true, fields: ['user_id', 'comment_id'] },
  ],
});

// ── 22. PostReport ───────────────────────────────────────────
const PostReport = sequelize.define('PostReport', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  reporterId: { type: DataTypes.UUID, allowNull: false },
  postId:     { type: DataTypes.UUID },
  commentId:  { type: DataTypes.UUID },
  reason:     { type: DataTypes.STRING(100) },
  details:    { type: DataTypes.TEXT },
  resolved:   { type: DataTypes.BOOLEAN, defaultValue: false },
  resolvedBy: { type: DataTypes.UUID },
}, {
  tableName: 'post_reports',
  updatedAt: false,
});

// ── 23. ChatCategory ─────────────────────────────────────────
const ChatCategory = sequelize.define('ChatCategory', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:        { type: DataTypes.STRING(100), allowNull: false },
  nameAr:      { type: DataTypes.STRING(100) },
  description: { type: DataTypes.TEXT },
  icon:        { type: DataTypes.STRING(50) },
  sortOrder:   { type: DataTypes.SMALLINT, defaultValue: 0 },
  createdBy:   { type: DataTypes.UUID },
}, {
  tableName: 'chat_categories',
  updatedAt: false,
});

// ── 24. ChatRoom ─────────────────────────────────────────────
const ChatRoom = sequelize.define('ChatRoom', {
  id:                 { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  categoryId:         { type: DataTypes.UUID },
  createdBy:          { type: DataTypes.UUID },
  name:               { type: DataTypes.STRING(255), allowNull: false },
  nameAr:             { type: DataTypes.STRING(255) },
  description:        { type: DataTypes.TEXT },
  roomType:           { type: DataTypes.ENUM(...ENUMS.roomType), defaultValue: 'text' },
  accessType:         { type: DataTypes.ENUM(...ENUMS.roomAccess), defaultValue: 'public' },
  maxMembers:         { type: DataTypes.INTEGER, defaultValue: 500 },
  freeMinutesPerWeek: { type: DataTypes.INTEGER, defaultValue: 60 },
  paidPricePerHour:   { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  isPremium:          { type: DataTypes.BOOLEAN, defaultValue: false },
  pricePerAccess:     { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  isActive:           { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'chat_rooms',
});

// ── 25. ChatMessage ──────────────────────────────────────────
const ChatMessage = sequelize.define('ChatMessage', {
  id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  roomId:    { type: DataTypes.UUID, allowNull: false },
  senderId:  { type: DataTypes.UUID, allowNull: false },
  content:   { type: DataTypes.TEXT },
  mediaUrl:  { type: DataTypes.TEXT },
  mediaType: { type: DataTypes.STRING(30) },
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'chat_messages',
  updatedAt: false,
  indexes: [{ fields: ['room_id', 'created_at'] }],
});

// ── 26. ChatTimeUsage ────────────────────────────────────────
const ChatTimeUsage = sequelize.define('ChatTimeUsage', {
  id:           { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:       { type: DataTypes.UUID, allowNull: false },
  roomId:       { type: DataTypes.UUID, allowNull: false },
  weekStart:    { type: DataTypes.DATEONLY, allowNull: false },
  freeMinsUsed: { type: DataTypes.INTEGER, defaultValue: 0 },
  paidMinsUsed: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'chat_time_usage',
  createdAt: false,
  updatedAt: 'updated_at',
  indexes: [{ unique: true, fields: ['user_id', 'room_id', 'week_start'] }],
});

// ── 27. DirectMessage ────────────────────────────────────────
const DirectMessage = sequelize.define('DirectMessage', {
  id:                   { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  senderId:             { type: DataTypes.UUID, allowNull: false },
  recipientId:          { type: DataTypes.UUID, allowNull: false },
  content:              { type: DataTypes.TEXT },
  mediaUrl:             { type: DataTypes.TEXT },
  mediaType:            { type: DataTypes.STRING(30) },
  isRead:               { type: DataTypes.BOOLEAN, defaultValue: false },
  readAt:               { type: DataTypes.DATE },
  isDeletedBySender:    { type: DataTypes.BOOLEAN, defaultValue: false },
  isDeletedByRecipient: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'direct_messages',
  updatedAt: false,
  indexes: [
    { fields: ['sender_id', 'created_at'] },
    { fields: ['recipient_id', 'created_at'] },
  ],
});

// ── 28. Wallet ───────────────────────────────────────────────
const Wallet = sequelize.define('Wallet', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:        { type: DataTypes.UUID, allowNull: false, unique: true },
  pointsBalance: { type: DataTypes.INTEGER, defaultValue: 0 },
  cashBalance:   { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00 },
  currency:      { type: DataTypes.STRING(10), defaultValue: 'USD' },
  isFrozen:      { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'wallets',
});

// ── 29. WalletTransaction ────────────────────────────────────
const WalletTransaction = sequelize.define('WalletTransaction', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  walletId:       { type: DataTypes.UUID, allowNull: false },
  type:           { type: DataTypes.ENUM(...ENUMS.transactionType), allowNull: false },
  pointsDelta:    { type: DataTypes.INTEGER, defaultValue: 0 },
  cashDelta:      { type: DataTypes.DECIMAL(12, 2), defaultValue: 0.00 },
  description:    { type: DataTypes.TEXT },
  referenceId:    { type: DataTypes.UUID },
  referenceType:  { type: DataTypes.STRING(50) },
  paymentGateway: { type: DataTypes.STRING(50) },
  gatewayRef:     { type: DataTypes.STRING(255) },
  createdBy:      { type: DataTypes.UUID },
}, {
  tableName: 'wallet_transactions',
  updatedAt: false,
  indexes: [{ fields: ['wallet_id', 'created_at'] }],
});

// ── 30. Referral ─────────────────────────────────────────────
const Referral = sequelize.define('Referral', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  referrerId:    { type: DataTypes.UUID, allowNull: false },
  refereeId:     { type: DataTypes.UUID, allowNull: false, unique: true },
  referralCode:  { type: DataTypes.STRING(20), allowNull: false },
  rewardGiven:   { type: DataTypes.BOOLEAN, defaultValue: false },
  rewardGivenAt: { type: DataTypes.DATE },
}, {
  tableName: 'referrals',
  updatedAt: false,
  indexes: [{ fields: ['referrer_id'] }],
});

// ── 31. Notification ─────────────────────────────────────────
const Notification = sequelize.define('Notification', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:        { type: DataTypes.UUID, allowNull: false },
  title:         { type: DataTypes.STRING(255), allowNull: false },
  titleAr:       { type: DataTypes.STRING(255) },
  body:          { type: DataTypes.TEXT },
  bodyAr:        { type: DataTypes.TEXT },
  type:          { type: DataTypes.STRING(50) },
  channel:       { type: DataTypes.ENUM(...ENUMS.notificationChannel), defaultValue: 'in_app' },
  referenceId:   { type: DataTypes.UUID },
  referenceType: { type: DataTypes.STRING(50) },
  isRead:        { type: DataTypes.BOOLEAN, defaultValue: false },
  readAt:        { type: DataTypes.DATE },
  sentAt:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'notifications',
  updatedAt: false,
  indexes: [{ fields: ['user_id', 'is_read', 'created_at'] }],
});

// ── 32. AuditLog ─────────────────────────────────────────────
const AuditLog = sequelize.define('AuditLog', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  actorId:    { type: DataTypes.UUID, allowNull: false },
  action:     { type: DataTypes.STRING(100), allowNull: false },
  entityType: { type: DataTypes.STRING(50) },
  entityId:   { type: DataTypes.UUID },
  oldValue:   { type: DataTypes.JSONB },
  newValue:   { type: DataTypes.JSONB },
  ipAddress:  { type: DataTypes.INET },
  userAgent:  { type: DataTypes.TEXT },
}, {
  tableName: 'audit_logs',
  updatedAt: false,
  indexes: [
    { fields: ['actor_id', 'created_at'] },
    { fields: ['entity_type', 'entity_id'] },
  ],
});

// ── 33. UserConnection ───────────────────────────────────────
const UserConnection = sequelize.define('UserConnection', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  followerId:  { type: DataTypes.UUID, allowNull: false },
  followingId: { type: DataTypes.UUID, allowNull: false },
}, {
  tableName: 'user_connections',
  updatedAt: false,
  indexes: [
    { unique: true, fields: ['follower_id', 'following_id'] },
    { fields: ['follower_id'] },
    { fields: ['following_id'] },
  ],
});

// ============================================================
// ASSOCIATIONS
// ============================================================

User.hasMany(OtpToken,       { foreignKey: 'userId', as: 'otpTokens' });
User.hasMany(RefreshToken,   { foreignKey: 'userId', as: 'refreshTokens' });
User.hasOne(Wallet,          { foreignKey: 'userId', as: 'wallet' });
User.hasMany(CV,             { foreignKey: 'userId', as: 'cvs' });
User.hasMany(JobApplication, { foreignKey: 'userId', as: 'applications' });
User.hasMany(TrainingSession,{ foreignKey: 'userId', as: 'trainingSessions' });
User.hasMany(UserCourse,     { foreignKey: 'userId', as: 'enrolledCourses' });
User.hasMany(CommunityPost,  { foreignKey: 'userId', as: 'posts' });
User.hasMany(PostComment,    { foreignKey: 'userId', as: 'comments' });
User.hasMany(PostLike,       { foreignKey: 'userId', as: 'likes' });
User.hasMany(ChatMessage,    { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(DirectMessage,  { foreignKey: 'senderId', as: 'sentDMs' });
User.hasMany(DirectMessage,  { foreignKey: 'recipientId', as: 'receivedDMs' });
User.hasMany(Notification,   { foreignKey: 'userId', as: 'notifications' });
User.hasMany(Referral,       { foreignKey: 'referrerId', as: 'referralsMade' });
User.hasOne(LearningPath,    { foreignKey: 'userId', as: 'learningPath' });
User.hasMany(UserConnection, { foreignKey: 'followerId', as: 'following' });
User.hasMany(UserConnection, { foreignKey: 'followingId', as: 'followers' });
User.hasMany(Company,        { foreignKey: 'ownerId', as: 'ownedCompanies' });
User.hasMany(AuditLog,       { foreignKey: 'actorId', as: 'auditLogs' });

OtpToken.belongsTo(User,     { foreignKey: 'userId', as: 'user' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Wallet.belongsTo(User,       { foreignKey: 'userId', as: 'user' });
CV.belongsTo(User,           { foreignKey: 'userId', as: 'user' });

Company.belongsTo(User,             { foreignKey: 'ownerId', as: 'owner' });
Company.hasMany(Job,                { foreignKey: 'companyId', as: 'jobs' });
Company.hasMany(CompanyMember,      { foreignKey: 'companyId', as: 'members' });
Company.hasMany(CompanySubscription,{ foreignKey: 'companyId', as: 'subscriptions' });
CompanyMember.belongsTo(Company,    { foreignKey: 'companyId' });
CompanyMember.belongsTo(User,       { foreignKey: 'userId', as: 'user' });
CompanySubscription.belongsTo(Company,       { foreignKey: 'companyId' });
CompanySubscription.belongsTo(SubscriptionPlan, { foreignKey: 'planId', as: 'plan' });

Job.belongsTo(Company,      { foreignKey: 'companyId', as: 'company' });
Job.belongsTo(JobCategory,  { foreignKey: 'categoryId', as: 'category' });
Job.hasMany(JobApplication, { foreignKey: 'jobId', as: 'applications' });
JobApplication.belongsTo(Job,  { foreignKey: 'jobId', as: 'job' });
JobApplication.belongsTo(User, { foreignKey: 'userId', as: 'applicant' });
JobApplication.belongsTo(CV,   { foreignKey: 'cvId', as: 'cv' });
JobCategory.hasMany(Job,           { foreignKey: 'categoryId', as: 'jobs' });
JobCategory.belongsTo(JobCategory, { foreignKey: 'parentId', as: 'parent' });
JobCategory.hasMany(JobCategory,   { foreignKey: 'parentId', as: 'children' });

Course.belongsTo(CourseCategory,  { foreignKey: 'categoryId', as: 'category' });
Course.hasMany(CourseLesson,      { foreignKey: 'courseId', as: 'lessons' });
Course.hasMany(UserCourse,        { foreignKey: 'courseId', as: 'enrolments' });
CourseLesson.belongsTo(Course,    { foreignKey: 'courseId', as: 'course' });
CourseLesson.hasMany(LessonProgress, { foreignKey: 'lessonId', as: 'progress' });
UserCourse.belongsTo(User,        { foreignKey: 'userId', as: 'user' });
UserCourse.belongsTo(Course,      { foreignKey: 'courseId', as: 'course' });
LessonProgress.belongsTo(User,    { foreignKey: 'userId', as: 'user' });
LessonProgress.belongsTo(CourseLesson, { foreignKey: 'lessonId', as: 'lesson' });
CourseCategory.belongsTo(CourseCategory, { foreignKey: 'parentId', as: 'parent' });
CourseCategory.hasMany(CourseCategory,   { foreignKey: 'parentId', as: 'children' });

CommunityPost.belongsTo(User,      { foreignKey: 'userId', as: 'author' });
CommunityPost.hasMany(PostComment, { foreignKey: 'postId', as: 'comments' });
CommunityPost.hasMany(PostLike,    { foreignKey: 'postId', as: 'likes' });
PostComment.belongsTo(CommunityPost, { foreignKey: 'postId', as: 'post' });
PostComment.belongsTo(User,          { foreignKey: 'userId', as: 'author' });
PostComment.belongsTo(PostComment,   { foreignKey: 'parentId', as: 'parent' });
PostComment.hasMany(PostComment,     { foreignKey: 'parentId', as: 'replies' });
PostLike.belongsTo(User,             { foreignKey: 'userId', as: 'user' });

ChatRoom.belongsTo(ChatCategory, { foreignKey: 'categoryId', as: 'category' });
ChatRoom.hasMany(ChatMessage,    { foreignKey: 'roomId', as: 'messages' });
ChatCategory.hasMany(ChatRoom,   { foreignKey: 'categoryId', as: 'rooms' });
ChatMessage.belongsTo(ChatRoom,  { foreignKey: 'roomId', as: 'room' });
ChatMessage.belongsTo(User,      { foreignKey: 'senderId', as: 'sender' });
DirectMessage.belongsTo(User,    { foreignKey: 'senderId', as: 'sender' });
DirectMessage.belongsTo(User,    { foreignKey: 'recipientId', as: 'recipient' });

Wallet.hasMany(WalletTransaction,    { foreignKey: 'walletId', as: 'transactions' });
WalletTransaction.belongsTo(Wallet,  { foreignKey: 'walletId', as: 'wallet' });

Referral.belongsTo(User, { foreignKey: 'referrerId', as: 'referrer' });
Referral.belongsTo(User, { foreignKey: 'refereeId',  as: 'referee' });

TrainingSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });
TrainingSession.belongsTo(Job,  { foreignKey: 'jobId',  as: 'job' });

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  sequelize,
  Sequelize,
  User, OtpToken, RefreshToken,
  Company, CompanyMember, SubscriptionPlan, CompanySubscription,
  JobCategory, Job, JobApplication,
  CV,
  TrainingSession,
  CourseCategory, Course, CourseLesson, UserCourse, LessonProgress, LearningPath,
  CommunityPost, PostComment, PostLike, PostReport,
  ChatCategory, ChatRoom, ChatMessage, ChatTimeUsage, DirectMessage,
  Wallet, WalletTransaction, Referral,
  Notification, AuditLog, UserConnection,
};